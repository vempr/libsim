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

# Copy application files (before installing npm dependencies, so .env can be used if needed)
COPY . .

# Set up build arguments for Vite (Crucial for production)
ARG VITE_REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT
ARG VITE_REVERB_SCHEME

# Pass build arguments as environment variables during npm run build
# Using a subshell to ensure environment variables are set for the npm command
RUN npm ci && \
    VITE_REVERB_APP_KEY="${VITE_REVERB_APP_KEY}" \
    VITE_REVERB_HOST="${VITE_REVERB_HOST}" \
    VITE_REVERB_PORT="${VITE_REVERB_PORT}" \
    VITE_REVERB_SCHEME="${VITE_REVERB_SCHEME}" \
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

# Set proper permissions (including for supervisor socket)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache \
    && mkdir -p /var/log/supervisor \
    && chown -R www-data:www-data /var/log/supervisor \
    && mkdir -p /var/www/html/storage/supervisor \
    && chown -R www-data:www-data /var/www/html/storage/supervisor \
    && chmod -R 775 /var/www/html/storage/supervisor

# Expose ports
EXPOSE 10000
EXPOSE 8080

# Start services
CMD bash -c "php artisan migrate --force && supervisord -c /etc/supervisor/supervisord.conf & php-fpm & nginx -g 'daemon off;'"