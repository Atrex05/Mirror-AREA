import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule, HttpClientModule, CommonModule]
})
export class AppComponent {
  user: string = '';
  pass: string = '';
  text: string = '';
  boutonClass: string = 'login';

  constructor(private http: HttpClient) {}

  created() {
    const url = 'http://127.0.0.1:8080/login';
    const requestOptions = {
      username: this.user,
      password: this.pass
    };

    this.http.post(url, requestOptions).subscribe({
      next: (data) => {
        console.log(data);
        this.text = 'connected';
      },
      error: (error) => {
        console.error(error);
        this.text = 'failed to connect';
      }
    });
  }
}
