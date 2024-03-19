package main

import (
	"github.com/seungyeop-lee/easycmd"
	"io"
	"os"
)

func main() {
	pidFile, err := os.Open("./pid")
	if err != nil {
		panic(err)
	}

	pidStr, err := GetFileContentsString(pidFile)
	if err != nil {
		panic(err)
	}

	err = easycmd.New().Run(easycmd.Command("kill " + pidStr))
	if err != nil {
		panic(err)
	}

	err = os.Remove("./pid")
	if err != nil {
		panic(err)
	}
}

func GetFileContents(file *os.File) ([]byte, error) {
	contentsBytes, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}
	return contentsBytes, nil
}

func GetFileContentsString(file *os.File) (string, error) {
	contents, err := GetFileContents(file)
	if err != nil {
		return "", err
	}
	return string(contents), err
}
