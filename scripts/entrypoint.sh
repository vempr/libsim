#!/bin/bash
set -e

# Ensure SQLite DB file exists with correct permissions
if [ ! -f /var/www/html/database/database.sqlite ]; then
  touch /var/www/html/database/database.sqlite
fi
chmod 777 /var/www/html/database/database.sqlite

# Run migrations safely
php artisan migrate --force

# Start nginx + php-fpm server (using base image's start script)
exec /start.sh
