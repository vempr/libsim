FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libsqlite3-dev libpng-dev libonig-dev libxml2-dev \
    zip unzip nginx supervisor && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_sqlite mbstring exif pcntl bcmath gd

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build assets
RUN npm ci && \
    npm run build && \
    npm cache clean --force

# Database setup
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data database && \
    chmod 775 database && \
    chmod 664 database/database.sqlite

# Configure PHP-FPM
RUN mkdir -p /var/run/php && \
    echo "listen = 9000" >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo "pm.max_children = 5" >> /usr/local/etc/php-fpm.d/zz-docker.conf

# Copy Nginx and Supervisor configs
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/laravel-worker.conf /etc/supervisor/conf.d/laravel-worker.conf
COPY docker/supervisord.conf /etc/supervisor/supervisord.conf

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Create supervisor directory and set permissions
RUN mkdir -p /var/log/supervisor \
    && chown -R www-data:www-data /var/log/supervisor \
    && mkdir -p /var/www/html/storage/supervisor \
    && chown -R www-data:www-data /var/www/html/storage/supervisor \
    && chmod -R 775 /var/www/html/storage/supervisor # Ensure www-data can write here

# Expose ports
EXPOSE 10000
EXPOSE 8080

# Start services
CMD bash -c "php artisan migrate --force && supervisord -c /etc/supervisor/supervisord.conf & php-fpm & nginx -g 'daemon off;'"