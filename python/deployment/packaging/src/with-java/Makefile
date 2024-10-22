.PHONY:build-spring
build-spring:
	(cd spring-server && ./gradlew bootJar)

.PHONY:run-plain
run-plain:
	python3 main.py

.PHONY:build
build:
	# -add-data "source_file:destination_directory" 형태 임
	pyinstaller --onefile --add-data "spring-server/build/libs/spring-server-0.0.1-SNAPSHOT.jar:." main.py

.PHONY:run-packaged
run-packaged:
	dist/main