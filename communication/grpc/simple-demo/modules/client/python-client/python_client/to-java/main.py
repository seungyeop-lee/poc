from python_client.client import client

SERVER_URL = 'localhost:50051'

if __name__ == '__main__':
    print("client to java server")
    client.request(SERVER_URL)
