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

.PHONY: to-pdf-html
to-pdf-html:
	curl \
	--request POST http://localhost:3000/forms/chromium/convert/html \
	--form files=@in/template/index.html \
	--form files=@in/template/styles.css \
	--form files=@in/template/scripts.js \
	--form files=@in/template/favicon.ico \
	--form files=@in/template/app-store-badge.svg \
	--form files=@in/template/demo-screen.mp4 \
	--form files=@in/template/google-play-badge.svg \
	--form files=@in/template/portrait_black.png \
	--form files=@in/template/tnw-logo.svg \
	--form paperWidth=11.7 \
	--form paperHeight=16.54 \
	--form singlePage=true \
	-o out/html.pdf

.PHONY: to-pdf-html-screenshot
to-pdf-html-screenshot:
	curl \
	--request POST http://localhost:3000/forms/chromium/screenshot/html \
	--form files=@in/template/index.html \
	--form files=@in/template/styles.css \
	--form files=@in/template/scripts.js \
	--form files=@in/template/favicon.ico \
	--form files=@in/template/app-store-badge.svg \
	--form files=@in/template/demo-screen.mp4 \
	--form files=@in/template/google-play-badge.svg \
	--form files=@in/template/portrait_black.png \
	--form files=@in/template/tnw-logo.svg \
	--form paperWidth=11.7 \
	--form paperHeight=16.54 \
	-o out/html-screenshot.png
