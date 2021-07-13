import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-net-histo',
  templateUrl: './net-histo.component.html',
  styleUrls: ['./net-histo.component.scss']
})
export class NetHistoComponent implements OnInit {


  public imgServer : String = environment.imgServer;
  public ApiPrefix : String = environment.apiPrefix;

  public loginInfo : Object = null;

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.location.replaceState('/');
    // check Connected and Admin
    let loginInfoStr = sessionStorage.getItem('curUser');
    let isDba = false;
    if (loginInfoStr != null) {
      this.loginInfo = JSON.parse(loginInfoStr);
      isDba = this.loginInfo["isAdmin"];
    }
    if (!isDba) {
      this.router.navigate(['/login']);
    }
  }


}
