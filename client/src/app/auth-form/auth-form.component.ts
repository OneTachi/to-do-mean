import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service'; 
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Please login below.</h1>
    <p>Note: Do not use any real usernames or passwords. None of this is secure lol</p>
    <div #login>
        <form (ngSubmit)='onSubmit()' #loginForm="ngForm">
            Username: <input type="text" name="username" required [(ngModel)]="user.username"><br>
            Password:  <input type="password" name="password" required [(ngModel)]="user.password"><br>
            <button type="submit">Submit</button>
        </form>
        <button (click)="handleClick()">Want to sign up?</button>
    </div>
    <div #signup class="hidden">
        <form (ngSubmit)='onSign()' #signupForm="ngForm">
            Username: <input type="text" name="username" required [(ngModel)]="sign.username"><br>
            Password:  <input type="password" name="password" required [(ngModel)]="sign.password"><br>
			<button type="submit">Submit</button>
		</form>
        <button (click)="handleClick()" >Need to login?</button>
    </div>

  `,
  styles: `
	.hidden {
		display:none
	}`,
})
export class AuthFormComponent {
	@ViewChild('login') loginRef!: ElementRef;
	@ViewChild('signup') signupRef!: ElementRef;  

	constructor(private renderer: Renderer2, private router: Router, private http: HttpClient, cookieService: CookieService) {}	

	handleClick() {
		if (this.loginRef.nativeElement.className === "hidden") {
			this.signupRef.nativeElement.className = "hidden";
			this.renderer.removeClass(this.loginRef.nativeElement, 'hidden');
		} else {
			this.loginRef.nativeElement.className = "hidden";
			this.renderer.removeClass(this.signupRef.nativeElement, 'hidden');
		}
	}

	user = {username: '', password: ''};
	sign = {username: '', password: ''};
  onSubmit() {
    this.http.post(`http://142.93.195.64:5200/login`, { username: this.user.username, password: this.user.password }, { withCredentials: true}).subscribe((response) => {
		this.router.navigate(["/db"]);
	});
  }
	
  onSign() {
    this.http.post(`http://142.93.195.64:5200/signup`, { username: this.sign.username, password: this.sign.password }, { withCredentials: true}).subscribe((response) => {
        this.router.navigate(["/db"]);
    });
  }

}
