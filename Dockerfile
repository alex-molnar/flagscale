FROM nginx:1.29.8

RUN rm -f /usr/share/nginx/html/index.html

RUN mkdir -p /usr/share/nginx/html/src

COPY index.html /usr/share/nginx/html
COPY src/format.js /usr/share/nginx/html/src/format.js
COPY src/mathHelpers.js /usr/share/nginx/html/src/mathHelpers.js
COPY src/index.js /usr/share/nginx/html/src/index.js
COPY src/data.js /usr/share/nginx/html/src/data.js
COPY style.css /usr/share/nginx/html/style.css
COPY assets /usr/share/nginx/html/assets

