.PHONY:init
init:
	dagger init

.PHONY:develop
develop:
	dagger develop --sdk go

.PHONY:build-all
build-all:
	dagger call -v build-all --dir helloworld export --path out/

.PHONY:build-container
build-container:
	dagger call -v build-container --dir helloworld as-tarball export --path out/test-image.tar
	docker load -i out/test-image.tar
