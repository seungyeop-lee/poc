FROM alpine:3.20.2

# sshd 설치
RUN apk add --update --no-cache openssh \
    && echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config \
    && ssh-keygen -A # ssh 접속용 호스트키 생성, /etc/ssh/에 저장 됨.

# ssh 접속 유저 추가
RUN apk add --no-cache sudo \
    && adduser -h /home/admin -s /bin/sh -D admin \
    && echo "admin ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/admin \
    && echo -n 'admin:admin' | chpasswd

EXPOSE 22

COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
