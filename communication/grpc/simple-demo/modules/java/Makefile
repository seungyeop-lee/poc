.PHONY:protoc
protoc:
	./gradlew :proto:build

.PHONY:server
server:
	./gradlew :server:bootRun

.PHONY:request-go-server
request-go-server:
	./gradlew :client:runToGo

.PHONY:request-java-server
request-java-server:
	./gradlew :client:runToJava

.PHONY:request-python-server
request-python-server:
	./gradlew :client:runToPython
