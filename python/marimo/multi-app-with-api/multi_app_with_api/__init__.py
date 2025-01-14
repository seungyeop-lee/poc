from fastapi import FastAPI

from multi_app_with_api import helper


def build_app(path_roots: list[helper.PathRoot]):
    app = FastAPI()

    @app.get("/")
    async def path_roots_api():
        print(path_roots)
        return path_roots

    return app