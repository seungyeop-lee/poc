package com.seungyeoplee.poc.communication.grpcsimple.client;

public class ToJava {
    private static final String SERVER_URL = "localhost:50051";

    public static void main(String[] args) throws InterruptedException {
        System.out.println("client to java server");
        Client.request(SERVER_URL);
    }
}
