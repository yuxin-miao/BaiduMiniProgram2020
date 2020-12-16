from django.db import models

from account.models import User
from user_config.constants import toolbox_status_default


class ToolboxStatus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="用户")
    status = models.JSONField(verbose_name="状态", default=toolbox_status_default)
    updated_at = models.DateTimeField(auto_now=True, verbose_name="修改时间")

    class Meta:
        verbose_name = '工具箱状态'
        verbose_name_plural = verbose_name
