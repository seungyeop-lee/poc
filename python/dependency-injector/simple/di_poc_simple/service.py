from di_poc_simple.api_client import ApiClient


class Service:
    def __init__(self, api_client: ApiClient):
        self.__api_client = api_client

    def get_data(self) -> str:
        return self.__api_client.get_data()