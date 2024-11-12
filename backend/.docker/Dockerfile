# Base image php 8.2
FROM php:8.2-fpm

# Installation des dépendances système
RUN apt-get update && \
    apt-get install -y \
        unzip \
        libzip-dev \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        && docker-php-ext-configure zip && \
        docker-php-ext-install zip

# Installation de Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Assurer que le script PHP-FPM reste en mode foreground
CMD ["php-fpm"]

