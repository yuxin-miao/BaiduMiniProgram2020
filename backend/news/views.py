from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, \
    DestroyModelMixin

from news.models import News
from news.serializers import (
    NewsSerializer
)

from backend.permissions import IsAuthenticated, IsStaff


class NewsViewSet(
    viewsets.GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin
):
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsStaff]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return News.objects.all().order_by('-id')

    def get_serializer_class(self):
        return NewsSerializer
