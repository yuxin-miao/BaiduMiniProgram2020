#!/bin/sh

python manage.py collectstatic
cp -r ./static/. ./frontend/build/static
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
