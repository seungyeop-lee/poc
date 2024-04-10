package main

import (
	"context"
	"dagger/golang/internal/dagger"
	"fmt"
	"runtime"
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
	os string,
	arch string,
	ext string,
) (*File, error) {
	fileName := fmt.Sprintf("%s_%s%s", os, arch, ext)

	f := dag.Container().
		From("golang:1.22-bookworm").
		WithWorkdir("/app").
		WithFiles("/app", []*File{dir.File("go.mod")}).
		WithExec([]string{"go", "mod", "download"}).
		WithMountedDirectory("/app", dir).
		WithEnvVariable("GOARCH", arch).
		WithEnvVariable("GOOS", os).
		WithExec([]string{"go", "build", "-o", fileName}).
		File(fileName)

	if sync {
		var err error
		f, err = f.Sync(ctx)
		if err != nil {
			return nil, err
		}
	}

	return f, nil
}

func (m *Golang) BuildAll(
	ctx context.Context,
	// 빌드 대상의 디렉토리
	dir *Directory,
	// 빌드를 순차적으로 진행
	// +optional
	// +default=false
	sync bool,
) (*Directory, error) {
	var results []*File
	for _, v := range defaultMultiBuildInfo {
		for _, a := range v.Arch {
			f, err := m.Build(ctx, dir, sync, v.Os, a, v.FileExtension)
			if err != nil {
				return nil, err
			}
			results = append(results, f)
		}
	}

	return dag.Directory().WithFiles("/", results), nil
}

func (m *Golang) BuildContainer(
	ctx context.Context,
	// 빌드 대상의 디렉토리
	dir *Directory,
	// 빌드를 순차적으로 진행
	// +optional
	sync bool,
	// OS
	// +optional
	os string,
	// ARCH
	// +optional
	arch string,
) (*Container, error) {
	if os == "" {
		os = runtime.GOOS
	}
	if arch == "" {
		arch = runtime.GOARCH
	}

	f, err := m.Build(ctx, dir, sync, os, arch, "")
	if err != nil {
		return nil, err
	}

	c := dag.Container(ContainerOpts{Platform: dagger.Platform(fmt.Sprintf("%s/%s", os, arch))}).
		From("debian:bookworm-slim").
		WithFile("/usr/local/bin/main", f).
		WithEntrypoint([]string{"main"})

	return c, nil
}
