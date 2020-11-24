from rest_framework import serializers
from mood.models import MoodRecord


class MoodRecordMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        fields = ('type', 'created_at',)


class MoodRecordDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        fields = ('type', 'description', 'created_at',)


class MoodRecordMonthSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()


class MoodRecordDaySerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    day = serializers.IntegerField()
