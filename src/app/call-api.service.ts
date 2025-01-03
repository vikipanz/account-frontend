import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs';
import { Observable } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class CallApiService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  getFormOneData(){
    return this.http.get('https://account-api-production.up.railway.app/lrRecord').pipe(
      map((resp)=>{
        return resp;
      }),
      catchError((err)=>{
        throw err;
      })
    )
  }


  getUser(){
    return this.http.get('http://localhost:5000/users').pipe(
      map((resp)=>{
        return resp;
      }),
      catchError((err)=>{
        throw err;
      })
    )
  }

  postFormOneData(payload: any){
    return this.http.post('https://account-api-production.up.railway.app/lrRecord',payload).pipe(
      map((resp)=> {
        return resp;
      }),
      catchError((err)=> {
        throw err;
      })
    )
  }

  putFormOneData( lrNum: string ,payload: any){
    return this.http.put(`https://account-api-production.up.railway.app/lrRecord/${lrNum}`,payload).pipe(
      map((resp)=> {
        return resp;
      }),
      catchError((err)=> {
        throw err;
      })
    )
  }

  deleteRecord(lrNum:string) {
    return this.http.delete(`https://account-api-production.up.railway.app/lrRecord/${lrNum}`).pipe(
      map((resp)=> {
        return resp;
      }),
      catchError((err)=> {
        throw err;
      })
    )
  }

  show(message: string, action: string = 'Ok', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  public convertJsonToCsv(jsonData: any[]): string {
    const headers = Object.keys(jsonData[0]).filter(key => key !== '_id' && key !== '__v').map(header => header.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase());
    const originalKey = Object.keys(jsonData[0]).filter(key => key !== '_id' && key !== '__v');
    const rows = jsonData.map(row => {
      return originalKey.map(fieldName => {
        let value = row[fieldName];
  
        if (!isNaN(value) && value !== '') {
          value = parseFloat(value);
        }
        else if (value && !isNaN(Date.parse(value))) {
          value = this.formatDate(new Date(value));
        }
        else {
          value = value === null || value === undefined ? '' : value;
        }
  
        return JSON.stringify(value);
      }).join(',');
    });
  
    return [headers.join(','), ...rows].join('\n');
  }


  formatDate(date: any): string {
    if (date instanceof Date) {
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return '';
  }
  


}
