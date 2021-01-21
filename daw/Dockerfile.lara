FROM srlopez/laravel:6.12
LABEL description="LaraWeb"
# ===
ARG CACHEBUST=1
RUN git clone https://srlopez@dev.azure.com/srlopez/laraweb/_git/laraweb
# ===
RUN rm -rf /var/www/laravel && \
    mv /laraweb/app /var/www/laravel && \
    rm -rf /laraweb && \
    cd /var/www/laravel && \
    npm install && \
    composer install && \
    /bin/chown www-data:www-data -R /var/www/laravel/storage /var/www/laravel/bootstrap/cache
