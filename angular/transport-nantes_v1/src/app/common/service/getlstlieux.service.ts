import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../data/login';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { lstlieuxresponse } from '../data/lstlieuxresponse ';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetLstLieuxService {

  private _apiBaseUrl = environment.apiPrefix + ":8282";


  private _headers = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private _http : HttpClient) { }

  public getAllLieux$(): Observable<lstlieuxresponse>{
     let url = this._apiBaseUrl +"/transport-nantes-api/public/lstLieus"

     return this._http.get<lstlieuxresponse>(url)
            .pipe(
                tap((lstlieuxResponse)=>{ 
                    
                })
            );
  }


}
