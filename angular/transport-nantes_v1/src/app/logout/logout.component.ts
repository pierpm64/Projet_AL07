import { Component, OnInit } from '@angular/core';
import { connectedUserService } from '../common/service/connected-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private _connectUserService : connectedUserService
  ) { 
    this._connectUserService.getConnectedUserObservable
    .subscribe(
    );
  }

  ngOnInit(): void {
    sessionStorage.removeItem('curUser');
    this._connectUserService.SetConnectedUser = null;
    this.router.navigate(['/welcome']);
  }

}
