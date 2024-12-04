.PHONY:run-plain
run-plain:
	poetry run python3 main.py

.PHONY:obfuscation
obfuscation:
	poetry run pyarmor gen -r -i app

.PHONY:run-obfuscation
run-obfuscation:
	poetry run python3 main-dist.py

.PHONY:build-plain
build-plain:
	poetry run pyinstaller --onefile main.py

.PHONY:build-obfuscation
build-obfuscation:
	poetry run pyinstaller --exclude-module app --onefile main-dist.py

.PHONY:run-packaged-plain
run-packaged-plain:
	dist/main

.PHONY:run-packaged-obfuscation
run-packaged-obfuscation:
	dist/main-dist