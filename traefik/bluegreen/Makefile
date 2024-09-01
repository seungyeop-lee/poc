current_date:=$(shell date +"%Y-%m-%d_%H-%M-%S")
.PHONY:load
load:
	(cd pochelper/loadtest && \
	docker run --rm -i -v "./out:/out" \
		--network proxy \
		-e K6_WEB_DASHBOARD=true \
    	-e K6_WEB_DASHBOARD_EXPORT=/out/report_$(current_date).html \
    	-e K6_WEB_DASHBOARD_PERIOD=1s \
    	grafana/k6:0.53.0 run - <k6.js)
