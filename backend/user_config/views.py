from django.utils import timezone
from datetime import datetime

from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin, RetrieveModelMixin, ListModelMixin

from user_config.models import ToolboxStatus
from user_config.serializers import (
    ToolboxStatusSerializer,
    ToolboxStatusUnlockSerializer
)

from backend.permissions import IsAuthenticated


class ToolBoxViewSet(
    viewsets.GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin
):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return ToolboxStatus.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'unlock':
            return ToolboxStatusUnlockSerializer
        return ToolboxStatusSerializer

    def list(self, request, *args, **kwargs):
        try:
            toolbox_status = self.get_queryset().first()
            if toolbox_status is None:
                toolbox_status = ToolboxStatus.objects.create(user=request.user)

            serializer = self.get_serializer(instance=toolbox_status)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({'detail': '获取工具箱状态失败'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def unlock(self, request):
        try:
            serializer = self.get_serializer(data=request.data)

            if not serializer.is_valid():
                return Response(data={'detail': '表单填写错误'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                item_key = serializer.validated_data['item']
                toolbox_status = self.get_queryset().first()
                if toolbox_status is None:
                    toolbox_status = ToolboxStatus.objects.create(user=request.user)
                item_key = item_key + '_unlocked'
                if item_key in toolbox_status.status:
                    toolbox_status.status[item_key] = True
                    toolbox_status.save()
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(data={'detail': '要解锁的键值不存在'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(data={'detail': '工具箱状态解锁失败'}, status=status.HTTP_400_BAD_REQUEST)
