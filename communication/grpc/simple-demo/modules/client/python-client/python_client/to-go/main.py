from python_client.client import client

SERVER_URL = 'localhost:50052'

if __name__ == '__main__':
    print("client to go server")
    client.request(SERVER_URL)
