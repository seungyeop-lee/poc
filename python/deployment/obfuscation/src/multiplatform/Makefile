.PHONY:run-plain
run-plain:
	python3 main.py

.PHONY:pyarmor
pyarmor:
	pyarmor gen \
		--platform windows.x86_64 \
		--platform linux.x86_64 \
		--platform darwin.x86_64 \
		--platform darwin.arm64 \
		main.py

.PHONY:run-obfuscation
run-obfuscation:
	python3 dist/main.py