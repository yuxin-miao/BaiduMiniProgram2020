from django.db import models

from django.contrib.auth.models import AbstractUser

from account.constants import UserGender


# Create your models here.

class User(AbstractUser):
    # should be gender, however to adapt the variable name of BaiduMP
    gender = models.SmallIntegerField(choices=UserGender.choices, default=UserGender.UNKNOWN, verbose_name="性别")
    avatar = models.URLField(max_length=256, null=True, blank=True, verbose_name="头像")
    openid = models.CharField(max_length=64, db_index=True, verbose_name='openid')
    session_key = models.CharField(max_length=64, db_index=True, verbose_name='session_key')

    class Meta:
        db_table = 'tb_users'
        verbose_name = '用户'
        verbose_name_plural = verbose_name
