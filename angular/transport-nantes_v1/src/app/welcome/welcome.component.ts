import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient  } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { formatDate } from '@angular/common';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';





@Component({
  selector: 'ngbd-carousel-basic',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  public images : String[] = [];
  private imgServer : String = environment.imgServer;
  
  private loginInfoStr : string;
  public loginInfo : object = null;
  public isAdmin : boolean = false;
  public date : Date = new Date();

  public ipAddress : String = "";
  public browser : String = "Non Reconnu";
  public dateStr : String = "";

  constructor(private http:HttpClient,
    private location: Location,
    config: NgbCarouselConfig) {
    this.date = new Date();
    config.interval = 2800;
    config.keyboard = true;
    config.pauseOnHover = true;
    
   }

  ngOnInit(): void {
    // init liste des images
    let ImagesN = [701, 800, 900, 920];
    for (let num in ImagesN) {
      let imgUrl = this.imgServer + ImagesN[num].toString() + ".png"
      this.images.push(imgUrl);

    }
    // console.log(JSON.stringify(this.images));
    //
    this.location.replaceState('/');
    // Recuperation browser et version :
    this.ipAddress = window.location.origin;
    // Formatage date et heure en francais
    registerLocaleData(localeFr, 'fr');
    let d = new Date(); 
    this.dateStr = formatDate(d,'EEEE d MMMM yyyy à HH:mm:ss', 'fr');
    // recuperation user connecte
    this.loginInfoStr = sessionStorage.getItem('curUser');
    if (this.loginInfoStr != null) {
      this.loginInfo = JSON.parse(this.loginInfoStr);
      //console.log("email : " + this.loginInfo["email"]  + " / isadmin : " 
      // + this.loginInfo["isAdmin"])
      this.isAdmin = this.loginInfo["isAdmin"];
    }

  }


 



}
