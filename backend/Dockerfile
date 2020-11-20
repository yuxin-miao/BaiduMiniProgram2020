FROM python:3.6.5
ENV PYTHONUNBUFFERED 1

WORKDIR /xiaou
COPY requirements.txt /xiaou/
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/
RUN pip install -r requirements.txt
