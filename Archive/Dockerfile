FROM golang:1.21 as builder
WORKDIR /app
COPY POCS/Poc_go/go.mod POCS/Poc_go/go.sum ./
RUN go mod download
COPY POCS/Poc_go/ ./
RUN go get github.com/lib/pq
RUN go get github.com/gin-contrib/cors
RUN go get github.com/gin-gonic/gin
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:3.14
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]