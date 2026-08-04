FROM nginx:1.29.8

ARG FLAVOUR

RUN rm -f /usr/share/nginx/html/index.html

RUN mkdir -p /usr/share/nginx/html/src

COPY index.html /usr/share/nginx/html
COPY src/index.js /usr/share/nginx/html/src/index.js
COPY src/data.js /usr/share/nginx/html/src/data.js
COPY style.css /usr/share/nginx/html/style.css

RUN sed -i "s/PARAM_GAME_TITLE/'$FLAVOUR'/g" /usr/share/nginx/html/src/index.js