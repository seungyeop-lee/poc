.PHONY:echo-start
echo-start:
	docker run -p 5678:5678 --name http_echo --rm -d hashicorp/http-echo:1.0.0

.PHONY:echo-stop
echo-stop:
	docker stop http_echo

.PHONY:install
install:
	docker run --rm -it -e GOOS=darwin -u "$(id -u):$(id -g)" -v "${PWD}/bin:/xk6" \
      grafana/xk6:0.12.1 build v0.52.0 \
      --with github.com/grafana/xk6-dashboard@v0.7.5

current_date:=$(shell date +"%Y-%m-%d_%H-%M-%S")

.PHONY:run
run:
	bin/k6 run --out 'dashboard=period=1s&export=out/report_$(current_date).html' src/script.js

# https://grafana.com/docs/k6/latest/results-output/web-dashboard/
# k6 프로젝트를 보니, k6가 build 될 때부터 xk6-dashboard를 포함하고 있었음
.PHONY:run-plain
run-plain:
	K6_WEB_DASHBOARD=true \
	K6_WEB_DASHBOARD_EXPORT=out/report_$(current_date).html \
	K6_WEB_DASHBOARD_PERIOD=1s \
	k6 run src/script.js
