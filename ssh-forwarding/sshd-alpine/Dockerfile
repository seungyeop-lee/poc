FROM alpine:latest

RUN apk add --update --no-cache openssh
RUN echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config
RUN adduser -h /home/admin -s /bin/sh -D admin
RUN echo -n 'admin:admin' | chpasswd

EXPOSE 22

COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
