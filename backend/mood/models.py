from django.db import models

from account.models import User
from mood.constants import MoodType


class MoodRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户")
    type = models.IntegerField(choices=MoodType.choices, verbose_name="心情类型")
    description = models.TextField(null=True, blank=True, verbose_name="心情描述")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = '心情记录'
        verbose_name_plural = verbose_name
