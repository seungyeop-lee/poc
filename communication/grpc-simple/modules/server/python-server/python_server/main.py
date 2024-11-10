import grpc
from concurrent import futures
from python_protobuf.grpcsimple import grpc_simple_pb2
from python_protobuf.grpcsimple import grpc_simple_pb2_grpc

class SimpleServiceServicer(grpc_simple_pb2_grpc.SimpleServiceServicer):
    def sendData(self, request: grpc_simple_pb2.DataRequest, context):
        name = request.name
        data = request.data.decode('utf-8')

        print(f"request data: name => {name}, data => {data}")

        response = grpc_simple_pb2.DataResponse(
            resultMessage=f"from python-server: {name}",
            resultData=f"from python-server: {data}".encode('utf-8')
        )
        return response

def serve():
    # 서버 생성
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    # 서비스 구현체를 서버에 등록
    grpc_simple_pb2_grpc.add_SimpleServiceServicer_to_server(
        SimpleServiceServicer(), server
    )

    # 서버 포트 바인딩
    server.add_insecure_port('[::]:50053')

    # 서버 시작
    server.start()
    print("Server started on port 50053")

    # 서버 실행 유지
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
