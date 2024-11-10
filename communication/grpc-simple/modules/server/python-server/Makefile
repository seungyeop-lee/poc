.PHONY:protoc
protoc:
	mkdir -p grpcsimple
	python -m grpc_tools.protoc \
	-I../proto \
	--grpc_python_out=./grpcsimple \
	--pyi_out=./grpcsimple \
	--python_out=./grpcsimple \
	../proto/grpc-simple.proto
