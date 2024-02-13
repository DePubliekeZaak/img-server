FROM nginx:alpine
RUN apk add python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev rust cargo
RUN pip3 install pip --upgrade
RUN pip3 install certbot-nginx
RUN mkdir /etc/letsencrypt


WORKDIR /
COPY ../nginx/conf.d/__upstreams.conf /etc/nginx/conf.d/__upstreams.conf
COPY ../nginx/conf.d/_server.conf.template /etc/nginx/conf.d/_server.conf.template
COPY ../nginx/nginx.conf /etc/nginx/nginx.conf

