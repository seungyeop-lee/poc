FROM mariadb:10.11.7

# restic 설치
RUN apt-get update && \
    apt-get install -y restic

# windows에서 volume mount 할 경우, 파일 권한이 777로 변경되는 문제가 있어서 아래와 같은 작업을 추가 함
COPY conf.d/my.cnf /etc/mysql/conf.d/my.cnf
RUN chmod 644 /etc/mysql/conf.d/my.cnf
