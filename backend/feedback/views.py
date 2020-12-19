from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin

from feedback.models import Feedback, FeedbackMessage
from feedback.serializers import (
    FeedbackDetailSerializer,
    FeedbackMiniSerializer,
    FeedbackMessageSerializer,
    FeedbackReplySerializer
)

from backend.permissions import IsAuthenticated, IsStaff


class FeedbackViewSet(
    viewsets.GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin
):

    def get_queryset(self):
        return Feedback.objects.filter(user=self.request.user).order_by('-id')

    def get_serializer_class(self):
        if self.action == 'list':
            return FeedbackMiniSerializer
        if self.action == 'reply' or self.action == 'official_reply':
            return FeedbackReplySerializer
        return FeedbackDetailSerializer

    def get_permissions(self):
        if self.action == 'official_reply':
            permission_classes = [IsAuthenticated, IsStaff]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)

            if serializer.is_valid():
                obj = Feedback.objects.create(
                    user=request.user,
                    system_info=serializer.data.get('system_info', None),
                    content=serializer.data.get('content')
                )
                return Response(self.get_serializer(instance=obj).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'detail': '创建用户反馈失败'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def reply(self, request, pk=None):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            content = serializer.validated_data['content']

            obj = FeedbackMessage.objects.create(
                feedback=self.get_object(),
                sender=request.user,
                content=content
            )
            return Response(data=FeedbackMessageSerializer(instance=obj).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def official_reply(self, request, pk=None):
        '''
        Create an official reply to a feedback. Requires higher permission.
        '''
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            content = serializer.validated_data['content']

            obj = FeedbackMessage.objects.create(
                feedback=self.get_object(),
                content=content
            )
            return Response(data=FeedbackMessageSerializer(instance=obj).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
