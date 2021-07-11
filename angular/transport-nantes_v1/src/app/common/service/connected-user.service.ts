import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class connectedUserService {

  private _curUser$ :BehaviorSubject<string> ;

  constructor() { 
    this._curUser$ = new BehaviorSubject<string>(this.StoredEmail);
  }

  public get getConnectedUserObservable() {
    return this._curUser$;
  }

  public set SetConnectedUser(c:string){
    this._curUser$.next(c);
  }

  public get StoredEmail (){
    let objstr = sessionStorage.getItem('curUser');
    let email = null;
    if (objstr !== null) {
      let objuser = JSON.parse(objstr);
      email = objuser["email"];
    }
    return email;

  }

 
  public get ObjStoredEmail (){
    let objstr = sessionStorage.getItem('curUser');
    let objres  = null;
    if (objstr !== null) {
      objres = JSON.parse(objstr);
    }
    return objres;

  }


 
}
