package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// Response 구조체: 수집한 요청 정보를 담는다.
type Response struct {
	Timestamp   time.Time             `json:"timestamp"`
	Method      string                `json:"method"`
	Scheme      string                `json:"scheme"`
	Host        string                `json:"host"`
	Path        string                `json:"path"`
	RawPath     string                `json:"rawPath"`
	QueryString string                `json:"queryString"`
	QueryParams map[string][]string   `json:"queryParams"`
	Headers     map[string][]string   `json:"headers"`
	Cookies     map[string]string     `json:"cookies"`
	RemoteAddr  string                `json:"remoteAddr"`
	ContentType string                `json:"contentType"`
	ContentLen  int64                 `json:"contentLength"`
	FormValues  map[string][]string   `json:"formValues,omitempty"`
	Files       map[string][]FileMeta `json:"files,omitempty"`
	Body        any                   `json:"body,omitempty"`
	Error       string                `json:"error,omitempty"`
}

// FileMeta 업로드된 파일 메타 정보
type FileMeta struct {
	Filename string `json:"filename"`
	Size     int64  `json:"size"`
	Header   string `json:"header"`
}

func main() {
	e := echo.New()
	e.HideBanner = true

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(middleware.RequestID())

	// 모든 경로/메서드 매칭
	e.Any("/*", reflectHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // 기본 포트
	}
	if err := e.Start(":" + port); err != nil {
		e.Logger.Fatal("서버 시작 실패:", err)
	}
}

// reflectHandler: 요청으로부터 가능한 모든 정보를 수집하여 JSON으로 반환
func reflectHandler(c echo.Context) error {
	req := c.Request()
	res := Response{
		Timestamp:   time.Now().UTC(),
		Method:      req.Method,
		Scheme:      schemeFromRequest(req),
		Host:        req.Host,
		Path:        req.URL.Path,
		RawPath:     req.URL.RawPath,
		QueryString: req.URL.RawQuery,
		QueryParams: req.URL.Query(),
		Headers:     req.Header,
		Cookies:     map[string]string{},
		RemoteAddr:  req.RemoteAddr,
		ContentType: req.Header.Get(echo.HeaderContentType),
		ContentLen:  req.ContentLength,
		FormValues:  map[string][]string{},
		Files:       map[string][]FileMeta{},
	}

	// 쿠키 수집
	for _, ck := range req.Cookies() {
		res.Cookies[ck.Name] = ck.Value
	}

	// Content-Type 에 따라 바디 처리
	ct := res.ContentType
	if ct == "" && req.ContentLength == 0 {
		// no body
	} else {
		// multipart/form-data
		if err := req.ParseMultipartForm(32 << 20); err == nil && req.MultipartForm != nil { // 32MB
			if req.MultipartForm.Value != nil {
				res.FormValues = req.MultipartForm.Value
			}
			if req.MultipartForm.File != nil {
				for field, fhArr := range req.MultipartForm.File {
					for _, fh := range fhArr {
						meta := FileMeta{Filename: fh.Filename, Size: fh.Size, Header: fh.Header.Get("Content-Type")}
						res.Files[field] = append(res.Files[field], meta)
					}
				}
			}
		} else if err := req.ParseForm(); err == nil { // x-www-form-urlencoded or query
			if len(req.PostForm) > 0 {
				res.FormValues = req.PostForm
			}
		}

		// 원시 바디 읽기 (이미 multipart parse 후에도 가능하지만 사이즈 제한 주의)
		bodyBytes, err := io.ReadAll(req.Body)
		if err != nil {
			res.Error = "read body: " + err.Error()
		} else if len(bodyBytes) > 0 {
			// JSON 시도
			var js any
			if json.Unmarshal(bodyBytes, &js) == nil {
				res.Body = js
			} else {
				// 텍스트로 간주 (크기 제한 1MB 표기)
				if int64(len(bodyBytes)) <= 1<<20 {
					res.Body = string(bodyBytes)
				} else {
					res.Body = "(body too large to include)"
				}
			}
		}
	}

	return c.JSONPretty(http.StatusOK, res, "  ")
}

// schemeFromRequest 추론 (X-Forwarded-Proto 우선)
func schemeFromRequest(r *http.Request) string {
	if xf := r.Header.Get("X-Forwarded-Proto"); xf != "" {
		return xf
	}
	if r.TLS != nil {
		return "https"
	}
	return "http"
}
