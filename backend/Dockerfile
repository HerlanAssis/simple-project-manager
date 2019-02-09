FROM python:3

ENV PYTHONUNBUFFERED 1
RUN mkdir /simple_project_manager
WORKDIR /simple_project_manager
COPY requirements.txt /simple_project_manager/
RUN pip install -r requirements.txt
COPY . /simple_project_manager/
