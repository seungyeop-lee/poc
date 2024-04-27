FROM ubuntu:22.04

# sshd 설치
RUN apt-get update \
    && apt-get install -y openssh-server sudo \
    && mkdir /var/run/sshd \
    && echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config \
    && ssh-keygen -A # ssh 접속용 호스트키 생성, /etc/ssh/에 저장 됨.

# ssh 접속 유저 추가
RUN useradd -m -d /home/admin -s /bin/bash admin \
    && echo "admin ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/admin \
    && echo 'admin:admin' | chpasswd

EXPOSE 22

COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
