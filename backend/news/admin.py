from django.contrib import admin

from news.models import News


class NewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'created_at',)
    search_fields = ('content',)


admin.site.register(News, NewsAdmin)
