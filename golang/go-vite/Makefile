.PHONY:vite-init
vite-init:
	npm create vite@latest frontend -- --template react-ts

.PHONY:vite-build
vite-build:
	(cd frontend && npm run build)

.PHONY:go-init
go-init:
	go mod init github.com/seungyeop-lee/poc/golang/go-vite

.PHONY:run
run: vite-build
	go run main.go

.PHONY:build
build: vite-build
	go build main.go

.PHONY:open
open:
	open http://localhost:8080
