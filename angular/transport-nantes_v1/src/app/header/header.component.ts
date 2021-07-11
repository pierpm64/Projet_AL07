import { Component, Input, OnInit } from '@angular/core';
import { MenuDefinition } from 'src/bs-util/data/MenuDefinition';
import { PreferencesService } from '../common/service/preferences.service';
import { connectedUserService } from '../common/service/connected-user.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DatePipe]
})
export class HeaderComponent implements OnInit {

  @Input()
  public titre :string ="default-title";

  public couleurFondPrefereeLocale : string = "green";
  public couleurTextePrefereeLocale : string = "white";

  public UserConnectedLocal : string = null;

  public envBld : string = environment.libEnv;
  public dateHeureBld : string = environment.timeStamp;

  private curEmail : String = null;
  private isAdm : boolean = false;


  
  
  private myMenuDefault : MenuDefinition[] = [
    { label : "Fichier" , 
      children : [
        { label : "Login" , path : "/login" } ,
        { label : "Accueil" , path : "/welcome" },
        { divider : true },
        { label : "Liste Lieux" , path : "/allplaces" }
      ]
    },
    ];

  



  public myMenuDef : MenuDefinition[] = [
    { label : "Fichier" , 
      children : [
        { label : "Login" , path : "/login" } ,
        { label : "Accueil" , path : "/welcome" },
        { divider : true },
        { label : "Liste Lieux" , path : "/allplaces" }
      ]
    },
    ];

 
    constructor(private _preferencesService : PreferencesService,
                private _connectUserService : connectedUserService,
                private datePipe: DatePipe) 
      {


      
      //this.dateHeureBld = this.datePipe.transform(this.dateBld,"yyyy/MM/dd HH:mm:ss");
      // console.log('DateBld : ' + this.dateBld + " / " + this.dateHeureBld )
      //synchronisation de la "copie locale" :
      this._preferencesService.couleurFondPrefereeObservable
      .subscribe(
        //callback éventuellement re-déclenchée plusieurs fois :
        (couleurFondPreferee)=>{
            console.log("nouvelle couleurFondPreferee="+couleurFondPreferee)
            switch (couleurFondPreferee) {
              case "LimeGreen" : this.couleurTextePrefereeLocale = "Midnightblue";break;
              default : this.couleurTextePrefereeLocale = "white";
            }


            this.couleurFondPrefereeLocale=couleurFondPreferee;
        }
      );

      this._connectUserService.getConnectedUserObservable
      .subscribe(
        //callback éventuellement re-déclenchée plusieurs fois :
        (EmailConnecte)=>{
            console.log("Nouvel emailConnecté="+EmailConnecte)
            
            let objConnected = this.getConnectedUser();

            // delete  this.myMenuDef;
            this.myMenuDef = [];
            this.myMenuDef.push(this.myMenuDefault[0]);

            console.log("on passe par le refresh avec user : " + JSON.stringify(objConnected) + " - " + objConnected["email"]);
            if (objConnected["email"] !== undefined) {

              let objAdmuse = {
                label : "Utilisateur" , 
                children : [
                  { label : "Deconnexion" , path : "/Deconnexion" } ,
                  { label : "Mes Stations" , path : "/myStations" }]
              }
              console.log("on ajoute ld mennu : " + JSON.stringify(objAdmuse))
              this.myMenuDef.push(objAdmuse);
            }
            // console.log("conteu menu str  2 : " + JSON.stringify(this.myMenuDef) )
             
          
          
          }
      );




     
     }
  
  

  ngOnInit(): void {

   
  }


  getConnectedUser() : Object {
    let strLogin = sessionStorage.getItem('curUser');
    let objLogin = {};
    if (strLogin != null) {
      objLogin = JSON.parse(strLogin);
      console.log("email on header : " + objLogin["email"]  + " / isadmin : " 
      + objLogin["isAdmin"])
      this.curEmail = objLogin["email"];
      this.isAdm = objLogin["isAdmin"];


    }
    return objLogin

  }

}
