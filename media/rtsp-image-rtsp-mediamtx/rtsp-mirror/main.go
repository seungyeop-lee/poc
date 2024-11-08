package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"time"

	"gocv.io/x/gocv"
)

func main() {
	capture, err := gocv.OpenVideoCapture("rtsp://mediamtx:8554/cam")
	if err != nil {
		fmt.Printf("카메라 열기 오류: %v\n", err)
		return
	}
	defer capture.Close()

	width := int(capture.Get(gocv.VideoCaptureFrameWidth))
	height := int(capture.Get(gocv.VideoCaptureFrameHeight))

	rtsp, err := sendVideoToRTSP("rtsp://mediamtx:8554/cam-mirror", width, height)
	if err != nil {
		fmt.Printf("RTSP 서버로 이미지 전송 실패: %v\n", err)
		return
	}
	defer rtsp.Close()

	// 마지막으로 프레임을 처리한 시간을 저장할 변수
	lastProcessedTime := time.Now()

	for {
		img := gocv.NewMat()
		if ok := capture.Read(&img); !ok {
			fmt.Printf("이미지 읽기 오류\n")
			img.Close()
			return
		}
		if img.Empty() {
			img.Close()
			continue
		}

		// 현재 시간과 마지막 처리 시간의 차이를 계산
		currentTime := time.Now()
		if currentTime.Sub(lastProcessedTime) >= time.Second {
			// 프레임을 바이트 배열로 변환
			frameData := img.ToBytes()

			// 프레임을 파이프로 전송
			_, err := rtsp.Write(frameData)
			if err != nil {
				fmt.Printf("파이프에 프레임 쓰기 실패: %v\n", err)
				img.Close()
				return
			}
			// 마지막 처리 시간 업데이트
			lastProcessedTime = currentTime
		}

		img.Close()
	}
}

func sendVideoToRTSP(rtspURL string, width, height int) (*io.PipeWriter, error) {
	// FFmpeg 프로세스를 실행하기 위해 파이프 생성
	r, w := io.Pipe()

	// FFmpeg 명령어 설정
	cmd := exec.Command("ffmpeg",
		"-f", "rawvideo",
		"-pixel_format", "bgr24",
		"-video_size", fmt.Sprintf("%dx%d", width, height),
		"-framerate", "30", // 필요에 따라 프레임 속도 조절
		"-i", "pipe:0",
		"-c:v", "libx264",
		"-preset", "ultrafast",
		"-tune", "zerolatency",
		"-x264-params", "bframes=0",
		"-g", "1", // GOP 크기를 1로 설정하여 초기 지연 감소
		"-fflags", "nobuffer",
		"-flags", "low_delay",
		"-f", "rtsp",
		rtspURL)

	// FFmpeg 명령어의 표준 입력을 파이프로 설정
	cmd.Stdin = r
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	go func() {
		if err := cmd.Start(); err != nil {
			fmt.Printf("FFmpeg 실행 오류: %v\n", err)
		}
		if err := cmd.Wait(); err != nil {
			fmt.Printf("FFmpeg 실행 중 오류: %v\n", err)
		}
	}()

	return w, nil
}
