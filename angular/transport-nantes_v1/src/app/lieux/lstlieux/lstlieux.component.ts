import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router} from '@angular/router';
import { GetLstLieuxService } from '../../common/service/getlstlieux.service';
import { lstlieuxresponse } from '../../common/data/lstlieuxresponse ';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ngbd-modal-options',
  templateUrl: './lstlieux.component.html',
  styleUrls: ['./lstlieux.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]
})
export class LstlieuxComponent implements OnInit {

  closeResult: string;

  public imgServer : String = environment.imgServer;

  public lstAllLieux : lstlieuxresponse = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private _getLstLieux :GetLstLieuxService,
    private location: Location ) { }

  ngOnInit(): void {
    this.location.replaceState('/');
    // recuperation liste des lieux en base
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

  openGoogleLink(latitude:number,longitude) {
    let url = "http://www.google.com/maps/place/"+latitude+","+longitude+"/@/Lieu,17z/data=!3m1!1e3"
    this.router.navigateByUrl(url);

  }


}