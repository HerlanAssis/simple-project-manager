from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.settings import api_settings
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML

from apps.tasks.models import TaskManager

def convertTaskManagerArrayToPDFReportFormat(taskmanagers):
  lines = []
  cell_columns_names = ['Tarefas atrasadas', 'Tarefas bloquedas', 'Tarefas completas', 'Tarefas completas atrasadas', 'Tarefas abertas', 'Total', 'Progresso']

  lines.append(cell_columns_names)

  for taskmanager in taskmanagers:
    cell = []
    cell.append(taskmanager.qtd_overdue_tasks)
    cell.append(taskmanager.qtd_overdue_tasks)
    cell.append(taskmanager.qtd_overdue_tasks)
    cell.append(taskmanager.qtd_overdue_tasks)
    cell.append(taskmanager.qtd_overdue_tasks)
    cell.append(taskmanager.qtd_tasks)
    cell.append(taskmanager.progress)
    
    lines.append(cell)

  return lines

class ReportAPIView(APIView):
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    permission_classes = (IsAuthenticated,)   


class DetailReportByTaskManager(ReportAPIView):
  def get(self, request, id, format=None):
    path='/tmp'
    filename='{}.pdf'.format(request.user.username)
    fullpath='{}/{}'.format(path, filename)
    

    taskmanagers = TaskManager.objects.all()
    lines = convertTaskManagerArrayToPDFReportFormat(taskmanagers)

    print(lines)

    paragraphs = ['first paragraph', 'second paragraph', 'third paragraph']
    html_string = render_to_string('reports/detail_report_by_task_manager.html', {'title': 'TESTE', 'lines': lines})

    html = HTML(string=html_string)
    html.write_pdf(target=fullpath)

    fs = FileSystemStorage(path)
    with fs.open(filename) as pdf:
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
        return response

    return response

class ResumeReportByTaskManager(ReportAPIView):
  def get(self, request, id, format=None):
    return HttpResponse('')