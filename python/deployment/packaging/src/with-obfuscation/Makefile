.PHONY:obfuscation
obfuscation:
	pyarmor gen -r -i hello

.PHONY:run-obfuscation
run-obfuscation:
	python3 main.py

.PHONY:build
build:
	pyinstaller --onefile main.py

.PHONY:run-packaged
run-packaged:
	dist/main