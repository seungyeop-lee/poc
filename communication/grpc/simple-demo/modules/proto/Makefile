.PHONY:protoc-go
protoc-go:
	mkdir -p ./go/grpcsimple
	protoc --go_out=./go/grpcsimple --go_opt=paths=source_relative \
	--go-grpc_out=./go/grpcsimple --go-grpc_opt=paths=source_relative \
	--proto_path=./protos \
	./protos/grpc-simple.proto

.PHONY:protoc-java
protoc-java:
	(cd ../.. && ./gradlew :modules:proto:java:build)

.PHONY:protoc-python
protoc-python:
	(cd python && \
		poetry install && \
		poetry run python -m grpc_tools.protoc \
		-I../protos \
		--grpc_python_out=./python_protobuf/grpcsimple \
		--pyi_out=./python_protobuf/grpcsimple \
		--python_out=./python_protobuf/grpcsimple \
		../protos/grpc-simple.proto \
	)

.PHONY:protoc
protoc: protoc-go protoc-java protoc-python
