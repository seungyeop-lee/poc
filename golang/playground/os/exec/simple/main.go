package main

import (
	"bytes"
	"fmt"
	"log"
	"os/exec"
)

func main() {
	cmd := exec.Command("tr", "a-z", "A-Z")
	in := "abcd ABCD"
	cmd.Stdin = bytes.NewBufferString(in)
	var out bytes.Buffer
	cmd.Stdout = &out

	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run cmd: %v", err)
	}

	fmt.Printf("exec input: %s\n", in)
	fmt.Printf("exec output: %s\n", out.String())
}
