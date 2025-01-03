import { Component, OnInit } from '@angular/core';
import { CallApiService } from '../call-api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public jsonData: any;
  constructor(private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.apiSrv.getFormOneData().subscribe((resp)=>this.jsonData = resp);
  }

  exportToCSV(): void {
    const csv = this.apiSrv.convertJsonToCsv(this.jsonData);
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
}