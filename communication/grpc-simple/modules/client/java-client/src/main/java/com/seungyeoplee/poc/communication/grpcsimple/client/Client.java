package com.seungyeoplee.poc.communication.grpcsimple.client;

import com.google.protobuf.ByteString;
import com.seungyeoplee.poc.communication.grpcsimple.proto.GrpcSimpleProto;
import com.seungyeoplee.poc.communication.grpcsimple.proto.SimpleServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

import java.util.concurrent.TimeUnit;

public class Client {
    static void request(String serverUrl) throws InterruptedException {
        // Create channel
        ManagedChannel channel = ManagedChannelBuilder.forTarget(serverUrl)
                .usePlaintext()
                .build();

        try {
            // Create stub
            SimpleServiceGrpc.SimpleServiceBlockingStub stub = SimpleServiceGrpc.newBlockingStub(channel);

            // Prepare request
            GrpcSimpleProto.DataRequest request = GrpcSimpleProto.DataRequest.newBuilder()
                    .setName("from java")
                    .setData(ByteString.copyFromUtf8("this is data from java"))
                    .build();

            // Send request
            GrpcSimpleProto.DataResponse response = stub.sendData(request);

            // Print response
            System.out.printf("Response:\nMessage: %s\nData: %s\n",
                    response.getResultMessage(),
                    response.getResultData().toStringUtf8());

        } finally {
            // Shutdown channel
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }
    }
}
