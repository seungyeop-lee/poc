from dependency_injector import containers, providers

from di_poc_simple.api_client import ApiClient
from di_poc_simple.service import Service


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(packages=["."])
    api_client = providers.Singleton(ApiClient)
    service = providers.Factory(Service, api_client=api_client)
