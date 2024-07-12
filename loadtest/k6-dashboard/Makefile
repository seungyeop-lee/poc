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
