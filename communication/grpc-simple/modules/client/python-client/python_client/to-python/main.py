from python_client.client import client

SERVER_URL = 'localhost:50053'

if __name__ == '__main__':
    print("client to python server")
    client.request(SERVER_URL)
