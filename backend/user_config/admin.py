from django.contrib import admin

from user_config.models import ToolboxStatus


class ToolboxStatusAdmin(admin.ModelAdmin):
    list_display = ('user', 'updated_at',)
    search_fields = ('user__username',)


admin.site.register(ToolboxStatus, ToolboxStatusAdmin)
