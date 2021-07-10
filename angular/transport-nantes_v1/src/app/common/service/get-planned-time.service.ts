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
export class GetPlannedTimeService {

  
  private _apiBaseUrl = environment.apiPrefix + ":8282";


  private _headers = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private _http : HttpClient) { }

  public getPlannedTime(codeStation:String,dateStr:String,ligne:string=undefined,sens:string=undefined): Observable<getGenericresponse>{
     let url = this._apiBaseUrl +"/transport-nantes-api/public/plannedtime"

     // rajout criteres dans url
     let urladd = "";
     if (codeStation !== undefined) {
        if (urladd == "") {
          urladd = "?station="+codeStation;
        } else {
          urladd = urladd + "&station="+codeStation;
        }
     }

     if (dateStr !== undefined) {
        if (urladd == "") {
          urladd = "?date="+dateStr;
        } else {
          urladd = urladd + "&date="+dateStr;
        }
      }

      if (ligne !== undefined) {
        if (urladd == "") {
          urladd = "?ligne="+ligne;
        } else {
          urladd = urladd + "&ligne="+ligne;
        }
      }

      if (sens !== undefined) {
        if (urladd == "") {
          urladd = "?sens="+sens;
        } else {
          urladd = urladd + "&sens="+sens;
        }
      }

      url = url + urladd;

      console.log("appel Node MicroService : " + url)

      // Appel du microservice (Node)

     return this._http.get<getGenericresponse>(url)
            .pipe(
                tap((getGenericresponse)=>{ 
                    
                })
            );
  }
}

