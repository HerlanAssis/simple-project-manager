from django.urls import path, include

urlpatterns = [
    # some other urls    
    path('pm/', include('apps.project_manager.urls')),
    path('c/', include('apps.clients.urls')),
    path('n/', include('apps.notifications.urls')),
    path('t/', include('apps.tasks.urls')),
    path('r/', include('apps.reports.urls')),    
]
