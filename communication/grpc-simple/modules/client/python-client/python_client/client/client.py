import grpc
from python_protobuf.grpcsimple import grpc_simple_pb2
from python_protobuf.grpcsimple import grpc_simple_pb2_grpc

RESPONSE_OUTPUT_FORMAT: str = '''Response:
Message: {message}
Data: {data}
'''


def request(server_url: str):
    # gRPC 서버에 연결
    with grpc.insecure_channel(server_url) as channel:
        # 클라이언트 생성
        client = grpc_simple_pb2_grpc.SimpleServiceStub(channel)

        # 요청 데이터 준비
        req = grpc_simple_pb2.DataRequest(
            name="from python",
            data="this is data from python".encode('utf-8')
        )

        # 데이터 전송
        res = client.sendData(req)

        # 응답 출력
        print(RESPONSE_OUTPUT_FORMAT.format(
            message=res.resultMessage,
            data=res.resultData.decode('utf-8')
        ))
