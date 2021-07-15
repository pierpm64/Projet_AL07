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

  
  
}