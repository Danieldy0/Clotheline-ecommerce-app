#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting web server..."
# This executes whatever CMD is passed by the Dockerfile or your cloud provider (e.g., Gunicorn)
exec "$@"