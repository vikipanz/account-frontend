import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallApiService } from '../call-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private apiSrv: CallApiService) { }

  ngOnInit(): void {
  }

  formone(){
    this.router.navigateByUrl('/form-one');
  }
  formtwo(){
    this.router.navigateByUrl('/form-two');
  }
  formthree(){
    this.router.navigateByUrl('/form-three');
  }
  formfour(){
    this.router.navigateByUrl('/form-four');
  }
  formfive(){
    this.router.navigateByUrl('/form-five');
  }
}
