from rest_framework import routers

from account.views import AccountViewSet
from mood.views import MoodRecordViewSet
from chat.views import MessageViewSet, QuestionViewSet, ChoiceViewSet

router = routers.SimpleRouter()

router.register(r'account', AccountViewSet, basename='account')
router.register(r'mood', MoodRecordViewSet, basename='mood')
router.register(r'message', MessageViewSet, basename='message')
router.register(r'question', QuestionViewSet, basename='question')
router.register(r'choice', ChoiceViewSet, basename='choice')

urlpatterns = router.urls
