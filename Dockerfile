FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libsqlite3-dev libpng-dev libonig-dev libxml2-dev \
    zip unzip nginx && \
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

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure PHP-FPM
RUN mkdir -p /var/run/php && \
    echo "listen = 9000" >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo "pm.max_children = 5" >> /usr/local/etc/php-fpm.d/zz-docker.conf

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Expose port 10000 (Render's default)
EXPOSE 10000

# Start script
CMD bash -c "php-fpm & nginx -g 'daemon off;'"