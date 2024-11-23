from datetime import date
from django.contrib import admin
from django.db.models.aggregates import Count
from django.utils.html import format_html, urlencode
from django.urls import reverse
from .models import *

# Register your models here.


class EventDetailInLine(admin.StackedInline):
    model = EventDetail
    extra = 0


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    autocomplete_fields = ['event_type']
    list_display = ['title', 'event_type', 'description',
                    'start_date', 'end_date', 'location', 'status', 'detail']
    list_select_related = ['event_type']
    list_filter = ['event_type']
    inlines = [EventDetailInLine]
    search_fields = ['title']

    def status(self, event):
        if date.today() > event.end_date:
            return 'Completed'
        elif date.today() < event.start_date:
            return 'Not Started'
        return 'Ongoing'

    def detail(self, event):
        url = (
            reverse('admin:api_eventdetail_changelist')
            + '?'
            + urlencode({'event__id': str(event.id)
                         }))

        return format_html('<a href="{}"> See Details</a>', url)


@admin.register(EventDetail)
class EventDetailAdmin(admin.ModelAdmin):
    list_display = ['event', 'task', 'tools', 'information', 'event_']
    list_select_related = ['event']

    def event_(self, event_detail):
        url = (
            reverse('admin:api_event_changelist')
            + '?'
            + urlencode({
                'id': str(event_detail.event.id)
            }))
        return format_html('<a href="{}">See Event </a>', url)


@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ['type', 'events']
    search_fields = ['type__istartswith']

    def events(self, event_type):
        url = (
            reverse('admin:api_event_changelist')
            + '?'
            + urlencode({
                'event_type__id': str(event_type.id)
            }))
        return format_html('<a href="{}">See Events</a>', url)


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']
    search_fields = ['username__istartswith']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    autocomplete_fields = ['event', 'participant']
    list_display = ['id', 'event_', 'participant_', 'enrollment_date']
    list_select_related = ['participant', 'event']
    list_filter = ['event']

    def event_(self, enrollment):
        url = (
            reverse('admin:api_event_changelist')
            + '?'
            + urlencode({
                'id': str(enrollment.event.id)
            }))
        return format_html('<a href="{}">{}</a>', url, enrollment.event.title)

    def participant_(self, enrollment):
        url = (
            reverse('admin:api_participant_changelist')
            + '?'
            + urlencode({
                'id': str(enrollment.participant.id)
            }))
        return format_html('<a href="{}">{}</a>', url, enrollment.participant.username)
