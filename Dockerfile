FROM node:12-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN apk upgrade --no-cache --update \
  && apk add --no-cache udev ttf-freefont chromium git \
  && rm -rf /var/cache/apk/*

RUN mkdir /app
RUN mkdir /app/data
RUN chmod 777 /app
RUN chmod 777 /app/data

COPY ./ /app/

WORKDIR /app
RUN yarn install

EXPOSE 8080
ENTRYPOINT yarn run start
