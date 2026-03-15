#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn..."
exec gunicorn clothline_api.wsgi:application --bind 0.0.0.0:10000