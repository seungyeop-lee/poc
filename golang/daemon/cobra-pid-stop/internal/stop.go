package internal

import (
	"github.com/seungyeop-lee/easycmd"
	"io"
	"os"
)

func Stop() {
	pidFile, err := os.Open("./pid")
	if err != nil {
		panic(err)
	}

	pidStr, err := getFileContentsString(pidFile)
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

func getFileContents(file *os.File) ([]byte, error) {
	contentsBytes, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}
	return contentsBytes, nil
}

func getFileContentsString(file *os.File) (string, error) {
	contents, err := getFileContents(file)
	if err != nil {
		return "", err
	}
	return string(contents), err
}
