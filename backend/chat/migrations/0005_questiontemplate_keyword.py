# Generated by Django 3.1.3 on 2020-11-27 04:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_delete_keyword'),
    ]

    operations = [
        migrations.AddField(
            model_name='questiontemplate',
            name='keyword',
            field=models.CharField(blank=True, max_length=128, null=True, verbose_name='关键词'),
        ),
    ]
