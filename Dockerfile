FROM node:24-bookworm-slim AS mcp
WORKDIR /opt/mcp
RUN npm install --omit=dev --no-audit --no-fund grav-mcp@0.1.2
FROM php:8.4-apache-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends chromium fonts-liberation fonts-noto-core curl unzip libcurl4-openssl-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev libonig-dev libicu-dev libxml2-dev libsqlite3-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j2 gd zip mbstring intl opcache pdo_sqlite \
 && a2enmod rewrite headers && rm -rf /var/lib/apt/lists/*
COPY --from=mcp /usr/local/bin/node /usr/local/bin/node
COPY --from=mcp /opt/mcp /opt/mcp
RUN curl -fL --retry 3 https://getgrav.org/download/core/grav-admin/2.2.10 -o /tmp/grav.zip \
 && echo '64cbda280e3ef1531a250f8fefebb2f51466f5c013e4841c0794896e0bc208ab  /tmp/grav.zip' | sha256sum -c - \
 && unzip -q /tmp/grav.zip -d /tmp/grav && cp -a /tmp/grav/grav-admin/. /var/www/html/ \
 && mv /var/www/html/user /opt/grav-default-user && rm -rf /tmp/grav /tmp/grav.zip \
 && mkdir -p /var/www/html/user /opt/pdf/fonts \
 && chown -R www-data:www-data /var/www/html
COPY assets/fonts/ /opt/pdf/fonts/
COPY user/ /opt/commons-user/
COPY scripts/ /opt/commons-scripts/
COPY docker/apache.conf /etc/apache2/conf-enabled/commons.conf
RUN printf 'memory_limit=256M\npost_max_size=2M\nupload_max_filesize=2M\nexpose_php=Off\nlog_errors=On\ndisplay_errors=Off\n' > /usr/local/etc/php/conf.d/commons.ini
EXPOSE 80
ENTRYPOINT ["/bin/sh","/opt/commons-scripts/start.sh"]
CMD ["apache2-foreground"]
