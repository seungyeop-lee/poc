
package com.seungyeoplee.poc.communication.grpcsimple.javaserver;

import com.google.protobuf.ByteString;
import com.seungyeoplee.poc.communication.grpcsimple.proto.GrpcSimpleProto;
import com.seungyeoplee.poc.communication.grpcsimple.proto.SimpleServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class SimpleServiceImpl extends SimpleServiceGrpc.SimpleServiceImplBase {
    @Override
    public void sendData(GrpcSimpleProto.DataRequest request, StreamObserver<GrpcSimpleProto.DataResponse> responseObserver) {
        String name = request.getName();
        String data = new String(request.getData().toByteArray());

        System.out.printf("request data: name => %s, data => %s%n", name, data);

        GrpcSimpleProto.DataResponse response = GrpcSimpleProto.DataResponse.newBuilder()
                .setResultMessage(String.format("from java-server: %s", name))
                .setResultData(ByteString.copyFrom(String.format("from java-server: %s", data).getBytes()))
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
