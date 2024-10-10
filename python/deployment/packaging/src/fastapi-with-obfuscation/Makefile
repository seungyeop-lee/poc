.PHONY:run-plain
run-plain:
	python3 main.py

.PHONY:obfuscation
obfuscation:
	pyarmor gen -r -i app

.PHONY:run-obfuscation
run-obfuscation:
	python3 main.py

.PHONY:build-plain
build-plain:
	pyinstaller --onefile main.py

.PHONY:build-obfuscation
build-obfuscation:
	pyinstaller --onefile main-dist.py

.PHONY:run-packaged
run-packaged:
	dist/main