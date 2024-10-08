FROM golang:1.21 as builder

WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all source files
COPY *.go ./
COPY .env.encoded ./

# Install dependencies explicitly if needed
RUN go get github.com/joho/godotenv \
    && go get github.com/lib/pq \
    && go get github.com/gin-gonic/gin \
    && go get github.com/gin-contrib/cors \
    && go get github.com/jinzhu/gorm

# Decode .env.encoded into .env
RUN cat .env.encoded | base64 -d > .env

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o db-service .

# Final Stage
FROM alpine:3.14

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the built executable and the environment file
COPY --from=builder /app/db-service .
COPY --from=builder /app/.env .

# Set environment variables if necessary
ENV $(cat .env | xargs)

EXPOSE 8082

CMD ["./db-service"]
