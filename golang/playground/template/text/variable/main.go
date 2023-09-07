package main

import (
	"log"
	"os"
	"text/template"
)

type Student struct {
	Name string
	Age  uint
}

const Template = `{{ $name := .Name }}{{ $age := 10 }}
Student Info
Name: {{$name}}
Age: {{$age}}`

/*
Student Info
Name: Lee
Age: 10
*/
func main() {
	student := Student{
		Name: "Lee",
		Age:  34,
	}

	tmpl := template.New("Student Template")
	tmpl, err := tmpl.Parse(Template)
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	if err := tmpl.Execute(os.Stdout, student); err != nil {
		log.Fatalf("failed to execute template: %v", err)
	}
}
