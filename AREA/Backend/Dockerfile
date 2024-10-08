FROM golang:1.21 as builder

WORKDIR /app

# Copier les fichiers go.mod et go.sum
COPY go.mod go.sum ./

# Télécharger les dépendances
RUN go mod download

# Copier le reste du code source
COPY . .

# Installer les dépendances explicitement
RUN go get github.com/joho/godotenv
RUN go get github.com/lib/pq
RUN go get github.com/gin-gonic/gin
RUN go get github.com/gin-contrib/cors

# Construire l'application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Étape finale, utiliser une image de base légère
FROM alpine:3.14

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copier l'exécutable depuis l'étape de construction
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]