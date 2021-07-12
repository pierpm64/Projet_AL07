import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';
import { GetStationService } from '../common/service/get-station.service';
import { GetPlannedTimeService } from '../common/service/get-planned-time.service';
import { GetRealTimeService } from '../common/service/get-real-time.service';
import { getGenericresponse } from '../common/data/getGenericresponse';
import { favoris } from '../common/service/favoris.service';
import { connectedUserService } from '../common/service/connected-user.service';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-horaires',
  templateUrl: './horaires.component.html',
  styleUrls: ['./horaires.component.scss']
})
export class HorairesComponent implements OnInit {

  private station: string;

  private stationInfo : object;
  public codeStation: String;
  public ReqParm: String;
  public libelStation: String;
  public Selectedligne: String;
  public SelectedDate: String;
  public lstLignes: Array<String>;

  private datCur : Date = new Date();

  public lstDate : Array<Object>;

  public lstTrajets : Array<Object>;

  public lstPlannedTime : Object = null;
  public ResultSize : Number = 0;
  

  private curDateSel : String = null;
  private curStationSel : String = null;

  public tstResult : String = '0';

  private NumberDaysList : Number = 5;

  public userConnected : Object = null;

  public isFavorite : Object = null;

  public DateFavorite : String = null;

  public LstFavorites : Object[];

 



  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private _getStation : GetStationService,
    private _getPlannedTime : GetPlannedTimeService,
    private _getRealTime : GetRealTimeService,
    private _connectedInfo : connectedUserService,
    private _favori : favoris) { }
  ;


  ngOnInit(): void {
    // Récupération parametres d'appel
    const routeParams = this.route.snapshot.paramMap;//lieu
    let lieuParm = routeParams.get('lieu');
    let lstParm = lieuParm.split('_');
    this.codeStation = lstParm[0];
    this.ReqParm = lstParm[1];
    // console.log("Station demandée : " + this.codeStation + )
    //
    registerLocaleData(localeFr, 'fr');
     // verification station passée existe
     this._getStation.getStation(this.codeStation)
     .subscribe({
       next : (response :getGenericresponse) => { 
         this.stationInfo = response[0];
         this.libelStation = this.stationInfo["libelle"];
         this.lstLignes = this.stationInfo["lignes"];
 
 
 
       },
       error : (err) => { console.log("error:"+JSON.stringify(err));
                if (err.error.message) {
                  console.log("erreur get Sation : " + err.error.message);    
                } else {
                  console.log("erreur technique sur get Station " + this.codeStation ); 
                }
                 this.router.navigate(['/allplaces']);
               }
       });
    // recuperation nombre de jours à affichier
    let numberofDays =  environment.NumberOfDay;
    if (!isNaN(numberofDays)) {
      this.NumberDaysList = numberofDays;
    }
    // Recupere email connecte
    this.userConnected = this._connectedInfo.ObjStoredEmail
   
    // check si lieuu favori pou pas ...
    if (this.userConnected != null)  {
      let usrEmail = this.userConnected["email"];
      this._favori.getfavori$(usrEmail,this.codeStation) 
      .subscribe({
        next : (response :getGenericresponse) => { 
          this.isFavorite = response[0];
          let datinfostr = this.isFavorite["date"];
          let dateInfo = Date.parse(datinfostr);
          let datForm = new Date(dateInfo);
          this.DateFavorite = formatDate(datForm,'EEEE d MMMM yyyy à HH:mm:ss', 'fr');
        },
        error : (err) => { 
          this.isFavorite = null;
        }
        });
    }

    // console.log("code station passée en parametre :" + this.codeStation )
   

      // Init liste de dates
      let datnowstr = "";
      
      let DateLSt = []
      for (let i = 0; i <  this.NumberDaysList; i++) { 
        let d = new Date(); ;
        d.setDate(d.getDate() - i);
        let todayString = d.toDateString();
        let valdats1 = formatDate(d,'yyyy-MM-dd', 'fr');
        let valdats2 = formatDate(d,'EEEE d MMMM yyyy', 'fr');
        if (i== 1) {
          datnowstr = valdats1;
        }
        
        let objDate = {
          "datCrit" : valdats1,
          "datDisp" : valdats2,
        }
        DateLSt.push(objDate);
      }

      // console.log("liste dates : " + JSON.stringify(DateLSt));
      this.lstDate = DateLSt;

      // Init liste des stations avec libellé trajet
      this._getPlannedTime.getPlannedTime(this.codeStation,datnowstr)
       .subscribe({
       next : (response :getGenericresponse) => { 
         this.lstPlannedTime = null;
        let lstresult = response;
        let lstres = [];
        for (let horaire in lstresult) {
  
          let horaireTmp = lstresult[horaire];
          // console.log("--> horaires référence : "+ JSON.stringify(horaireTmp))
  
          let destination = horaireTmp['sens1'] + " (Aller)"
          if (horaireTmp['sens'] == "2") {
              destination = horaireTmp['sens2'] + " (Retour)"
          }

          let  ligneLigne = horaireTmp['ligne'];
  
          let codeLigne =  ligneLigne + " " + horaireTmp['sens'];
          let codeNum = this.hashCode(horaireTmp['ligne'] + horaireTmp['sens']) ;
          let LibLigne =  "Ligne : "  + horaireTmp['ligne'] + " / destination : " + destination
          // console.log("sens : " + horaireTmp['sens'] + " / destination : " + destination
          let objLignes = {
            "code" : codeLigne,
            "codnum" : codeNum,
            "libel" : LibLigne
           }

           if (horaireTmp['sens'] == "1") {
              let codeLigne =  ligneLigne;
              let codeNum = this.hashCode(horaireTmp['ligne'] + "0") ;
              let LibLigne =  "Ligne : "  + horaireTmp['ligne'] + " / destination : *  (les deux sens)"
              let objLignesAllWay = {
                "code" : codeLigne,
                "codnum" : codeNum,
                "libel" : LibLigne
               }
               lstres.push(objLignesAllWay);
           } 
  
          lstres.push(objLignes);
         }

         lstres.sort(function(a, b) {
          return a.codnum - b.codnum;
        }); 
  
        this.lstTrajets = lstres;

        // console.log("--> horaires référence pour selection : "+ JSON.stringify( this.lstTrajets))
  
  
  
       },
      error : (err) => { console.log("error:"+JSON.stringify(err));
              if (err.error.message) {
                console.log("erreur get PlannedTime  : " + err.error.message);    
              } else {
                 console.log("erreur technique sur get Planned Time " + this.codeStation + " / date : " + datnowstr); 
               }
               }
       });
       
  };

  AddFavorite() {
    let usrEmail = this.userConnected["email"];
      this._favori.addfavori$(usrEmail,this.codeStation) 
      .subscribe({
        next : (response :getGenericresponse) => { 
          this.isFavorite = response;
          let datinfostr = this.isFavorite["date"];
          let dateInfo = Date.parse(datinfostr);
          let datForm = new Date(dateInfo);
           this.DateFavorite = formatDate(datForm,'EEEE d MMMM yyyy à HH:mm:ss', 'fr');
        },
        error : (err) => { 
          this.isFavorite = null;
        }
        });
  }

  RemoveFavorite() {
    let usrEmail = this.userConnected["email"];
      this._favori.Delfavori$(usrEmail,this.codeStation) 
      .subscribe({
        next : (response :getGenericresponse) => { 
          this.isFavorite = null;
        },
        error : (err) => { 
        }
        });
  

  }

  hashCode(s:string) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
  };

  // on traite la selection de date ...
  onChange(v:any) {
    // console.log("date selectionnée : " + v)!;
    this.curDateSel = v;

    if (this.curDateSel !== null && this.curStationSel !== null )  {
      this.refreshData(this.curDateSel,this.curStationSel );
    }
    
  };

   // on traite la selection du trajet ...
   onTrajetChange(v:any) {
    // console.log("ligne selectionnée : " + v)!;
    this.curStationSel = v;

    if (this.curDateSel !== null && this.curStationSel !== null )  {
      this.refreshData(this.curDateSel,this.curStationSel );
    }

    
  };

  // function de refresh automatique
  refreshData(dateSel:String,TrajetSel:String) {
    let parSplit = TrajetSel.split(" ");
    let parLigne = parSplit[0];
    let parsens = parSplit[1];

    this._getPlannedTime.getPlannedTime(this.codeStation,dateSel,parLigne,parsens)
    .subscribe({
      next : (response :getGenericresponse) => { 
        this.lstPlannedTime = null;
        let lstresult = response;
        // console.log("lst Horaires : " + JSON.stringify(lstresult));
        let lstres = [];
        for (let horaire in lstresult) {

          let horaireTmp = lstresult[horaire];

          let cursens = horaireTmp['sens'];
          let destination = horaireTmp['sens1'] + " (Aller)"
          if (cursens == "2") {
            destination = horaireTmp['sens2'] + " (Retour)"
          }

          let ligne =  horaireTmp['ligne'];
          // console.log("send : " + horaireTmp['sens'] + " / destination : " + destination)
          
         let objres = {
            "destination" :  destination,
            "ligne" : ligne
          };

          let strHoraire = lstresult[horaire];
          // console.log("horaire : " + JSON.stringify(strHoraire));
          let objDetails = strHoraire.horaires;
          let lstdetres = [];
          for (let hor2 in objDetails) {

            // Appel getRealTime
            this.getRealTIme(dateSel,ligne,cursens,hor2);

            if (Number(hor2) < 5) {
              continue;
            }

            // Formatage
            let codeNum = this.hashCode(hor2) ;
            let objheure = {
              "heure" : hor2,
              "plannedTime" : objDetails[hor2],
              "realTime" : "no Data",
              "heureHash" : codeNum
            }

            // Appel real time pour completer
            this._getRealTime.getRealTime(this.codeStation,dateSel,ligne,cursens,hor2)
            .subscribe({
              next : (response :getGenericresponse) => { 
                let lstresult = response;
                let objres = response[0];
                // console.log("output of getRealTime : " + JSON.stringify(objres) );
                objheure["realTime"] = objres["horaires"];
              },
              error : (err) => { console.log("error:"+JSON.stringify(err));
              if (err.error.message) {
                console.log("erreur get RealTime  : " + err.error.message);    
              } else {
                console.log("erreur technique sur get  RealTime"); 
              }
             }
              
            })
            // console.log(hor2 + ' / ' + objDetails[hor2] )
            lstdetres.push(objheure);
          }
          // Si pas d'horaire trouvé, on va à l'enregistement trouvé
          if (lstdetres.length == 0) {
            continue
          }
          // On trie la lliste
          lstdetres.sort(function(a, b) {
            return a.heureHash - b.heureHash;
          }); 
          //
          objres["horaires"] = lstdetres;


          lstres.push(objres);
        }

        // console.log("horaires reformatés : " + JSON.stringify(lstres));
        this.lstPlannedTime = lstres;

        this.ResultSize = lstres.length;
        if (  lstres.length == 0) {
          this.lstPlannedTime = undefined;
        }
        this.tstResult = lstres.length.toString();
        console.log("valeut tstResult : "+ this.tstResult)




      },
      error : (err) => { console.log("error:"+JSON.stringify(err));
               if (err.error.message) {
                 console.log("erreur get PlannedTime  : " + err.error.message);    
               } else {
                 console.log("erreur technique sur get Planned Time " + this.codeStation + " / date : " + dateSel); 
               }
              }
      });
  };

   getRealTIme(dateSel:String,parLigne:String,parsens:String,parheure:string) {
    this._getRealTime.getRealTime(this.codeStation,dateSel,parLigne,parsens,parheure)
    .subscribe({
      next : (response :getGenericresponse) => { 
        let lstresult = response;
        console.log("output of getRealTime : " + JSON.stringify(lstresult) );
      },
      error : (err) => { console.log("error:"+JSON.stringify(err));
      if (err.error.message) {
        console.log("erreur get RealTime  : " + err.error.message);    
      } else {
        console.log("erreur technique sur get Planned RealTime"); 
      }
     }
      
    })

  }




}
