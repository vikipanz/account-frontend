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



  


}
