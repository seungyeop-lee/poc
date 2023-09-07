UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
DIRECTORY_WATCHER = ./directory-watcher-linux-amd64
endif
ifeq ($(UNAME_S),Darwin)
DIRECTORY_WATCHER = ./directory-watcher-macos-amd64
endif

.PHONY:watch
watch:
	${DIRECTORY_WATCHER} -c config-watch.yml

.PHONY:run
run:
	${DIRECTORY_WATCHER} -c config-once.yml

.PHONY:up
up:
	(cd version1 && ./cmd.sh build)
	./cmd.sh up

.PHONY:down
down:
	./cmd.sh down
