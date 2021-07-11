import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../common/service/preferences.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public couleurFondPrefereeLocale : string = "green";
  public couleurtext : string = "white";

  public listeCouleurs : string[] = [ "green", "DarkGreen","ForestGreen",
  "blue", "Navy","DarkBlue","MidnightBlue",'LimeGreen'] ;


  constructor(private _preferencesService : PreferencesService) {
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

}