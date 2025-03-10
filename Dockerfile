# Stage 1 - Build Frontend
FROM node:20-slim as client_build

WORKDIR /code
COPY ./client/package*.json ./
RUN npm install

COPY ./client .
RUN npm run build

# Stage 2 - Django Backend with Frontend Files
FROM python:3.12.3-slim

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
