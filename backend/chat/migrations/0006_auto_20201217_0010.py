# Generated by Django 3.1.3 on 2020-12-16 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_questiontemplate_keyword'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questiontemplate',
            name='process_type',
            field=models.IntegerField(choices=[(0, '普通匹配'), (1, '感恩日志'), (2, '心情记录'), (3, '输入昵称'), (4, '机器人问答')], verbose_name='处理类型'),
        ),
    ]
