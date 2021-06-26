import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  private loginInfoStr : string;
  public loginInfo : object = null;
  public date : Date = new Date();

  constructor() {
    this.date = new Date();
   }

  ngOnInit(): void {
    this.loginInfoStr = sessionStorage.getItem('curUser');
    if (this.loginInfoStr != null) {
      this.loginInfo = JSON.parse(this.loginInfoStr);
      console.log("email : " + this.loginInfo["email"]  + " / isadmin : " 
      + this.loginInfo["isAdmin"])
    }

  }


}
