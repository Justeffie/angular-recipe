import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/internal/operators";
import {BehaviorSubject, Subject, throwError} from "rxjs/index";
import {error} from "@angular/compiler/src/util";
import {User} from "./user.model";
import {Router} from "@angular/router";
import loader from "@angular-devkit/build-angular/src/angular-cli-files/plugins/single-test-transform";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;

}
@Injectable({ providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=--',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(response => {
          this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  login(email: string, password: string) {
   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=--', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(response => {
     this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
   }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autologout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autologin() {
    const userData: {
      email: string, id: string, _token: string, _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loaderUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate).getDate());

    if (loaderUser.token) {
      this.user.next(loaderUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() -  new Date().getTime();
      this.autologout(expirationDuration);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS': errorMessage = 'Este mail ya existe';
      break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'Muchas peticiones. Pruebe más tarde';
      break;
      case 'EMAIL_NOT_FOUND': errorMessage = 'Este mail no existe';
      break;
      case 'INVALID_PASSWORD': errorMessage = 'Contraseña incorrecta';
      break;
      case 'USER_DISABLED': errorMessage = 'Usuario sin permisos';
      break;
    }

    return throwError(errorMessage);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate.getDate());
    this.user.next(user);
    this.autologout(expiresIn);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
