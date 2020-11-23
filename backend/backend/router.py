from rest_framework import routers

from account.views import AccountViewSet
from mood.views import MoodRecordViewSet

router = routers.SimpleRouter()

router.register(r'account', AccountViewSet, basename='account')
router.register(r'mood', MoodRecordViewSet, basename='mood')

urlpatterns = router.urls
