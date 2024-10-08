use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
struct LoginInfo {
    username: String,
    password: String,
}

async fn login_process(info: web::Json<LoginInfo>) -> impl Responder {
    let username = &info.username;
    let password = &info.password;

    if username == "user" && password == "password" {
        HttpResponse::Ok().body(format!("Welcome, {}!", username))
    } else {
        HttpResponse::Unauthorized().body("Invalid username or password!")
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/login", web::post().to(login_process))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
