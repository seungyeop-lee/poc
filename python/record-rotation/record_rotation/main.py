import sys

import cv2
import time
from datetime import datetime
import os

def cleanup_old_files(directory: str, keep_count: int = 10):
    # 디렉토리 내 모든 mp4 파일 가져오기
    files = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.mp4')]
    # 파일 생성 시간 기준으로 정렬
    files.sort(key=lambda x: os.path.getctime(x))
    
    # 오래된 파일들 삭제
    if len(files) > keep_count:
        files_to_remove = files[:-keep_count]  # 최근 keep_count개를 제외한 나머지
        for file_path in files_to_remove:
            os.remove(file_path)
            print(f"Removed old file: {file_path}")

def record_rtsp_stream(rtsp_url: str, output_dir: str, segment_duration: int = 10):
    # 출력 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)
    
    # RTSP 스트림 연결
    cap = cv2.VideoCapture(rtsp_url)
    
    if not cap.isOpened():
        print("Error: RTSP stream connection failed")
        return
    
    # 비디오 속성 가져오기
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    while True:
        # 현재 시간으로 출력 파일명 생성
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(output_dir, f"video_{timestamp}.mp4")
        
        # VideoWriter 객체 생성
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
        
        start_time = time.time()
        
        while time.time() - start_time < segment_duration:
            ret, frame = cap.read()
            if not ret:
                break
            
            out.write(frame)
        
        out.release()
        # 새 파일 저장 후 오래된 파일들 정리
        cleanup_old_files(output_dir)
        print(f"Saved video segment: {output_path}")
        
        if not ret:
            break
    
    cap.release()

if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) != 2:
        print("Usage: python main.py <RTSP_URL> <OUTPUT_DIR>", flush=True)
        sys.exit(1)

    rtsp_url = args[0]
    output_dir = args[1]

    record_rtsp_stream(rtsp_url, output_dir)
