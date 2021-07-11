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
export class favoris {

  private _apiBaseUrl = environment.apiPrefix + ":8282";


  private _headers = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private _http : HttpClient) { }

  // methode get liste favoris
  public getfavori$(email:String=undefined,station:String=undefined): Observable<getGenericresponse>{
     let url = this._apiBaseUrl +"/transport-nantes-api/public/favoris"

     // rajout criteres dans url
     let urladd = "";
     if (email !== undefined) {
        if (urladd == "") {
          urladd = "?email="+email;
        } else {
          urladd = urladd + "&email="+email;
        }
     }

     if (station !== undefined) {
      if (urladd == "") {
        urladd = "?station="+station;
      } else {
        urladd = urladd + "&station="+station;
      }
   }

      url = url + urladd;

      console.log("appel Node MicroService Get : " + url)

     return this._http.get<getGenericresponse>(url)
            .pipe(
                tap((getGenericresponse)=>{ 
                    
                })
            );
  }

  
  // methode add liste favoris
  public addfavori$(email:String,station:String): Observable<getGenericresponse>{
    let url = this._apiBaseUrl +"/transport-nantes-api/public/favoris?email="+email+"&station="+station

     console.log("appel Node MicroService Add : " + url)

    return this._http.post<getGenericresponse>(url,{}, {headers: this._headers})
           .pipe(
               tap((getGenericresponse)=>{ 
                   
               })
           );
 }

 // methode delete liste favoris
 public Delfavori$(email:String=undefined,station:String=undefined): Observable<getGenericresponse>{
  let url = this._apiBaseUrl +"/transport-nantes-api/public/favoris"

  // rajout criteres dans url
  let urladd = "";
  if (email !== undefined) {
     if (urladd == "") {
       urladd = "?email="+email;
     } else {
       urladd = urladd + "&email="+email;
     }
  }

  if (station !== undefined) {
   if (urladd == "") {
     urladd = "?station="+station;
   } else {
     urladd = urladd + "&station="+station;
   }
}

   url = url + urladd;

   console.log("appel Node MicroService Del : " + url)

  return this._http.delete<getGenericresponse>(url)
         .pipe(
             tap((getGenericresponse)=>{ 
                 
             })
         );
}

}
