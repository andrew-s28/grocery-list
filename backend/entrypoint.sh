#!/bin/bash

set -e

echo "${0}: running migrations."
python manage.py makemigrations --merge
python manage.py migrate --noinput

gunicorn grocery_api.wsgi:application \
    --name grocery_api \
    --bind 0.0.0.0:8001 \
    --timeout 600 \
    --workers 2 \
    --log-level=info \
    --reload \
    --preload