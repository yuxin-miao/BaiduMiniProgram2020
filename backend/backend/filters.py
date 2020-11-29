from rest_framework import filters


class TitleFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        title = request.query_params.get('title', None)
        if title:
            return queryset.filter(title__contains=title)
        return queryset

# class StatusFilterBackend(filters.BaseFilterBackend):
#     def filter_queryset(self, request, queryset, view):
#         status = request.query_params.get('status', None)
#         if status:
#             return queryset.filter(status=status)
#         return queryset
#
#
# class TypeFilterBackend(filters.BaseFilterBackend):
#     def filter_queryset(self, request, queryset, view):
#         jp_type = request.query_params.get('type', None)
#         if jp_type:
#             return queryset.filter(type=jp_type)
#         return queryset
