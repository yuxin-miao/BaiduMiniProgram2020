from pprint import pprint

from django.utils import timezone
from django.db.models import Q
import requests
import json
from datetime import datetime

from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.viewsets import ModelViewSet

from mood.models import MoodRecord
from chat.models import QuestionTemplate, Message, QuestionRecord, Choice
from chat.serializers import (
    MessageSerializer,
    MessageReplySerializer,
    QuestionTemplateSerializer,
    QuestionTemplateMiniSerializer,
    QuestionTemplateEditSerializer,
    MessageMatchingSerializer,
    ChoiceSerializer,
    RobotQuerySerializer
)
from chat.constants import ReplyType, ProcessType
from mood.constants import MoodType

from backend.permissions import IsAuthenticated
from backend.filters import TitleFilterBackend


class MessageViewSet(
    viewsets.GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    CreateModelMixin
):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Message.objects.order_by('created_at')

    def get_serializer_class(self):
        if self.action == 'list':
            return MessageSerializer
        if self.action == 'create':
            return MessageSerializer
        if self.action == 'reply':
            return MessageReplySerializer
        if self.action == 'bye':
            return MessageReplySerializer
        if self.action == 'talk_finished':
            return MessageReplySerializer
        if self.action == 'get_question':
            return MessageMatchingSerializer
        if self.action == 'robot':
            return RobotQuerySerializer
        return MessageSerializer

    def list(self, request, *args, **kwargs):
        objs = self.get_queryset().filter(Q(receiver=request.user) | Q(sender=request.user))
        serializer = self.get_serializer(objs, many=True)
        return response.Response(serializer.data)

    @action(detail=False, methods=['POST'])
    def reply(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            content = serializer.data.get('content')

            if len(content) == 0:
                return Response({'detail': '消息内容不可为空'}, status=status.HTTP_400_BAD_REQUEST)

            last_question_record = QuestionRecord.objects.filter(user=request.user).order_by('-created_at').first()

            if last_question_record is None or last_question_record.answered:
                Message.objects.create(sender=request.user, content=content)

                question = QuestionTemplate.gen_question()

                if question is None:
                    return Response({'detail': '没有可选问题'}, status=status.HTTP_400_BAD_REQUEST)
                QuestionRecord.objects.create(user=request.user, question=question)
                msg = Message.objects.create(receiver=request.user, content=question.title)
                return Response(data={
                    'message': MessageSerializer(msg).data,
                    'question': QuestionTemplateSerializer(question).data
                }, status=status.HTTP_200_OK)

            last_question = last_question_record.question

            if last_question.reply_type == ReplyType.CHOICE:
                if last_question.choice_set.count() == 0:
                    return Response({'detail': '问题无选项'}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    choice_idx = int(content)
                except Exception as e:
                    return Response({'detail': '回复非整数'}, status=status.HTTP_400_BAD_REQUEST)
                if choice_idx >= last_question.choice_set.count():
                    return Response({'detail': '选项越界'}, status=status.HTTP_400_BAD_REQUEST)

                selected_choice = last_question.get_choice(choice_idx)

                if selected_choice is not None:
                    if last_question.process_type == ProcessType.MOOD_RECORD:
                        MoodRecord.objects.create(user=request.user, type=choice_idx,
                                                  description=selected_choice.reply_content)
                    # 1. create 2 messages
                    # 2. mark last question as answered
                    # 3. create new QuestionRecord
                    # 4. return generated message and next question
                    msg = None
                    next_question = selected_choice.dest_question
                    Message.objects.create(sender=request.user, content=selected_choice.reply_content)
                    last_question_record.answered = True
                    last_question_record.save()
                    if next_question is not None:
                        msg = Message.objects.create(receiver=request.user, content=next_question.title)
                        QuestionRecord.objects.create(user=request.user, question=next_question)
                    return Response(data={
                        'message': MessageSerializer(msg).data,
                        'question': QuestionTemplateSerializer(next_question).data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': '选项越界'}, status=status.HTTP_400_BAD_REQUEST)
            elif last_question.reply_type == ReplyType.RAW:
                # if reply_type==raw, record whatever the user types
                Message.objects.create(sender=request.user, content=content)

                if last_question.process_type == ProcessType.NICKNAME:
                    if len(content) > 5:
                        msg = Message.objects.create(receiver=request.user, content='昵称太长啦，请重新输入')
                        # Return original question
                        return Response(data={
                            'message': MessageSerializer(msg).data,
                            'question': QuestionTemplateSerializer(last_question).data
                        }, status=status.HTTP_200_OK)

                    request.user.nickname = content
                    request.user.save()
                    last_question_record.answered = True
                    last_question_record.save()
                    msg = None
                    question = last_question.next_question()
                    if question is not None:
                        QuestionRecord.objects.create(user=request.user, question=question)
                        msg = Message.objects.create(receiver=request.user, content=question.title)
                    return Response(data={
                        'message': MessageSerializer(msg).data,
                        'question': QuestionTemplateSerializer(question).data
                    }, status=status.HTTP_200_OK)
                elif last_question.process_type == ProcessType.GRATITUDE_JOURNAL:
                    MoodRecord.objects.create(user=request.user, type=MoodType.GRATITUDE, description=content)

                    msg = None
                    question = last_question.next_question()
                    last_question_record.answered = True
                    last_question_record.save()
                    if question is not None:
                        QuestionRecord.objects.create(user=request.user, question=question)
                        msg = Message.objects.create(receiver=request.user, content=question.title)
                    return Response(data={
                        'message': MessageSerializer(msg).data,
                        'question': QuestionTemplateSerializer(question).data
                    }, status=status.HTTP_200_OK)
                elif last_question.process_type == ProcessType.ORDINARY:
                    last_question_record.answered = True
                    last_question_record.save()
                    msg = None
                    question = last_question.next_question()
                    if question is not None:
                        QuestionRecord.objects.create(user=request.user, question=question)
                        msg = Message.objects.create(receiver=request.user, content=question.title)
                    return Response(data={
                        'message': MessageSerializer(msg).data,
                        'question': QuestionTemplateSerializer(question).data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': '问题处理类型错误'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'detail': '问题回复类型错误'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(str(e))
            return Response({'detail': '无法解析回答'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def get_question(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'detail': '无法获取问题，表单填写错误'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            matching = serializer.validated_data.get('matching', None)

            if matching is None or len(matching) == 0:
                # return a random choice from all root question
                question = QuestionTemplate.gen_question()
                if question is None:
                    return Response({'detail': '没有可选问题'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                question = QuestionTemplate.gen_question(matching=matching)
                if question is None:
                    question = QuestionTemplate.gen_question()
                    if question is None:
                        return Response({'detail': '没有可选问题'}, status=status.HTTP_400_BAD_REQUEST)

            QuestionRecord.objects.create(user=request.user, question=question)
            msg = Message.objects.create(receiver=request.user, content=question.title)
            return Response(data={
                'message': MessageSerializer(msg).data,
                'question': QuestionTemplateSerializer(question).data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({'detail': '无法获取问题'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def get_last_question(self, request):
        try:
            last_question_record = QuestionRecord.objects.filter(user=request.user).order_by('-created_at').first()

            if last_question_record is None:
                return Response(data=QuestionTemplateSerializer(None).data, status=status.HTTP_200_OK)

            return Response(data=QuestionTemplateSerializer(last_question_record.question).data,
                            status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({'detail': '无法获取最后问题'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def bye(self, request):
        try:
            QuestionRecord.objects.filter(user=request.user).update(answered=True)
            request.user.chat_session_id = None
            request.user.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({'detail': '无法结束对话'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def talk_finished(self, request):
        try:
            qr = QuestionRecord.objects.filter(user=request.user).order_by('-created_at').first()
            if qr is None or qr.answered:
                return Response(data={'talk_finished': True}, status=status.HTTP_200_OK)
            else:
                return Response(data={'talk_finished': False}, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({'detail': '处理失败'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def robot(self, request):
        try:
            reply = request.POST.get('query', None)

            Message.objects.create(sender=request.user, content=reply)

            oauth_url = 'https://aip.baidubce.com/oauth/2.0/token'
            r = requests.post(oauth_url, data={
                'grant_type': 'client_credentials',
                'client_id': 'VbP6roV1inSg7ozAz3tVpIhC',
                'client_secret': '94Zp5y4RnGT6afu8zmdLirYUcW2CwjG2'
            })
            res = r.json()
            access_token = res.get('access_token', None)

            url = 'https://aip.baidubce.com/rpc/2.0/unit/service/chat?access_token=' + access_token
            headers = {
                'Content-Type': 'application/json; charset=UTF-8',
            }

            post_data = {
                "log_id": str(
                    timezone.now()) + " " + request.user.username if request.user.nickname is None else request.user.nickname,
                "version": "2.0",
                "service_id": "S41976",
                "session_id": "" if request.user.chat_session_id is None else request.user.chat_session_id,
                "request": {
                    "query": reply,
                    "user_id": request.user.username
                },
                "dialog_state": {
                    "contexts": {
                        "SYS_REMEMBERED_SKILLS": ["1066347"]
                    }
                }
            }
            r = requests.post(url, data=json.dumps(post_data), headers=headers)
            res = r.json()

            if res.get('error_code', None) is None or res.get('error_code', None) != 0:
                print(res)
                return Response({'detail': '百度聊天机器人处理失败'}, status=status.HTTP_400_BAD_REQUEST)

            res_data = res.get('result', None)

            pprint(res_data)

            if res_data.get('session_id', None) is not None:
                request.user.chat_session_id = res_data.get('session_id', None)
                request.user.save()

            reply = res_data.get('response_list', None)[0]
            action = reply.get('action_list', None)[0]
            reply_content = action.get('say', "")

            msg = Message.objects.create(receiver=request.user, content=reply_content)

            return Response(data={
                'message': MessageSerializer(msg).data,
                'question': {
                    'title': reply_content,
                    'reply_type': ReplyType.RAW,
                    'process_type': ProcessType.ROBOT,
                    'choices': []
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(str(e))
            return Response({'detail': '处理失败'}, status=status.HTTP_400_BAD_REQUEST)


class QuestionViewSet(ModelViewSet):
    queryset = QuestionTemplate.objects.all().order_by('-id')
    permission_classes = [IsAuthenticated]
    filter_backends = (TitleFilterBackend,)

    def get_serializer_class(self):
        if self.action == 'list':
            return QuestionTemplateMiniSerializer
        return QuestionTemplateEditSerializer


class ChoiceViewSet(ModelViewSet):
    queryset = Choice.objects.all().order_by('id')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return ChoiceSerializer
