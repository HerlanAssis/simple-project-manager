from django.urls import path, include
from .views import pdf

urlpatterns = [
    path('detail/<int:id>', pdf.DetailReportByTaskManager.as_view()),
    path('resume/<str:ids>', pdf.ResumeReportByTaskManager.as_view()),
]
