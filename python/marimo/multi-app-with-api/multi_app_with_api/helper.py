from pathlib import Path

import marimo
from fastapi import FastAPI
from pydantic import BaseModel


class PathRoot(BaseModel):
    app_name: str
    path: str
    root: str

class PathRootBuilder:
    path: str
    marimo_suffix: str
    base_href: str

    def __init__(self, path: str):
        self.path = path
        self.marimo_suffix = ".py"
        self.base_href = ""

    def build(self):
        notebooks_dir = Path(self.path)

        result: list[PathRoot] = []
        for filename in sorted(notebooks_dir.rglob(f"*{self.marimo_suffix}")):
            relative_path = filename.relative_to(notebooks_dir)
            app_name = str(relative_path).replace("\\", "/").replace(self.marimo_suffix, "")
            result.append(PathRoot(app_name=app_name, path=f"{self.base_href}/{app_name}", root=str(filename)))

        print(result)
        return result

def apply_marimo(app: FastAPI, path_roots: list[PathRoot]):
    server = marimo.create_asgi_app()

    for path_root in path_roots:
        server = server.with_app(path=path_root.path, root=path_root.root)

    app.mount("/", server.build())