from django.db import models


class News(models.Model):
    content = models.TextField(verbose_name="新闻内容")
    created_at = models.DateTimeField(auto_now=True, verbose_name="创建时间")

    class Meta:
        verbose_name = '新闻'
        verbose_name_plural = verbose_name
