import argparse

import uvicorn

from multi_app_with_api import build_app
from multi_app_with_api.helper import PathRootBuilder, apply_marimo


def main():
    # Get args from command line
    parser = argparse.ArgumentParser()
    parser.add_argument("--folder", type=str)
    args = parser.parse_args()

    path_roots = PathRootBuilder(path=args.folder).build()

    app = build_app(path_roots)

    apply_marimo(app, path_roots)

    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
