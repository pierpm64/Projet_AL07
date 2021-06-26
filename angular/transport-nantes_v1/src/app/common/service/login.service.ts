import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../data/login';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { LoginResponse } from '../data/loginpesponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //private _apiBaseUrl ="http://localhost:9998/utilisateur/utilisateurByEmailAndPassword/...; 
  // private _apiBaseUrl ="./login-api";
  private _apiBaseUrl ="http://localhost:9998";


  private _headers = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private _http : HttpClient) { }

  public Login$(user: string,password: string): Observable<LoginResponse>{
     let url = this._apiBaseUrl +"/utilisateur/utilisateurByEmailAndPassword/" + user + "/" + password;
     // console.log("URL GET " + url)

     // return this._http.get<LoginResponse>(url)
     //.pipe(
     //  map( (res:LoginResponse) => res.result)
     // );
     return this._http.get<LoginResponse>(url)
            .pipe(
                tap((loginResponse)=>{ 
                        this.sauvegarderUser(loginResponse);}
                   )
            );
  }

  private sauvegarderUser(loginResponse:LoginResponse){
       if(loginResponse.email){
         sessionStorage.setItem('curUser',JSON.stringify(loginResponse));
         //ou autre façon de mémoriser le jeton
       }
       else{
        sessionStorage.setItem('CurUser',null);
       }
  }

}
