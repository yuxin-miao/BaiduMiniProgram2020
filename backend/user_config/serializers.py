from rest_framework import serializers
from user_config.models import ToolboxStatus


class ToolboxStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolboxStatus
        fields = ('status',)


class ToolboxStatusUnlockSerializer(serializers.Serializer):
    item = serializers.CharField()
