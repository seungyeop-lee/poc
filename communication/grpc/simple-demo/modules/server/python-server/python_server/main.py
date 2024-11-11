import asyncio
import signal
import uvicorn
from fastapi import FastAPI
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

app = FastAPI()

@app.get("/hello")
async def hello() -> str:
    return "Hello, Python Server!"

async def run_web_server(stop_signal: asyncio.Event):
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    
    web_task = asyncio.create_task(server.serve())
    await stop_signal.wait()
    
    server.should_exit = True
    await web_task

async def run_grpc_server(stop_signal: asyncio.Event):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    grpc_simple_pb2_grpc.add_SimpleServiceServicer_to_server(
        SimpleServiceServicer(), server
    )
    server.add_insecure_port('[::]:50053')
    server.start()
    print("gRPC Server started on port 50053")
    
    await stop_signal.wait()
    server.stop(0)

async def main():
    web_stop_signal = asyncio.Event()
    grpc_stop_signal = asyncio.Event()
    
    # 시그널 핸들러
    def signal_handler():
        print("\nShutting down servers...")
        web_stop_signal.set()
        grpc_stop_signal.set()
    
    # 시그널 등록
    loop = asyncio.get_event_loop()
    for sig in (signal.SIGTERM, signal.SIGINT):
        loop.add_signal_handler(sig, signal_handler)
    
    # 서버 실행
    await asyncio.gather(
        run_web_server(web_stop_signal),
        run_grpc_server(grpc_stop_signal)
    )

if __name__ == '__main__':
    asyncio.run(main())
