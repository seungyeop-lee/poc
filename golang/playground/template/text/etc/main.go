package main

import (
	"log"
	"os"
	"text/template"
)

func main() {
	noUsePipe()
	usePipe()
	noUseHyphen()
	useHyphen()
}

/*
output
*/
func noUsePipe() {
	const tmplStr = `
{{printf "%s" "output"}}
`

	executeTemplate("noUsePipe", tmplStr, nil)
}

/*
output
*/
func usePipe() {
	const tmplStr = `
{{"output" | printf "%s"}}
`

	executeTemplate("usePipe", tmplStr, nil)
}

/*
name is
lee
age is
34
*/
func noUseHyphen() {
	const tmplStr = `
name is 
{{ .name }}
age is
{{ .age }}
`

	info := map[string]interface{}{
		"name": "lee",
		"age":  34,
	}

	executeTemplate("noUseHyphen", tmplStr, info)
}

/*
name is lee
age is 34
*/
func useHyphen() {
	const tmplStr = `
name is{{ .space }}
{{- .name}}
age is{{ .space }}
{{- .age}}
`

	info := map[string]interface{}{
		"name":  "lee",
		"age":   34,
		"space": " ",
	}

	executeTemplate("noUseHyphen", tmplStr, info)
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
