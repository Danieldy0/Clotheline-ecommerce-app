# Use official Python runtime as base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG False

# Set work directory
WORKDIR /app

# Install runtime dependencies for Postgres
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . /app/

# Set a temporary environment variable just for the build process
ENV SECRET_KEY=temporary_build_key_value

# Collect static files
RUN python manage.py collectstatic --noinput

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 8000

# Use the ENTRYPOINT to ensure migrations always run
ENTRYPOINT ["/app/entrypoint.sh"]