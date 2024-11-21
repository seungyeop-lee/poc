.PHONY:protoc
protoc:
	(cd proto && \
		mkdir -p ./python_protobuf/grpcsimple && \
		poetry install && \
		poetry run python -m grpc_tools.protoc \
		-I../../proto \
		--grpc_python_out=./python_protobuf/grpcsimple \
		--pyi_out=./python_protobuf/grpcsimple \
		--python_out=./python_protobuf/grpcsimple \
		../../proto/grpc-simple.proto \
	)

.PHONY:server
server:
	(cd server && \
		poetry install && \
		poetry run python python_server/main.py \
	)

.PHONY:request-go-server
request-go-server:
	(cd client && \
		poetry install && \
		poetry run python python_client/to_go/main.py \
	)

.PHONY:request-java-server
request-java-server:
	(cd client && \
		poetry install && \
		poetry run python python_client/to_java/main.py \
	)

.PHONY:request-python-server
request-python-server:
	(cd client && \
		poetry install && \
		poetry run python python_client/to_python/main.py \
	)
