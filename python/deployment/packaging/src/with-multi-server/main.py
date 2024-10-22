import os
import signal
import subprocess
import sys


def get_jar_path():
    if getattr(sys, 'frozen', False):
        # PyInstaller로 패키징된 경우
        base_path = sys._MEIPASS
    else:
        # 개발 중인 경우 (패키징되지 않은 경우)
        base_path = os.path.abspath("./spring-server/build/libs")

    return os.path.join(base_path, "spring-server-0.0.1-SNAPSHOT.jar")


def get_binary_path():
    if getattr(sys, 'frozen', False):
        # PyInstaller로 패키징된 경우
        base_path = sys._MEIPASS
    else:
        # 개발 중인 경우 (패키징되지 않은 경우)
        base_path = os.path.abspath(".")

    return os.path.join(base_path, "go-server", "main")


def run_server():
    jar_path = get_jar_path()
    # JVM을 통해 JAR 파일 실행
    print(f"JAR 파일 경로: {jar_path}")
    java_process = subprocess.Popen(['java', '-jar', jar_path])
    print("Java 서버가 실행되었습니다.")
    binary_path = get_binary_path()
    print(f"Go 서버 바이너리 경로: {binary_path}")
    # Go 서버 실행
    go_process = subprocess.Popen([binary_path])
    print("Go 서버가 실행되었습니다.")

    try:
        java_process.wait()
        go_process.wait()
    except KeyboardInterrupt:
        # 프로세스에 SIGTERM을 보냄 (graceful shutdown을 위해)
        java_process.send_signal(signal.SIGTERM)
        java_process.wait()  # 종료될 때까지 대기
        print("Java 서버가 정상적으로 종료되었습니다.")
        go_process.send_signal(signal.SIGTERM)
        go_process.wait()
        print("Go 서버가 정상적으로 종료되었습니다.")


if __name__ == '__main__':
    run_server()
