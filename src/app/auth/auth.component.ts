import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: '/auth.component.html'
})
export class AuthComponent implements OnInit{

  isLoginMode;
  formulario: FormGroup;
  isLoading = false;
  error: string = null;
  authObservable = new Observable();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoginMode = true;
    this.formulario = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    if (this.isLoginMode) {
      this. authObservable = this.authService.login(email, password);
    } else {
      this. authObservable = this.authService.signup(email, password);
    }

    this.authObservable.subscribe(
      response => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error => {
        this.error = error;
        this.isLoading = false;
      }
    );


    form.reset();
  }
}
