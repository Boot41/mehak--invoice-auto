# Google Cloud Project Configuration
project_id = "boot41"
region     = "asia-south1"

# Container Deployment Configuration
service_name    = "mehak-auto-invoice"
container_image = "asia-south1-docker.pkg.dev/boot41/a3/mehak-auto-invoice"
container_tag   = "latest"

# Environment Variables (Optional)
environment_variables = {
  "DEBUG"                     = "false"
  "LOG_LEVEL"                 = "info"
  "DB_NAME"                   = "sample.sqlite3"
  "VITE_API_URL"             = "/api"
  "VITE_GOOGLE_CLIENT_ID"     = "726611225914-ahgg2o6ub87k9iake8mf8jqgbnu1bg3v.apps.googleusercontent.com"
  "VITE_ENV"                  = "development"
  "DJANGO_SECRET_KEY"        = "your-secret-key-here"
  "ALLOWED_HOSTS"            = "127.0.0.1"
  "DB_ENGINE"                = "django.db.backends.sqlite3"
  "GOOGLE_CLIENT_ID"         = "726611225914-ahgg2o6ub87k9iake8mf8jqgbnu1bg3v.apps.googleusercontent.com"
  "GROQ_API_KEY"             = "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"
  "JWT_ACCESS_TOKEN_LIFETIME_MINUTES" = "100"
  "JWT_REFRESH_TOKEN_LIFETIME_DAYS"    = "1"
}