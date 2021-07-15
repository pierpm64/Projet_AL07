import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../common/service/preferences.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public couleurFondPrefereeLocale : string = "green";
  public couleurtext : string = "white";

  public envBld : string = environment.libEnv;
  public dateHeureBld : string = environment.timeStamp;
  public imgServeur : string = environment.imgServer;

  public browser : String = "Non Reconnu";

  public listeCouleurs : string[] = [ "green", "DarkGreen","ForestGreen",
  "blue", "Navy","DarkBlue","MidnightBlue",'LimeGreen'] ;


  constructor(private _preferencesService : PreferencesService,
              private modalService: NgbModal) {
        //synchronisation de la "copie locale" :
        this._preferencesService.couleurFondPrefereeObservable
            .subscribe(
              //callback éventuellement re-déclenchée plusieurs fois :
              (couleurFondPreferee)=>{
                  this.couleurFondPrefereeLocale=couleurFondPreferee;}
            );
  }

  public onCouleurFondPrefereeLocaleChange(){
    this._preferencesService.couleurFondPreferee=
                    this.couleurFondPrefereeLocale;

    switch (this.couleurFondPrefereeLocale) {
      case "LimeGreen" : this.couleurtext = "Midnightblue";break;
      default : this.couleurtext = "white"
    }
  }

  ngOnInit(): void {

    this.browser = this.myBrowser();
  }

  
    
  openBackDropCustomClass(content) {
    this.modalService.open(content, {backdropClass: 'dark-blue-backdrop'});
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  openSm(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  openXl(content) {
    this.modalService.open(content, { size: 'xl' });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }

  openModalDialogCustomClass(content) {
    this.modalService.open(content, { modalDialogClass: 'dark-modal' });
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
      let pos = Agent.indexOf(" Safari") 
      let vartra = Agent.substr(pos,20)
      let tabtra = vartra.split("/");
      return 'Apple Safari version ' + tabtra[1];;
    }else if(Agent.indexOf("Firefox") != -1 ) {
       let pos = Agent.indexOf(" Firefox") 
        let vartra = Agent.substr(pos,20)
        let tabtra = vartra.split("/");
        return 'Mozilla Firefox version ' + tabtra[1];;
    }else if((Agent.indexOf("MSIE") != -1 ) || (!!document.DOCUMENT_NODE == true )){
      return 'IE'; 
    } else {
       return 'Non reconnu';
    }

}

  
  
}