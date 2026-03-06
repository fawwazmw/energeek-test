FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpq-dev \
    postgresql-client \
    bash

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    mbstring \
    bcmath

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /app/energeek-be

# Copy composer files first for better layer caching
COPY energeek-be/composer.json energeek-be/composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code
COPY energeek-be/ ./

# Copy entrypoint script
COPY energeek-be/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /app/energeek-be/storage /app/energeek-be/bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "8000"]
