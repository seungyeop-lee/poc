.PHONY:pub-java
pub-java:
	http POST :8080/publish

.PHONY:pub-go
pub-go:
	http POST :8081/publish

.PHONY:pub-python
pub-python:
	http POST :8082/publish

.PHONY:watch
watch:
	directory-watcher -c directory-watcher.config.yml