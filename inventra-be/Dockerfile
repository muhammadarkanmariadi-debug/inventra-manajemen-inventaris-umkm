FROM php:8.4-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libpng-dev libjpeg-dev \
    libfreetype6-dev libonig-dev unzip git curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo_mysql pdo_pgsql pgsql zip pcntl sockets bcmath mbstring

RUN pecl install swoole \
    && docker-php-ext-enable swoole

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock* ./
RUN composer install --optimize-autoloader --no-scripts

COPY . .




# Buat .env SEBELUM artisan dijalankan
RUN  php artisan key:generate \
    && composer dump-autoload --optimize \
    && php artisan optimize:clear || true

RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

 

EXPOSE 8000

CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000"]