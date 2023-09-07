package main

import (
	"log"
	"os"
	"text/template"
)

// true
func main() {
	const tmplStr = `
{{ isOne 1 }}
`

	funcMap := template.FuncMap{
		"isOne": func(num int) bool {
			return num == 1
		},
	}

	executeTemplate("function example", tmplStr, nil, funcMap)
}

func executeTemplate(name string, tmplStr string, data interface{}, funcMap template.FuncMap) {
	tmpl := template.New(name)
	tmpl = tmpl.Funcs(funcMap)
	tmpl, err := tmpl.Parse(tmplStr)
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	if err := tmpl.Execute(os.Stdout, data); err != nil {
		log.Fatalf("failed to execute template: %v", err)
	}
}
