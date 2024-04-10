package main

import (
	"context"
	"fmt"
)

type MultiBuildInfo struct {
	Os            string
	Arch          []string
	FileExtension string
}

var defaultMultiBuildInfo = map[string]MultiBuildInfo{
	"windows": {
		Os:            "windows",
		Arch:          []string{"amd64"},
		FileExtension: ".exe",
	},
	"linux": {
		Os:   "linux",
		Arch: []string{"arm64", "amd64"},
	},
	"macos": {
		Os:   "darwin",
		Arch: []string{"arm64", "amd64"},
	},
}

type Golang struct{}

func (m *Golang) Build(
	ctx context.Context,
	// 빌드 대상의 디렉토리
	dir *Directory,
	// 빌드를 순차적으로 진행
	// +optional
	// +default=false
	sync bool,
) *Directory {
	c := dag.Container().
		From("golang:1.22-bookworm").
		WithWorkdir("/app").
		WithFiles("/app", []*File{dir.File("go.mod")}).
		WithExec([]string{"go", "mod", "download"}).
		WithMountedDirectory("/app", dir)

	var results []*File
	for _, v := range defaultMultiBuildInfo {
		for _, a := range v.Arch {
			fileName := fmt.Sprintf("%s_%s%s", v.Os, a, v.FileExtension)
			f := c.
				WithEnvVariable("GOARCH", a).
				WithEnvVariable("GOOS", v.Os).
				WithExec([]string{"go", "build", "-o", fileName}).
				File(fileName)

			if sync {
				f, _ = f.Sync(ctx)
			}
			results = append(results, f)
		}
	}

	return dag.Directory().WithFiles("/", results)
}
