FROM richarvey/nginx-php-fpm:3.1.6

COPY . .

# Environment variables for Laravel
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# Set working directory
WORKDIR /var/www/html

# Install composer dependencies, generate key, cache config and routes, run migrations (SQLite creates DB automatically)
RUN composer install --no-dev --optimize-autoloader && \
    php artisan key:generate && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan migrate --force

CMD ["/start.sh"]
