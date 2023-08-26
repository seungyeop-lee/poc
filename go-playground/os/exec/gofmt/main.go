package main

import (
	"log"
	"os"
	"os/exec"
)

func main() {
	file, err := os.Create("to/main.go")
	if err != nil {
		log.Fatalf("failed to create file: %v", err)
	}

	cmd := exec.Command("gofmt", "from/main.go")
	cmd.Stdout = file
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run cmd: %v", err)
	}
}
