from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, RetrieveModelMixin, CreateModelMixin

from mood.models import MoodRecord
from mood.serializers import MoodRecordDetailSerializer, MoodRecordMiniSerializer

from backend.permissions import IsAuthenticated


class MoodRecordViewSet(
    viewsets.GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    CreateModelMixin
):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return MoodRecord.objects.filter(user=self.request.user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'list':
            return MoodRecordMiniSerializer
        return MoodRecordDetailSerializer

    def list(self, request, *args, **kwargs):
        objs = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(objs, many=True)
        return response.Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            type = serializer.data.get('type')
            description = serializer.data.get('description')
            record = MoodRecord.objects.create(
                user=request.user,
                type=type,
                description=description,
            )
        except Exception:
            return Response({'detail': '心情记录数据错误'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
