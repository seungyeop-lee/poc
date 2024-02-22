export CUID := $(shell id -u)
export CGID := $(shell id -g)

.PHONY:config
config:
	docker compose -f compose.yml \
	-f compose.config.yml run -it --rm rclone
