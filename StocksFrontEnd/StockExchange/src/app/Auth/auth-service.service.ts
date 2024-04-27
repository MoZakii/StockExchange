import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../Notification/notification.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router : Router , private notificationService: NotificationService ) { }

  Register (username: string, passwordHash: string) : Observable<any> 
  {
    return this.http.post<any>(`https://localhost:7015/api/register`, { username, passwordHash })
    .pipe(
      tap(response => {
        console.log(response);
        this.notificationService.showSuccess('You\'ve successfully signed up. Please log in using your credentials');
        this.router.navigate(['/'] );

      }),
      catchError(error => {
        if (error.status === 400) {
          this.notificationService.showSuccess('Username already exists.');
        }
        return throwError(error);
      })
    );
  }


  login(username: string, password: string): Observable<any> {

    const helper = new JwtHelperService();

  return this.http.post<any>(`https://localhost:7015/api/login`, { username, password })
    .pipe(
      tap(response => {
        var claims = helper.decodeToken(response.token);
        var WelcomeMsg = "Welcome " + claims.sub; 
        this.notificationService.showSuccess(WelcomeMsg);
        localStorage.setItem("token", response.token); 
        this.loggedIn.next(true);
        this.router.navigate(['/stocks'] );

      }),
      catchError(error => {
        if (error.status === 401) {
          this.notificationService.showSuccess('Invalid Username Or Password');
        }
        return throwError(error);
      })
    );
}
  
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

}