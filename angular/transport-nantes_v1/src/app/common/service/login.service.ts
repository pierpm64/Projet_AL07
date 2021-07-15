import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../data/login';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { LoginResponse } from '../data/loginpesponse';
import { environment } from 'src/environments/environment';
import { connectedUserService } from './connected-user.service';
import { LoginCre } from '../data/loginCre';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //private _apiBaseUrl ="http://localhost:9998/utilisateur/utilisateurByEmailAndPassword/...; 
  private _apiBaseUrl = environment.apiPrefix + ":9998";

  private userLocal : string = null;

  private _headers = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private _http : HttpClient,
    private _connecteduserService : connectedUserService) {

      this._connecteduserService.getConnectedUserObservable
      .subscribe(
        //callback éventuellement re-déclenchée plusieurs fois :
        (EmailConnecte)=>{
            this.userLocal=EmailConnecte;}
      );
     }

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
                        this._connecteduserService.SetConnectedUser = null;
                        this.sauvegarderUser(loginResponse,"store");}
                   )
            );
  }

  public CreatUser$(objUser:LoginCre): Observable<LoginResponse>{
    let url = this._apiBaseUrl +"/utilisateur/creerUtilisateur" 

    return this._http.post<LoginResponse>(url,objUser, {headers: this._headers} )
            .pipe(
                tap((loginResponse)=>{ 
                      if (loginResponse.isAdmin) {
                        this.sauvegarderUser(loginResponse,"nostore");
                      }
                      else 
                      { 
                        this.sauvegarderUser(loginResponse,"store");
                      }
                    })
            );
   
 }

  private sauvegarderUser(loginResponse:LoginResponse,param:string){
       if(loginResponse.email){
         if (param == "store") {
            sessionStorage.setItem('curUser',JSON.stringify(loginResponse));
            this._connecteduserService.SetConnectedUser=
                    loginResponse.email;
         }
         //ou autre façon de mémoriser le jeton
       }
       else{
        sessionStorage.setItem('CurUser',null);
       }
  }

}
