from django.db import models

from account.models import User


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="反馈用户")
    system_info = models.CharField(max_length=256, null=True, blank=True)
    content = models.TextField(verbose_name="反馈内容")
    created_at = models.DateTimeField(auto_now=True, verbose_name="创建时间")

    class Meta:
        verbose_name = '用户反馈工单'
        verbose_name_plural = verbose_name


class FeedbackMessage(models.Model):
    # sender=NULL: official reply
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, verbose_name="所属工单")
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="发送方",
        null=True,
        blank=True
    )
    content = models.TextField(verbose_name="回复内容")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = '用户反馈回复'
        verbose_name_plural = verbose_name
