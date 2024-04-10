.PHONY:init
init:
	dagger init

.PHONY:develop
develop:
	dagger develop --sdk go

.PHONY:build
build:
	dagger call -v build --dir helloworld --sync export --path out/
