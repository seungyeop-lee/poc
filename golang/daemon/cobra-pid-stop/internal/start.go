package internal

import (
	"errors"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

func Start() {
	pid := os.Getpid()

	pidFile, err := createFile("./pid")
	if err != nil {
		panic(err)
	}

	_, err = pidFile.WriteString(strconv.Itoa(pid))
	if err != nil {
		panic(err)
	}

	e := echo.New()

	e.GET("/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

func createFile(path string) (*os.File, error) {
	abs, err := filepath.Abs(path)
	if err != nil {
		return nil, err
	}

	dirPath := filepath.Dir(abs)
	if exist := isNotExist(dirPath); exist {
		err := os.MkdirAll(dirPath, os.ModePerm)
		if err != nil {
			return nil, err
		}
	}

	f, err := os.Create(abs)
	if err != nil {
		return nil, err
	}

	return f, nil
}

func isNotExist(path string) bool {
	return !isExist(path)
}

func isExist(path string) bool {
	_, err := os.Open(path)
	return err == nil
}
