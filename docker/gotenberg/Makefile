.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

######################################################################

.PHONY: to-pdf-naver
to-pdf-naver:
	curl \
    --request POST http://localhost:3000/forms/chromium/convert/url \
    --form url=https://naver.com \
    --form paperWidth=11.7 \
    --form paperHeight=16.54 \
    --form waitDelay=3s \
    -o out/naver.pdf

.PHONY: to-pdf-naver-screenshot
to-pdf-naver-screenshot:
	curl \
    --request POST http://localhost:3000/forms/chromium/screenshot/url \
    --form url=https://naver.com \
    --form paperWidth=11.7 \
    --form paperHeight=16.54 \
    --form waitDelay=3s \
    -o out/naver-screenshot.png
