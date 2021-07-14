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
  private userLocal : string;
 

  constructor(
    private router: Router,
    private _loginService :LoginService,
    private location: Location ,
    private _connectUserService : connectedUserService) {
     }

  public onLogin(){
     //this.message = "donnees saisies = " + JSON.stringify(this.login);
     this._loginService.Login$(this.login.username,this.login.password)
         .subscribe({
           next : (response :LoginResponse) => { 
                  this.traiterReponseLogin(response);
                  this.router.navigate(['/welcome']);
           },
           error : (err) => { console.log("error:"+JSON.stringify(err));
               
                    
                    if (err["error"] == undefined) {
                      this.message="pas de compte pour cet email et mot de passe !"
                    } else {
                      this.message="une erreur technique a eu lieu."}
                    }
           });
  }

  public createUser(){
    this.router.navigate(['/CreateUser']);
  }

  private traiterReponseLogin(loginResponse :LoginResponse){
    this.message = loginResponse.message;//améliorable !!!
    // console.log("loginResponse="+JSON.stringify(loginResponse));
  }

  ngOnInit(): void {
    this.location.replaceState('/');
    this.login.username = this.userLocal;
    sessionStorage.removeItem('curUser');
    this._connectUserService.SetConnectedUser = null;
  }
}
