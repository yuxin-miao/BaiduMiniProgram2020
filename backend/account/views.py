import requests
import json

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import (
    login as django_login,
    authenticate,
    logout as django_logout
)

from account.serializers import (
    LoginSerializer,
    ChangePasswordSerializer,
    UserDetailSerializer
)

from account.models import User
from backend.settings import APP_KEY, APP_SECRET


class AccountViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['POST'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 前端发送code到后端,后端发送网络请求到微信服务器换取openid
        print('Start login...')
        print(request.data)
        code = request.data.get('code')
        if not code:
            return Response({'message': '缺少code'}, status=status.HTTP_400_BAD_REQUEST)

        print('Fetch openid with code...')
        r = requests.post('https://spapi.baidu.com/oauth/jscode2sessionkey', data={
            'code': code,
            'client_id': APP_KEY,
            'sk': APP_SECRET
        })

        res = json.loads(r.text)
        openid = res['openid'] if 'openid' in res else None
        session_key = res['session_key'] if 'session_key' in res else None

        print('Fetched response', res)

        if not openid:
            return Response({'message': 'OAuth调用失败'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # 判断用户是否第一次登录
        user = User.objects.filter(openid=openid).first()
        if user is None:
            print('First login, creating user...')
            try:
                username = openid
                # username = request.data.get('userInfo').get('nickName')
                # gender = request.data.get('userInfo').get('gender')
                # avatar = request.data.get('userInfo').get('avatarUrl')
                user = User.objects.create(
                    username=username,
                    openid=openid,
                    session_key=session_key
                )
                user.set_password(openid)
            except Exception:
                print('百度用户数据错误')
                return Response({'detail': '百度用户数据错误'}, status=status.HTTP_400_BAD_REQUEST)


        if user is None:
            print('登陆失败')
            return Response({'detail': '登陆失败'}, status=status.HTTP_406_NOT_ACCEPTABLE)

        django_login(request, user)
        print('Login success')
        print({
            'openid': openid,
            'session_key': session_key,
            'username': user.username,
            'avatar': user.avatar
        })
        return Response(status=status.HTTP_200_OK, data={
            'openid': openid,
            'session_key': session_key,
            'username': user.username,
            'avatar': user.avatar
        })

    @action(detail=False, methods=['POST'])
    def logout(self, request):
        django_logout(request)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            error = '表单填写错误'
        elif not request.user.check_password(serializer.validated_data['old_password']):
            error = '原密码错误'
        else:
            success = '密码更改成功'
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response(data={'detail': success}, status=status.HTTP_202_ACCEPTED)
        return Response(data={'detail': error}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def user(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
