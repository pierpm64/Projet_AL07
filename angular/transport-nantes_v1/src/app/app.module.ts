import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsUtilModule } from 'src/bs-util/bs-util.module';
import { MyAuthInterceptor } from './common/interceptor/my-auth.interceptor';
import { LstlieuxComponent } from './lieux/lstlieux/lstlieux.component';
import { HorairesComponent } from './horaires/horaires.component';
import { LogoutComponent } from './logout/logout.component';
import { FavoritesLinesComponent } from './favorites-lines/favorites-lines.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdmLieuxComponent } from './adm-lieux/adm-lieux.component';
import { NetHistoComponent } from './net-histo/net-histo.component';
import { CreateuserComponent } from './createuser/createuser.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    WelcomeComponent,
    LstlieuxComponent,
    HorairesComponent,
    LogoutComponent,
    FavoritesLinesComponent,
    AdmLieuxComponent,
    NetHistoComponent,
    CreateuserComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    BsUtilModule,
    NgbModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MyAuthInterceptor,
    multi: true
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
