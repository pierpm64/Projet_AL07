import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Login } from '../common/data/login'
import { LoginCre } from '../common/data/loginCre'
import { LoginService } from '../common/service/login.service'
import { LoginResponse } from '../common/data/loginpesponse';
import { connectedUserService } from '../common/service/connected-user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {
  public login : Login = new Login();
  public logincre : LoginCre = new LoginCre();
  public passwordcnf : String = "";
  public message :string ;
  public typUser :string  = "Utilisateur";
  private userLocal : string;

  public signedUser : Object;
 

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

  public onCreate(){

    if (this.logincre.password !== this.passwordcnf  ) {
      this.message="le mot de passe n'a pas été confirmé"
      return;
    }
    
      this._loginService.CreatUser$(this.logincre)
          .subscribe({
            next : (response :LoginResponse) => { 
              this.router.navigate(['/welcome']);
              
               } ,
            error : (err) => { console.log("error:"+ JSON.stringify(err));
                      if (err["status"] == 409) {
                        this.message="un compte avec cet email existe déjà !";
                      } else {
                      this.message="une erreur technique a eu lieu."}}
            });
          }   


  ngOnInit(): void {
    this.location.replaceState('/');
    this.login.username = this.userLocal;
    this.signedUser =  this._connectUserService.ObjStoredEmail
    if (this.signedUser !== null)  {
      if (this.signedUser["isAdmin"] == true) {
        this.logincre.isAdmin = true;
        this.typUser = "Administrateur";
      }
    }
  }

}
