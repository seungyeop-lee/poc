export CUID := $(shell id -u)
export CGID := $(shell id -g)

.PHONY:command
command:
	docker compose -f compose.yml \
	run -it --rm rclone $(COMMAND)

.PHONY:config
config:
	docker compose -f compose.yml \
	-f compose.config.yml run -it --rm rclone

.PHONY:serve-webdav
serve-webdav:
	docker compose -f compose.yml \
	-f compose.serve.webdav.yml up
