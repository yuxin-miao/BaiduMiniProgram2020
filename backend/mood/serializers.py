from rest_framework import serializers
from mood.models import MoodRecord


class MoodRecordMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        fields = ('type', 'created_at',)


class MoodRecordDetailSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField(required=False)
    month = serializers.IntegerField(required=False)
    day = serializers.IntegerField(required=False)

    class Meta:
        model = MoodRecord
        fields = ('type', 'description', 'created_at', 'year', 'month', 'day')


class MoodRecordMonthSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()


class MoodRecordDaySerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    day = serializers.IntegerField()
