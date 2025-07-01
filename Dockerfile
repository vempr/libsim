FROM richarvey/nginx-php-fpm:3.1.6

# Copy project files
COPY . /var/www/html

# Set working directory
WORKDIR /var/www/html

# Environment variables (optional, can be set on Render dashboard)
ENV APP_ENV=production
ENV APP_DEBUG=false

# Install composer dependencies without dev packages, optimize autoloader
RUN composer install --no-dev --optimize-autoloader

# Generate app key, cache config and routes (migrations NOT here)
RUN php artisan key:generate && \
    php artisan config:cache && \
    php artisan route:cache

# Copy entrypoint script
COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
