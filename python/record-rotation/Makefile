.PHONY:install
install:
	poetry install

RTSP_URL=
OUTPUT_DIR=recordings

.PHONY:run
run:
	poetry run python3 record_rotation/main.py "${RTSP_URL}" "${OUTPUT_DIR}"
