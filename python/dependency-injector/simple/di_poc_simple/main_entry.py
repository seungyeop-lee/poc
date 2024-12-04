from dependency_injector.wiring import inject, Provide

from di_poc_simple.container import Container
from di_poc_simple.service import Service


@inject
def main(service: Service = Provide[Container.service]) -> None:
    print(service.get_data())