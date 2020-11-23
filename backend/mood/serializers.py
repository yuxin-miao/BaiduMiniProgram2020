from rest_framework import serializers
from mood.models import MoodRecord


class MoodRecordMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        fields = ('id', 'type', 'created_at',)


class MoodRecordDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        fields = ('id', 'type', 'description', 'created_at',)
