from rest_framework import serializers
from account.models import User


class LoginSerializer(serializers.Serializer):
    code = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()


class ChangeNicknameSerializer(serializers.Serializer):
    nickname = serializers.CharField(max_length=5)


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'nickname', 'gender', 'avatar', 'openid', 'session_key')


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'openid')
