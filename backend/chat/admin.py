from django.contrib import admin
from django.contrib.admin import ModelAdmin

from chat.models import QuestionTemplate, QuestionRecord, Choice, Message

admin.site.register(QuestionTemplate)
admin.site.register(QuestionRecord)
admin.site.register(Choice)
admin.site.register(Message)
