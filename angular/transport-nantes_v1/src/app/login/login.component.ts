import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Login } from '../common/data/login'
import { LoginService } from '../common/service/login.service'
import { LoginResponse } from '../common/data/loginpesponse';
import { connectedUserService } from '../common/service/connected-user.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public login : Login = new Login();
  public message :string ;
  private userLocal : String;
 

  constructor(
    private router: Router,
    private _loginService :LoginService,
    private location: Location ,
    private _connectUserService : connectedUserService) {
      this._connectUserService.getConnectedUserObservable
      .subscribe(
        //callback éventuellement re-déclenchée plusieurs fois :
        (EmailConnecte)=>{
            this.userLocal=EmailConnecte;}
      );
     }

  public onLogin(){
     //this.message = "donnees saisies = " + JSON.stringify(this.login);
     this._loginService.Login$(this.login.username,this.login.password)
         .subscribe({
           next : (response :LoginResponse) => { 
                  this.traiterReponseLogin(response);
                  this.message = "bienvenue " + response.pseudo + " (" + response.prenom + " " + response.nom + ")" 
                  this.router.navigate(['/welcome']);
           },
           error : (err) => { console.log("error:"+JSON.stringify(err));
               
                    sessionStorage.removeItem('curUser');
                    this._connectUserService.SetConnectedUser = null;
                    if (err.error.message) {
                      this.message = err.error.message    
                    } else {
                      this.message="une erreur technique a eu lieu."}
                    }
           });
  }

  private traiterReponseLogin(loginResponse :LoginResponse){
    this.message = loginResponse.message;//améliorable !!!
    console.log("loginResponse="+JSON.stringify(loginResponse));
  }

  ngOnInit(): void {
    this.location.replaceState('/');
  }
}
