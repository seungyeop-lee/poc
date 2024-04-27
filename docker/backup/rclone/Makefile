export CUID := $(shell id -u)
export CGID := $(shell id -g)

.PHONY:command
command:
	docker compose -f compose.yml \
	run -it --rm $(OPTIONS) rclone $(COMMAND)

.PHONY:config
config:
	docker compose -f compose.yml \
	-f compose.config.yml run -it --rm rclone

.PHONY:serve-webdav
serve-webdav:
	docker compose -f compose.yml \
	-f compose.serve.webdav.yml up

.PHONY:sync-webdav
sync-webdav:
	docker compose -f compose.yml \
	-f compose.sync.webdav.yml run -it --rm -v $(PWD)/data2:/data rclone
