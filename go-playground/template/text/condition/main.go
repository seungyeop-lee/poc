package main

import (
	"log"
	"os"
	"text/template"
)

func main() {
	withExample()
	withElseExample()
	ifExample()
	ifElseExample()
	ifElseifElseExample()
	andOrExample()
}

/*
title is "about with"
*/
func withExample() {
	const tmplStr = `
{{ with .title }}
title is "{{ . }}"
{{ end }}`

	info := map[string]interface{}{
		"title": "about with",
	}

	executeTemplate("with example", tmplStr, info)
}

/*
point == 100 : true
*/
func withElseExample() {
	const tmplStr = `
{{ with eq .point 100 }}
point == 100 : {{ . }}
{{ else }}
point == 100 : false
{{ end }}`

	info := map[string]interface{}{
		"point": 100,
	}

	executeTemplate("with .. else example", tmplStr, info)
}

/*
title is "about if"
*/
func ifExample() {
	const tmplStr = `
{{ if .title }}
title is "{{ .title }}"
{{ end }}`

	info := map[string]interface{}{
		"title": "about if",
	}

	executeTemplate("if example", tmplStr, info)
}

/*
point == 100 : true
*/
func ifElseExample() {
	const tmplStr = `
{{ if eq .point 100 }}
point == 100 : {{ eq .point 100 }}
{{ else }}
point == 100 : false
{{ end }}`

	info := map[string]interface{}{
		"point": 100,
	}

	executeTemplate("if .. else example", tmplStr, info)
}

/*
point isn't 0 or 100
*/
func ifElseifElseExample() {
	const tmplStr = `
{{ if (eq .point 100) }}
point is 100
{{ else if (eq .point 0) }}
point is 0
{{ else }}
point isn't 0 or 100
{{ end }}`

	info := map[string]interface{}{
		"point": 99,
	}

	executeTemplate("if .. else if .. else example", tmplStr, info)
}

/*
name is lee AND point is 100
*/
func andOrExample() {
	const tmplStr = `
{{ if (and (eq .name "lee") (eq .point 100)) }}
name is lee AND point is 100
{{ else if (or (eq .name "kim") (eq .point 0)) }}
name is kim OR point is 0
{{ else }}
I don't know
{{ end }}`

	info := map[string]interface{}{
		"name": "lee",
		"point": 100,
	}

	executeTemplate("and & or example", tmplStr, info)
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