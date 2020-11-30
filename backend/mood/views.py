from django.utils import timezone
from datetime import datetime

from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, RetrieveModelMixin, CreateModelMixin

from mood.models import MoodRecord
from mood.serializers import (
    MoodRecordDetailSerializer,
    MoodRecordMiniSerializer,
    MoodRecordMonthSerializer,
    MoodRecordDaySerializer
)
from mood.constants import MoodType

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
        if self.action == 'day':
            return MoodRecordDaySerializer
        if self.action == 'month':
            return MoodRecordMonthSerializer
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
            year = serializer.data.get('year', None)
            month = serializer.data.get('month', None)
            day = serializer.data.get('day', None)

            if year and month and day:
                create_time = timezone.get_default_timezone().localize(datetime(year=year, month=month, day=day))
                record = MoodRecord.objects.create(
                    user=request.user,
                    type=type,
                    description=description,
                )
                record.created_at = create_time
                record.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                record = MoodRecord.objects.create(
                    user=request.user,
                    type=type,
                    description=description,
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response({'detail': '心情记录数据错误'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def day(self, request):
        serializer = self.get_serializer(data=request.GET)
        if not serializer.is_valid():
            error = '表单填写错误'
        else:
            year = serializer.validated_data['year']
            month = serializer.validated_data['month']
            day = serializer.validated_data['day']

            # fetch the latest mood record that day
            mood_record = self.get_queryset().filter(user=request.user).filter(
                created_at__year=year,
                created_at__month=month,
                created_at__day=day
            ).exclude(type=MoodType.GRATITUDE).order_by('-id').first()
            mood_data = MoodRecordDetailSerializer(mood_record).data
            return Response(data=mood_data, status=status.HTTP_200_OK)
        return Response(data={'detail': error}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def month(self, request):
        serializer = self.get_serializer(data=request.GET)
        if not serializer.is_valid():
            error = '表单填写错误'
        else:
            year = serializer.validated_data['year']
            month = serializer.validated_data['month']

            # get all mood records in a month
            mood_records = self.get_queryset().filter(user=request.user).filter(
                created_at__year=year,
                created_at__month=month,
            ).exclude(type=MoodType.GRATITUDE)

            # only reserve the latest record of each day
            mood_values = mood_records.values('id', 'created_at')
            tz = timezone.get_current_timezone()

            for i in range(len(mood_values)):
                mood_values[i]['created_at'] = tz.normalize(mood_values[i]['created_at'])

            for i in range(len(mood_values)):
                if i > 0 and mood_values[i]['created_at'].day == mood_values[i - 1]['created_at'].day:
                    mood_records = mood_records.exclude(id=mood_values[i]['id'])

            # get all gratitude journals in a month
            gratitude_journals = MoodRecord.objects.filter(user=request.user).filter(
                created_at__year=year,
                created_at__month=month,
                type=MoodType.GRATITUDE
            ).order_by('created_at')

            mood_data = MoodRecordMiniSerializer(mood_records, many=True).data
            gratitude_data = MoodRecordDetailSerializer(gratitude_journals, many=True).data
            return Response(data={
                'moodList': mood_data,
                'gratitudeList': gratitude_data
            }, status=status.HTTP_200_OK)
        return Response(data={'detail': error}, status=status.HTTP_400_BAD_REQUEST)
