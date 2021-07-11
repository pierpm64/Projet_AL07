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
  selector: 'app-favorites-lines',
  templateUrl: './favorites-lines.component.html',
  styleUrls: ['./favorites-lines.component.scss']
})
export class FavoritesLinesComponent implements OnInit {

  public userConnected : Object = null;

  public LstFavoris : Object[] = null;

  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private _getStation : GetStationService,
    private _connectedInfo : connectedUserService,
    private _favori : favoris) { }
  ;

  ngOnInit(): void {
    // Recupere email connecte
    let Objuser = this._connectedInfo.ObjStoredEmail
    if ( Objuser == null) {
      this.router.navigate(['/login']);
    }
    this.userConnected = Objuser;

    let usrEmail = this.userConnected["email"];
      this._favori.getfavori$(usrEmail) 
      .subscribe({
        next : (response :getGenericresponse) => { 
          let objresponse = response;
          registerLocaleData(localeFr, 'fr');
          let tmpLst = [];
          for ( let _i in objresponse) {
            
            let ligneReponse = objresponse[_i];
            console.log("favori : " + JSON.stringify(ligneReponse));

            let datinfostr = ligneReponse["date"];
            let dateInfo = Date.parse(datinfostr);
            let datForm = new Date(dateInfo);
            let DateFavorite = formatDate(datForm,'EEEE d MMMM yyyy à HH:mm:ss', 'fr'); 

            let objFav = {
              "station" : ligneReponse["station"],
              "datheure" : DateFavorite
            }

            this._getStation.getStation(ligneReponse["station"])
            .subscribe({
              next : (response :getGenericresponse) => { 
                let stationInfo = response[0];
                let libelStation = stationInfo["libelle"];
                let lstLignes =stationInfo["lignes"];
                objFav["libelle"] = libelStation;
                objFav["lignes"] = lstLignes;
        
        
        
              },
              error : (err) => { console.log("error:"+JSON.stringify(err));
                       if (err.error.message) {
                         console.log("erreur get Sation : " + err.error.message);    
                       } else {
                         console.log("erreur technique sur get Station " + ligneReponse["station"] ); 
                       }
                        this.router.navigate(['/allplaces']);
                      }
              }); 

            tmpLst.push(objFav);

          }
          this.LstFavoris = tmpLst;


        },
        error : (err) => { 
           }
        });
  }
  

}
