FROM ubuntu:22.04

RUN apt update && \
    apt install -y openssh-client sudo sshpass

CMD ["sleep", "infinity"]
