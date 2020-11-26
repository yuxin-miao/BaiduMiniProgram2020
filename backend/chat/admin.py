from django.contrib import admin

from chat.models import QuestionTemplate, QuestionRecord, Choice, Message


class QuestionTemplateAdmin(admin.ModelAdmin):
    list_display = ('title', 'reply_type', 'process_type', 'root')
    list_filter = ('reply_type', 'process_type', 'root')
    search_fields = ('title',)


class QuestionRecordAdmin(admin.ModelAdmin):
    list_display = ('question', 'user', 'answered', 'updated_at')
    list_filter = ('answered',)


class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'question', 'dest_question', 'created_at')


admin.site.register(QuestionTemplate, QuestionTemplateAdmin)
admin.site.register(QuestionRecord, QuestionRecordAdmin)
admin.site.register(Choice, ChoiceAdmin)
admin.site.register(Message)
