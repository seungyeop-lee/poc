.PHONY:network-create
network-create:
	docker network create otel-poc

.PHONY:backend-up
backend-up:
	(cd backends && make up)

.PHONY:backend-down
backend-down:
	(cd backends && make down)

.PHONY:backend-clean
backend-clean:
	(cd backends && make clean)

.PHONY:backend-log
backend-log:
	(cd backends && make log)

.PHONY:test
test:
	http -v api.localhost/term/auto term=apple

.PHONY:otel-lgtm-up
otel-lgtm-up:
	(cd otel-lgtm && make up)

.PHONY:otel-lgtm-down
otel-lgtm-down:
	(cd otel-lgtm && make down)

.PHONY:otel-lgtm-clean
otel-lgtm-clean:
	(cd otel-lgtm && make clean)

.PHONY:otel-lgtm-log
otel-lgtm-log:
	(cd otel-lgtm && make log)
