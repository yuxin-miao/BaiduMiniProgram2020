from rest_framework import routers

from account.views import AccountViewSet
from mood.views import MoodRecordViewSet
from chat.views import MessageViewSet

router = routers.SimpleRouter()

router.register(r'account', AccountViewSet, basename='account')
router.register(r'mood', MoodRecordViewSet, basename='mood')
router.register(r'message', MessageViewSet, basename='message')

urlpatterns = router.urls
