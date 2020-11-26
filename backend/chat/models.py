from random import choice
from django.db import models

from account.models import User
from chat.constants import ReplyType, ProcessType


class Message(models.Model):
    '''
    Chat Messages History
    '''
    # sender=NULL: sent by XiaoU
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="发送方",
        related_name='sent_messages',
        related_query_name='sent_message',
        null=True,
        blank=True
    )
    # receiver=NULL: sent to XiaoU
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="接收方",
        related_name='received_messages',
        related_query_name='received_message',
        null=True,
        blank=True
    )
    content = models.TextField(verbose_name="消息内容")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.content if (self.content is not None) else '空消息'

    class Meta:
        verbose_name = '聊天记录'
        verbose_name_plural = verbose_name


class QuestionTemplate(models.Model):
    '''
    Question Template
    '''
    root = models.BooleanField(default=False, verbose_name="根问题")
    title = models.CharField(max_length=256, verbose_name="问题内容")
    reply_type = models.IntegerField(choices=ReplyType.choices, verbose_name="回复类型")
    process_type = models.IntegerField(choices=ProcessType.choices, verbose_name="处理类型")

    def __str__(self):
        return self.title

    @classmethod
    def gen_question(cls):
        return choice(cls.objects.filter(root=True))

    def next_question(self, choice_idx=None):
        if choice_idx:
            pass
        else:
            if self.choice_set.count() == 0:
                return self.gen_question()
            return self.choice_set.first().question

    class Meta:
        verbose_name = '问题模板'
        verbose_name_plural = verbose_name


class QuestionRecord(models.Model):
    '''
    Instances of Question. Each QuestionRecord belongs to a user.
    User's messages reply to the most recent QuestionRecord.
    '''
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="所属用户")
    question = models.ForeignKey(QuestionTemplate, on_delete=models.CASCADE, verbose_name="问题模板")
    answered = models.BooleanField(default=False, verbose_name="已回答")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return '[{0}] {1}'.format(self.user.username, self.question.title)

    class Meta:
        verbose_name = '问题记录'
        verbose_name_plural = verbose_name


class Choice(models.Model):
    question = models.ForeignKey(QuestionTemplate, on_delete=models.CASCADE, verbose_name="所属问题")
    dest_question = models.ForeignKey(
        QuestionTemplate,
        on_delete=models.CASCADE,
        verbose_name="指向问题",
        null=True,
        blank=True,
        related_name='+'
    )
    title = models.TextField(verbose_name="选项内容")
    reply_content = models.TextField(verbose_name="回复内容")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        if self.question is None:
            return '[{0}] None -> {1}'.format(self.title, self.dest_question.id)
        if self.dest_question is None:
            return '[{0}] {1} -> None'.format(self.title, self.question.id)
        return '[{0}] {1} -> {2}'.format(self.title, self.question.id, self.dest_question.id)

    class Meta:
        verbose_name = '问题选项'
        verbose_name_plural = verbose_name


class Keyword(models.Model):
    question = models.ForeignKey(QuestionTemplate, on_delete=models.CASCADE, verbose_name="所属问题")
    title = models.CharField(max_length=32, verbose_name="关键词")

    def __str__(self):
        return '[{0}] {1}'.format(self.question.id, self.title)

    class Meta:
        verbose_name = '匹配关键词'
        verbose_name_plural = verbose_name
