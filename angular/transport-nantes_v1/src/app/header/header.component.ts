import { Component, Input, OnInit } from '@angular/core';
import { MenuDefinition } from 'src/bs-util/data/MenuDefinition';
import { PreferencesService } from '../common/service/preferences.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  public titre :string ="default-title";

  public couleurFondPrefereeLocale : string = "lightgrey";
  public couleurTextePrefereeLocale : string = "black";



  myMenuDef : MenuDefinition[] = [
    { label : "Fichier" , 
      children : [
        { label : "Login" , path : "/ngr-login" } ,
        { label : "Accueil" , path : "/ngr-welcome" },
        { divider : true },
        { label : "Mes lieux" , path : "/ngr-myplaces" },
        { label : "Tous les lieux" , path : "/ngr-allplaces" }
      ]
    },
    // { label : "basic" , path : "/ngr-basic" } , 
    // { label : "welcome" , path : "/ngr-welcome" }
    ];

 
    constructor(private _preferencesService : PreferencesService) {
      //synchronisation de la "copie locale" :
      this._preferencesService.couleurFondPrefereeObservable
      .subscribe(
        //callback éventuellement re-déclenchée plusieurs fois :
        (couleurFondPreferee)=>{
            console.log("nouvelle couleurFondPreferee="+couleurFondPreferee)
            if (couleurFondPreferee == "blue") {
              this.couleurTextePrefereeLocale = "white";
            }
            else {
              this.couleurTextePrefereeLocale = "black";
            }
            this.couleurFondPrefereeLocale=couleurFondPreferee;}
      );
     }
  
  

  ngOnInit(): void {
   
  }

}
