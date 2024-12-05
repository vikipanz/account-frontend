import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CallApiService } from '../call-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private api: CallApiService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    });
  }

  login(){
    const userCreds = this.loginForm.getRawValue();
    const name = userCreds.userName.toLowerCase();
    const password = userCreds.password.toLowerCase();
    if(name === 'user one' && password ==='pass'){
      this.router.navigateByUrl('/form-one');
    }
    else if (name === 'user two' && password === 'password') {
      this.router.navigateByUrl('/form-two');
    }
    else if (name === 'user three' && password === 'passthree') {
      this.router.navigateByUrl('/form-three');
    }
    else if (name === 'user four' && password === 'passfour'){
      this.router.navigateByUrl('/form-four');
    }
    else if (name === 'user five' && password === 'passfive'){
      this.router.navigateByUrl('/form-five');
    }
    else if (name === 'admin' && password === 'admin'){
      this.router.navigateByUrl('/signup');
    }
    else{
      this.api.show('Invalid User, Use proper Credentials');
    }
  }

}
