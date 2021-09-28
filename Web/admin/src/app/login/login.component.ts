import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  
  email = new FormControl('', [Validators.required, Validators.email]);
  password:string='';
  error:string='';
  hide = true;

  constructor(private authService:AuthService) { }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Please enter your email';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  handleLogin(){
    if(this.email.value != '' && this.password != '')
      this.authService.login(this.email.value,this.password)
      .then(res => {
        if(res)
          console.log('asdfasdfasdf', res)
        // localStorage.setItem("token", "asdjjalsdjlasdgqwbjqgwhj");
        // this.authService.authSubject.next(true);
      })
      .catch(err => {
        console.log(err);
        this.error = err.message;
        this.setError(err);
      })
    else
      this.error = "Please complete all the fields.";
  }

  setError = (error:any) =>{
    if (error.code === 'auth/invalid-email') {
    this.error = 'That email address is invalid!';
    }
    if (error.code === 'auth/wrong-password') {
    this.error = 'The password is invalid.';
    }
    if (error.code === 'auth/user-not-found') {
    this.error = ' There is no user record corresponding to this email. The user may have been deleted.';
    }
    if (error.code === 'auth/too-many-requests'){
      this.error = 'Access to this account has been temporarily disabled. You can try again later.';
    }
  }
}
