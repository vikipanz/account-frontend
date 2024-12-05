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
    const csv = this.convertJsonToCsv(this.jsonData);
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  private convertJsonToCsv(jsonData: any[]): string {
    const headers = Object.keys(jsonData[0]).filter(key => key !== '_id' && key !== '__v');
  
    const rows = jsonData.map(row => {
      return headers.map(fieldName => {
        let value = row[fieldName];
  
        if (!isNaN(value) && value !== '') {
          value = parseFloat(value);
        }
        else if (value && !isNaN(Date.parse(value))) {
          value = formatDate(new Date(value));
        }
        else {
          value = value === null || value === undefined ? '' : value;
        }
  
        return JSON.stringify(value);
      }).join(',');
    });
  
    return [headers.join(','), ...rows].join('\n');
  }

}
  
  function formatDate(date: any): string {
    if (date instanceof Date) {
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return '';
  }