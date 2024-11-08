package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"

	_ "github.com/pion/mediadevices/pkg/driver/camera"
	"gocv.io/x/gocv"
)

func main() {
	capture, err := gocv.VideoCaptureDevice(0)
	if err != nil {
		fmt.Printf("카메라 열기 오류: %v\n", err)
		return
	}
	defer capture.Close()

	width := int(capture.Get(gocv.VideoCaptureFrameWidth))
	height := int(capture.Get(gocv.VideoCaptureFrameHeight))

	rtsp, err := sendVideoToRTSP("rtsp://localhost:8554/cam", width, height)
	if err != nil {
		fmt.Printf("RTSP 서버로 이미지 전송 실패: %v\n", err)
		return
	}
	defer rtsp.Close()

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

		// 프레임을 파이프로 전송
		_, err := rtsp.Write(img.ToBytes())
		if err != nil {
			fmt.Printf("파이프에 프레임 쓰기 실패: %v\n", err)
			img.Close()
			return
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
		"-g", "60", // 프레임의 2배가 일반적으로 사용됨
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
