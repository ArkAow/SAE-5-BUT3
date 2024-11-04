FROM php:8.2-fpm

RUN apt-get update && \
    apt-get install -y unzip libzip-dev && \
    docker-php-ext-install zip && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
