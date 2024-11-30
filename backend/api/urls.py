from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from rest_framework_nested import routers
from .views import *
from pprint import pprint

router = DefaultRouter()
router.register('participant', ParticipantViewSet)
router.register('event', EventViewSet)
router.register('detail', EventDetailViewSet)

event_router = routers.NestedSimpleRouter(router, 'event', lookup='event')
event_router.register('detail', NestedEventDetailViewSet,
                      basename='event-detail')
event_router.register('image', EventImageViewSet, basename='event-image')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(event_router.urls)),
    path('events/',
         EventList.as_view(), name='api-events'),
    path('events/<int:pk>/', EventDetails.as_view(), name='api-events_detail'),
    path('event_types/', EventTypeList.as_view(), name='api-event_type'),
    path('event_types/<int:pk>/', EventTypeDetail.as_view(),
         name='api-event_type-detail'),
    path('enrollments/', EnrollmentList.as_view())
]
