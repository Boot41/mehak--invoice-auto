# Stage 1 - Build Frontend
FROM node:20-slim as client_build

WORKDIR /code
COPY ./client/package*.json ./
RUN npm install

# Copy client environment file
COPY ./client/.env ./.env

COPY ./client .
RUN npm run build

# Stage 2 - Django Backend with Frontend Files
FROM python:3.12.3-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=backend.settings \
    PYTHONPATH=/code \
    # Set default values for environment variables
    DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY:-your-secret-key-here} \
    DEBUG=${DEBUG:-True} \
    ALLOWED_HOSTS=${ALLOWED_HOSTS:-localhost,127.0.0.1} \
    DB_ENGINE=${DB_ENGINE:-django.db.backends.sqlite3} \
    DB_NAME=${DB_NAME:-db.sqlite3} \
    GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-726611225914-ahgg2o6ub87k9iake8mf8jqgbnu1bg3v.apps.googleusercontent.com} \
    GROQ_API_KEY=${GROQ_API_KEY:-} \
    JWT_ACCESS_TOKEN_LIFETIME_MINUTES=${JWT_ACCESS_TOKEN_LIFETIME_MINUTES:-60} \
    JWT_REFRESH_TOKEN_LIFETIME_DAYS=${JWT_REFRESH_TOKEN_LIFETIME_DAYS:-1}

# Set work directory
WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY server/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn whitenoise

# Copy frontend build files
COPY --from=client_build /code/dist/assets/ /code/static/assets/
COPY --from=client_build /code/dist/ /code/templates/

# Copy backend code and environment file
COPY ./server /code/
COPY ./server/.env /code/.env

# Create directory for SQLite database
RUN mkdir -p /code/data

# Create entrypoint script
RUN echo '#!/bin/sh\n\
python manage.py migrate\n\
python manage.py collectstatic --noinput\n\
exec "$@"' > /code/entrypoint.sh \
    && chmod +x /code/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/code/entrypoint.sh"]
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
