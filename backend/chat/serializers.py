from rest_framework import serializers
from chat.models import Message, QuestionTemplate, Choice


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('sender', 'receiver', 'content', 'created_at')


class MessageReplySerializer(serializers.Serializer):
    content = serializers.CharField(max_length=128)


class MessageMatchingSerializer(serializers.Serializer):
    matching = serializers.CharField(max_length=128, required=False)


class QuestionTemplateSerializer(serializers.ModelSerializer):
    choices = serializers.SerializerMethodField()

    class Meta:
        model = QuestionTemplate
        fields = ('id', 'title', 'reply_type', 'process_type', 'choices')

    def get_choices(self, instance):
        return instance.choice_set.values('title', 'reply_content')


class QuestionTemplateEditSerializer(serializers.ModelSerializer):
    choices = serializers.SerializerMethodField()

    class Meta:
        model = QuestionTemplate
        fields = ('id', 'root', 'title', 'reply_type', 'process_type', 'keyword', 'choices')

    def get_choices(self, instance):
        return instance.choice_set.values(
            'id',
            'title',
            'reply_content',
            'question',
            'dest_question',
            'dest_question__title'
        )


class QuestionTemplateMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionTemplate
        fields = ('id', 'root', 'title', 'reply_type', 'process_type',)


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'title', 'reply_content', 'question', 'dest_question',)

#
# class MoodRecordDetailSerializer(serializers.ModelSerializer):
#     year = serializers.IntegerField(required=False)
#     month = serializers.IntegerField(required=False)
#     day = serializers.IntegerField(required=False)
#
#     class Meta:
#         model = MoodRecord
#         fields = ('type', 'description', 'created_at', 'year', 'month', 'day')
#
#
# class MoodRecordMonthSerializer(serializers.Serializer):
#     year = serializers.IntegerField()
#     month = serializers.IntegerField()
#
#
# class MoodRecordDaySerializer(serializers.Serializer):
#     year = serializers.IntegerField()
#     month = serializers.IntegerField()
#     day = serializers.IntegerField()
