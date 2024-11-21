.PHONY:protoc
protoc:
	mkdir -p ./proto/grpcsimple
	protoc \
	--go_out=./proto/grpcsimple --go_opt=paths=source_relative \
	--go-grpc_out=./proto/grpcsimple --go-grpc_opt=paths=source_relative \
	--proto_path=../proto \
	../proto/grpc-simple.proto

.PHONY:server
server:
	go run server/main.go

.PHONY:request-go-server
request-go-server:
	go run client/cmd/to_go/main.go

.PHONY:request-java-server
request-java-server:
	go run client/cmd/to_java/main.go

.PHONY:request-python-server
request-python-server:
	go run client/cmd/to_python/main.go
