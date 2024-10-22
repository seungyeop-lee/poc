.PHONY:build-gobinary
build-gobinary:
	(cd binary && go build -o binary)

.PHONY:run-plain
run-plain:
	python3 main.py

.PHONY:build
build:
	# -add-binary "source_file:destination_directory" 형태 임
	pyinstaller --onefile --add-binary "binary/binary:binary" main.py

.PHONY:run-packaged
run-packaged:
	dist/main