FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY gradle /app/gradle
COPY gradlew /app/gradlew
COPY build.gradle /app/build.gradle
COPY settings.gradle /app/settings.gradle

RUN ./gradlew build -x test --parallel --continue || true

COPY . .

RUN ./gradlew bootJar


FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
