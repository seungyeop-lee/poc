from fastapi import APIRouter

# pyarmor로 난독화 후 pyinstaller로 패키징 할 때는 상태 경로가 허용되지 않음
from app.hello import router as hello_router

api_router = APIRouter()

api_router.include_router(hello_router, prefix="/hello")