FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpq-dev \
    nginx

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    tokenizer \
    xml \
    json \
    bcmath

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /app

# Copy application code
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Generate application key
RUN php artisan key:generate --force

# Run migrations and seeders
RUN php artisan migrate --force && php artisan db:seed --force

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "8000"]
