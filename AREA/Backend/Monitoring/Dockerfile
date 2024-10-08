FROM golang:1.21 as builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

COPY .env.encoded ./

RUN cat .env.encoded | base64 -d > .env

RUN CGO_ENABLED=0 GOOS=linux go build -v -o monitoring-service

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/monitoring-service .

COPY --from=builder /app/.env .

ENV $(cat .env | xargs)

EXPOSE 8081

CMD ["./monitoring-service"]