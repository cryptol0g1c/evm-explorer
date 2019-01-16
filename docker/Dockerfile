FROM keymetrics/pm2:8-alpine

COPY docker/docker-entrypoint /usr/local/bin/

RUN apk add --update --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git \
    && chmod +x /usr/local/bin/docker-entrypoint

WORKDIR /app

COPY package*.json ./

RUN npm install \
    && npm cache clean --force \
    && apk del .gyp

COPY . ./

ENTRYPOINT ["docker-entrypoint"]