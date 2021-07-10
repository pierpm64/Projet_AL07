import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../data/login';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { getGenericresponse } from '../data/getGenericresponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetStationService {

  
  private _apiBaseUrl = environment.apiPrefix + ":8282";


  private _headers = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private _http : HttpClient) { }

  public getStation(codeStation:String): Observable<getGenericresponse>{
     let url = this._apiBaseUrl +"/transport-nantes-api/public/station/" + codeStation;

     return this._http.get<getGenericresponse>(url)
            .pipe(
                tap((getGenericresponse)=>{ 
                    
                })
            );
  }
}
