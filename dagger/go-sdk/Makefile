.PHONY:init
init:
	dagger init

.PHONY:develop
develop:
	dagger develop --sdk go

.PHONY:web
web:
	dagger call web --source . as-service up --ports 80:80

.PHONY:hello-world
hello-world:
	dagger call hello-world

.PHONY:echo
echo:
	dagger call container-echo --string-arg="Echo LSY!" stdout

.PHONY:other-library
other-library:
	dagger call other-library --cmd="whoami"
