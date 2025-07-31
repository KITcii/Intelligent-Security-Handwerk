FROM nginx:1.27.3

ARG SERVICE_DIR="./nginx"
ARG SHARED_DIR="./shared"
ARG TIMEZONE=CET
ARG APP_HOST="localhost"
ARG DEPLOY_ENV=production
ARG WWW_USER_GROUP_UID=1099
ARG WWW_USER_UID=1099

ENV APP_HOST=${APP_HOST}
ENV DEPLOY_ENV=${DEPLOY_ENV}

# helper scripts (removed on cleanup)
COPY ${SHARED_DIR}/scripts/ /tmp/scripts/
RUN chmod -R 777 /tmp/scripts/

# set timezone
RUN /tmp/scripts/set_timezone.sh ${TIMEZONE}

# install default software packages
RUN /tmp/scripts/install_packages.sh

# healthcheck
COPY ${SERVICE_DIR}/scripts/healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh
HEALTHCHECK --interval=15s --timeout=3s --start-period=30s \  
    CMD exec /usr/local/bin/healthcheck.sh "https://${APP_HOST}/health" "alive"

# custom config reload script
COPY ${SERVICE_DIR}/scripts/reload-config.sh /docker-entrypoint.d/60-reload-config.sh
RUN chmod +x /docker-entrypoint.d/60-reload-config.sh

RUN /tmp/scripts/create_user.sh www-nginx www-nginx ${WWW_USER_UID} ${WWW_USER_GROUP_UID}

# cleanup
RUN /tmp/scripts/cleanup.sh

# run docker as a non-root user
RUN chown -R www-nginx: /var/cache/nginx && \
    chown -R www-nginx: /var/log/nginx && \
    chown -R www-nginx: /etc/nginx/conf.d
USER www-nginx

EXPOSE 80 443

CMD ["nginx"]
