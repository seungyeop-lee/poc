.PHONY:start
start:
	# https://stackoverflow.com/questions/637827/redirect-stderr-and-stdout-in-bash
	go run start.go 1>>file.log 2>&1 &

.PHONY:stop
stop:
	go run stop.go
