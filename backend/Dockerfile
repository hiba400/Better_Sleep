# Backend Dockerfile (dev)
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copier tout le projet
COPY . .

# Rendre le wrapper Maven exécutable
RUN chmod +x mvnw

# Exposer le port Spring Boot
EXPOSE 8080

# Lancer l'application en mode développement
CMD ["./mvnw", "spring-boot:run"]

