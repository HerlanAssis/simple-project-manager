from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.settings import api_settings
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML, CSS

from apps.tasks.models import TaskManager

def convertTaskManagersToDetailReport(taskmanagers):
  lines = []
  
  cell_columns_names = [
    'Projeto',
    'Tarefas atrasadas',
    'Tarefas bloquedas',
    'Tarefas completas atrasadas',
    'Tarefas completas',
    'Tarefas abertas',
    'Total'
  ]

  lines.append(cell_columns_names)

  for taskmanager in taskmanagers:
    cell = []
    cell.append(taskmanager.project_name)
    cell.append(taskmanager.qtd_overdue_tasks)
    cell.append(taskmanager.qtd_blocked_tasks)
    cell.append(taskmanager.qtd_tasks_completed_late)
    cell.append(taskmanager.qtd_completed_tasks)
    cell.append(taskmanager.qtd_open_tasks)
    cell.append(taskmanager.qtd_tasks)
    
    lines.append(cell)
  return lines


class ORIENTATIONS:
  LANDSCAPE = 'landscape'
  PORTRAYED = 'A4'

class ReportAPIView(APIView):
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    permission_classes = (IsAuthenticated,)

    def response_file(self, filename='report.pdf', title='Report', data=[], template_name='', orientation=ORIENTATIONS.LANDSCAPE):
      path = '/tmp'
      fullpath = '{}/{}'.format(path, filename)
      template_base = 'reports'
      template = '{}/{}'.format(template_base, template_name)
      context = {
        'title': title,
        'lines': data
      }

      html_string = render_to_string(template, context)
      html = HTML(string=html_string)
      style = '@page {}{}{}'.format('{', 'size: {}; margin: 0.5cm'.format(orientation) , '}')

      css = CSS(string=style)
      html.write_pdf(target=fullpath, stylesheets=[css])

      fs = FileSystemStorage(path)
      with fs.open(filename) as pdf:
          response = HttpResponse(pdf, content_type='application/pdf')
          response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
          return response

      return response


class DetailReportByTaskManager(ReportAPIView):
  def get(self, request, id, format=None):    
    return HttpResponse('')


class ResumeReportByTaskManager(ReportAPIView):
  def get(self, request, id, format=None):

    filename = '{}.pdf'.format(request.user.username)
    title = 'Relatório resumido de projetos'
    data = convertTaskManagersToDetailReport(TaskManager.objects.all())
    template_name = 'detail_report_by_task_manager.html'

    response = self.response_file(
      filename=filename,
      title=title,
      data=data,
      template_name=template_name,
      orientation=ORIENTATIONS.LANDSCAPE
    )

    return response