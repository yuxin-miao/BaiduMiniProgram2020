from django.contrib import admin

from feedback.models import Feedback, FeedbackMessage


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at',)
    search_fields = ('user__username',)


class FeedbackMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'created_at',)
    search_fields = ('sender__username',)


admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(FeedbackMessage, FeedbackMessageAdmin)
