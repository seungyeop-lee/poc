.PHONY:build
build:
	go build main.go

.PHONY:start
start:
	# https://stackoverflow.com/questions/637827/redirect-stderr-and-stdout-in-bash
	./main start 1>>file.log 2>&1 &

.PHONY:stop
stop:
	./main stop
