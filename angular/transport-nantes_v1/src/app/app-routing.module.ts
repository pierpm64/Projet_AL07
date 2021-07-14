import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LstlieuxComponent} from './lieux/lstlieux/lstlieux.component';
import { HorairesComponent } from './horaires/horaires.component';
import { AdmLieuxComponent } from './adm-lieux/adm-lieux.component';
import { NetHistoComponent } from './net-histo/net-histo.component';
import { FavoritesLinesComponent } from './favorites-lines/favorites-lines.component';
import { CreateuserComponent } from './createuser/createuser.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path : 'allplaces', component : LstlieuxComponent},
  { path : 'horaires/:lieu', component : HorairesComponent},
  { path : 'Deconnexion', component : LogoutComponent},
  { path : "myStations", component : FavoritesLinesComponent},
  { path : "AdmLieux", component : AdmLieuxComponent},
  { path : "NetHisto", component : NetHistoComponent},
  { path : "CreateUser", component : CreateuserComponent}

  // { path: 'basic', component: BasicComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
