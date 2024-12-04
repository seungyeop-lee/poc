# https://stackoverflow.com/questions/77635741/pyarmor-modulenotfounderror-no-module-named-pyarmor-runtime-000000
################ for dist ##################
import sys

runtime_dir = './dist/'
sys.path.append(runtime_dir)

############################################

import uvicorn
from fastapi import FastAPI

from dist.app import api_router

app = FastAPI()
app.include_router(api_router)


def serve():
    uvicorn.run(app)


if __name__ == "__main__":
    print('this is main-dist.py')
    serve()
