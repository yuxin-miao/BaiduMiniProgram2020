from rest_framework import permissions

from account.models import User


class IsAuthenticated(permissions.BasePermission):
    message = 'Must login'

    def has_permission(self, request, view):
        return request.user.is_authenticated


class IsStaff(permissions.BasePermission):
    message = 'Must be staff'

    def has_permission(self, request, view):
        return request.user.is_staff


class IsSuperuser(permissions.BasePermission):
    message = 'Must be superuser'

    def has_permission(self, request, view):
        return request.user.is_superuser

#
# class QuitSociety(permissions.BasePermission):
#     message = '你未加入该社团，无法退出'
#
#     def has_permission(self, request, view):
#         return True
#
#     def has_object_permission(self, request, view, obj):
#         return request.user.student in obj.members.all()
