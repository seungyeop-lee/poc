package com.seungyeoplee.poc.communication.grpcsimple.client;

public class ToGo {
    private static final String SERVER_URL = "localhost:50052";

    public static void main(String[] args) throws InterruptedException {
        System.out.println("client to python server");
        Client.request(SERVER_URL);
    }
}