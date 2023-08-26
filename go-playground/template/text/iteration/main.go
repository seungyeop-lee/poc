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

var students = []Student{
	{
		Name: "Lee",
		Age:  34,
	},
	{
		Name: "Kim",
		Age:  19,
	},
	{
		Name: "Park",
		Age:  24,
	},
}

func main() {
	usingContext()
	arrayElementValue()
	arrayElementIndexAndValue()
	mapElementKeyAndValue()
	emptyArrayOrMap()
}

/*
Students Info

Name: Lee
Age: 34

Name: Kim
Age: 19

Name: Park
Age: 24
*/
func usingContext() {
	const UsingContextTmplStr = `
Students Info
{{ range . }}
Name: {{.Name}}
Age: {{.Age}}
{{ end }}`

	executeTemplate("Students Template", UsingContextTmplStr, students)
}

/*
Students Info

Name: Lee
Age: 34

Name: Kim
Age: 19

Name: Park
Age: 24
*/
func arrayElementValue() {
	const ArrayElementValueTmplStr = `{{ $students := . }}
Students Info
{{ range $student := $students }}
Name: {{$student.Name}}
Age: {{$student.Age}}
{{ end }}`

	executeTemplate("Students Template", ArrayElementValueTmplStr, students)
}

/*
Students Info

Name: Lee
Age: 34

Name: Kim
Age: 19

Name: Park
Age: 24
*/
func arrayElementIndexAndValue() {
	const ArrayElementIndexAndValueTmplStr = `{{ $students := . }}
Students Info
{{ range $index, $student := $students }}
Name: {{$student.Name}}
Age: {{$student.Age}}
{{ end }}`

	executeTemplate("Students Template", ArrayElementIndexAndValueTmplStr, students)
}

/*
Students Info


		Name: Lee

		Age: 34


		Name: Kim

		Age: 19


		Name: Park

		Age: 24
*/
func mapElementKeyAndValue() {
	const MapElementKeyAndValueTmplStr = `{{ $students := . }}
Students Info
{{ range $student := $students }}
	{{ range $key, $value := $student }}
		{{$key}}: {{$value}}
	{{ end }}
{{ end }}`

	students := []map[string]interface{}{
		{
			"Name": "Lee",
			"Age":  34,
		},
		{
			"Name": "Kim",
			"Age":  19,
		},
		{
			"Name": "Park",
			"Age":  24,
		},
	}
	executeTemplate("Students Template", MapElementKeyAndValueTmplStr, students)
}

/*
Students Info

	No Students!
*/
func emptyArrayOrMap() {
	const EmptyArrayOrMapTmplStr = `{{ $students := . }}
Students Info
{{ range $index, $student := $students }}
	Name: {{$student.Name}}
	Age: {{$student.Age}}
{{ else }}
	No Students!
{{ end }}`

	executeTemplate("Students Template", EmptyArrayOrMapTmplStr, nil)
}

func executeTemplate(name string, tmplStr string, data interface{}) {
	tmpl := template.New(name)
	tmpl, err := tmpl.Parse(tmplStr)
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	if err := tmpl.Execute(os.Stdout, data); err != nil {
		log.Fatalf("failed to execute template: %v", err)
	}
}
