import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient  } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { formatDate } from '@angular/common';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'ngbd-carousel-basic',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {


  images = [701, 800, 900, 920].map((n) => `https://al07-rect.s3.eu-west-3.amazonaws.com/images/${n}.png`);

  private loginInfoStr : string;
  public loginInfo : object = null;
  public date : Date = new Date();

  public ipAddress : String = "";
  public browser : String = "Non Reconnu";
  public dateStr : String = "";

  constructor(private http:HttpClient,
    config: NgbCarouselConfig) {
    this.date = new Date();
    config.interval = 2800;
    config.keyboard = true;
    config.pauseOnHover = true;
    
   }

  ngOnInit(): void {
    // Recuperation browser et version :
    this.browser = this.myBrowser();
    // Formatage date et heure en francais
    registerLocaleData(localeFr, 'fr');
    let d = new Date(); 
    this.dateStr = formatDate(d,'EEEE d MMMM yyyy à HH:mm:ss', 'fr');
    // recuperation user connecte
    this.loginInfoStr = sessionStorage.getItem('curUser');
    if (this.loginInfoStr != null) {
      this.loginInfo = JSON.parse(this.loginInfoStr);
      console.log("email : " + this.loginInfo["email"]  + " / isadmin : " 
      + this.loginInfo["isAdmin"])
    }

  }

  myBrowser() { 
    let Agent = navigator.userAgent;
    console.log('browser agent : ' + Agent)
    if((Agent.indexOf("Opera") || Agent.indexOf('OPR')) != -1 ) {
        return 'Opera';
    }else if(Agent.indexOf("Edg") != -1 ){
      let pos = Agent.indexOf(" Edg") 
      let vartra = Agent.substr(pos,20)
      let tabtra = vartra.split("/");
      return 'Microsoft Edge version '+ tabtra[1];
    }else if(Agent.indexOf("Chrome") != -1 ){
        let pos = Agent.indexOf(" Chrome") 
        let vartra = Agent.substr(pos,20)
        let tabtra = vartra.split("/");
        return 'Google Chrome version '+ tabtra[1];
    }else if(Agent.indexOf("Safari") != -1){
        return 'Safari';
    }else if(Agent.indexOf("Firefox") != -1 ) {
       let pos = Agent.indexOf(" Firefox") 
        let vartra = Agent.substr(pos,20)
        let tabtra = vartra.split("/");
         return 'Firefox version ' + tabtra[1];;
    }else if((Agent.indexOf("MSIE") != -1 ) || (!!document.DOCUMENT_NODE == true )){
      return 'IE'; 
    } else {
       return 'unknown';
    }

}

 



}
