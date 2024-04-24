.PHONY:keycopy
keycopy:
	cp ../../server/key/id_rsa ./key/id_rsa
	cp ../../server/key/id_rsa.pub ./key/id_rsa.pub

.PHONY:dagger-init
init:
	dagger init

.PHONY:dagger-develop
develop:
	dagger develop --sdk go

.PHONY:build-spring
build-spring:
	dagger call -v build-spring --dir spring -o out/result.jar

.PHONY:build-spring-container
build-spring-container:
	dagger call -v build-jar-container --file out/result.jar -o out

.PHONY:load-spring-container
load-spring-container:
	docker load --input out/spring_linux_arm64.tar | sed 's/^.*:\(.*\)$/\1/' | xargs -I% docker tag % spring-server:latest
