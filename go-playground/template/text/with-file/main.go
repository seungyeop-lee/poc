package main

import (
	"io/ioutil"
	"log"
	"os"
	"text/template"
)

type data struct {
	PrintText string
}

func main() {
	tmpl, err := ioutil.ReadFile("from/main.gotmpl")
	if err != nil {
		log.Fatalf("failed to read template file: %v", err)
	}

	t, err := template.New("main go file").Parse(string(tmpl))
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}
	data := &data{
		PrintText: "test!!!",
	}

	file, err := os.Create("to/main.go")
	t.Execute(file, data)
}
