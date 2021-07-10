import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { GetLstLieuxService } from '../../common/service/getlstlieux.service';
import { lstlieuxresponse } from '../../common/data/lstlieuxresponse ';

@Component({
  selector: 'app-lstlieux',
  templateUrl: './lstlieux.component.html',
  styleUrls: ['./lstlieux.component.scss']
})
export class LstlieuxComponent implements OnInit {

  public lstAllLieux : lstlieuxresponse = null;

  constructor(
    private router: Router,
    private _getLstLieux :GetLstLieuxService ) { }

  ngOnInit(): void {
    this._getLstLieux.getAllLieux$()
    .subscribe({
      next : (response :lstlieuxresponse) => { 
        this.lstAllLieux = response;
            // for (let lieux in response) {
            //  console.log("detail lieu : " + JSON.stringify(response[lieux]));
            //} 
             // this.router.navigate(['/ngr-welcome']);
      },
      error : (err) => { console.log("error:"+JSON.stringify(err));
               if (err.error.message) {
                 console.log("erreur get allLieux : " + err.error.message);    
               } else {
                 console.log("erreur technique sur get allLieux"); 
               }
              }
      });
    }


}