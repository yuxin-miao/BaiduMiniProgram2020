from rest_framework import serializers
from feedback.models import Feedback, FeedbackMessage


class FeedbackMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackMessage
        fields = ('sender', 'content', 'created_at',)


class FeedbackMiniSerializer(serializers.ModelSerializer):
    # abstract = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ('id', 'created_at',)

    # def get_abstract(self, obj):
    #     if len(obj.content) < 20:
    #         return obj.content
    #     else:
    #         return obj.content[:21] + '...'


class FeedbackDetailSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Feedback
        read_only_fields = ['id']
        fields = ('id', 'system_info', 'content', 'replies', 'created_at',)

    def get_replies(self, obj):
        if isinstance(obj, Feedback):
            msgs = FeedbackMessage.objects.filter(feedback=obj)
            return FeedbackMessageSerializer(instance=msgs, many=True).data
        return []


class FeedbackReplySerializer(serializers.Serializer):
    content = serializers.CharField()
