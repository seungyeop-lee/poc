package main

type Server struct{}

func (s *Server) BuildSpring(
	// 빌드 대상의 디렉토리
	dir *Directory,
) (*File, error) {
	f := dag.Container().
		From("eclipse-temurin:21-jdk").
		WithWorkdir("/app").
		WithDirectory("/app/gradle", dir.Directory("gradle")).
		WithFiles("/app", []*File{dir.File("gradlew")}).
		WithFiles("/app", []*File{
			dir.File("build.gradle"),
			dir.File("settings.gradle"),
		}).
		WithExec([]string{"./gradlew"}).
		WithDirectory("/app/src", dir.Directory("src")).
		WithExec([]string{"./gradlew", "bootJar"}).
		File("jar/spring.jar")

	return f, nil
}

func (s *Server) BuildJarContainer(
	// jar 파일
	file *File,
	// profile
	// +optional
	profile string,
) (*Directory, error) {
	if profile == "" {
		profile = "default"
	}

	dockerfile := `
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY app.jar app.jar

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=` + profile + `", "app.jar"]
`

	dir := dag.Directory().
		WithFile("app.jar", file).
		WithNewFile("Dockerfile", dockerfile)

	return dag.Docker().
		Build(dir, DockerBuildOpts{
			Platform: []string{"linux/arm64"},
		}).
		Save(DockerBuildSaveOpts{
			Name: "spring",
		}), nil
}
