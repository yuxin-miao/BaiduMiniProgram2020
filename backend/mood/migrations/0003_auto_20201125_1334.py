# Generated by Django 3.1.3 on 2020-11-25 05:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mood', '0002_auto_20201124_0527'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moodrecord',
            name='description',
            field=models.TextField(verbose_name='心情描述'),
        ),
    ]
