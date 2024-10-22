import os
import subprocess
import sys


def get_binary_path():
    if getattr(sys, 'frozen', False):
        # PyInstaller로 패키징된 경우
        base_path = sys._MEIPASS
    else:
        # 개발 중인 경우 (패키징되지 않은 경우)
        base_path = os.path.abspath(".")

    return os.path.join(base_path, "binary", "binary")


def run_binary():
    binary_path = get_binary_path()
    subprocess.run([binary_path])


if __name__ == "__main__":
    run_binary()
