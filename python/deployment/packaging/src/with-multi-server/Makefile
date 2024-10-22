.PHONY:build-spring
build-spring:
	(cd spring-server && ./gradlew bootJar)

.PHONY:build-go
build-go:
	(cd go-server && go build -o main)

.PHONY:run-plain
run-plain:
	python3 main.py

.PHONY:build
build:
	# --add-binary 로 넣을 때는 dist가 꼭 특정 폴더에 있어야 함
	pyinstaller \
		--onefile \
		--add-data "spring-server/build/libs/spring-server-0.0.1-SNAPSHOT.jar:." \
		--add-binary "go-server/main:go-server" \
		main.py

.PHONY:run-packaged
run-packaged:
	dist/main