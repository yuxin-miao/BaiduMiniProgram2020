# Generated by Django 3.1.3 on 2020-12-19 15:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('system_info', models.CharField(blank=True, max_length=256, null=True)),
                ('content', models.TextField(verbose_name='反馈内容')),
                ('created_at', models.DateTimeField(auto_now=True, verbose_name='创建时间')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='反馈用户')),
            ],
            options={
                'verbose_name': '用户反馈工单',
                'verbose_name_plural': '用户反馈工单',
            },
        ),
        migrations.CreateModel(
            name='FeedbackMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='回复内容')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('feedback', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feedback.feedback', verbose_name='所属工单')),
                ('sender', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='发送方')),
            ],
            options={
                'verbose_name': '用户反馈回复',
                'verbose_name_plural': '用户反馈回复',
            },
        ),
    ]
