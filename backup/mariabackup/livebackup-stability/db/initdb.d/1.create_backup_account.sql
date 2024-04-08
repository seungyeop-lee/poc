# mariabackup용 계정 생성
# https://mariadb.com/kb/en/mariabackup-overview/#authentication-and-privileges
CREATE USER 'mariabackup'@'localhost' IDENTIFIED BY 'mypassword';
GRANT RELOAD, PROCESS, LOCK TABLES, BINLOG MONITOR ON *.* TO 'mariabackup'@'localhost';
GRANT CREATE, INSERT ON mysql.* TO 'mariabackup'@'localhost';
