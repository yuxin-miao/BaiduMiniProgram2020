from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from account.models import User


class MyUserAdmin(UserAdmin):
    list_display = ('username', 'nickname',)
    search_fields = ('username', 'nickname')


admin.site.register(User, MyUserAdmin)
