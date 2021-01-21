import { Component, OnInit, Input } from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-newspanel',
  templateUrl: './newspanel.component.html',
  styleUrls: ['./newspanel.component.css']
})
export class NewspanelComponent implements OnInit {
  @Input() data;
  showup=[];
  imgsrc=[];
  title=[];

  fblink=[];
  twlink=[];
  Publisher=[];
  Pubdate=[];
  description=[];
  link=[];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  sidx;

  //link0="<a href="+"http://www.google.com"+">here</a>";
  
  closeResult: string;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {

   for (var i=0;i<20;i++){
    this.showup.push(false);
   }

   this.sidx=0;
   for (var i=0;i<this.data.length;i++){
      if (this.data[i].urlToImage!=null && this.data[i].title!=null && this.data[i].title && this.data[i].urlToImage ){
        this.imgsrc.push(this.data[i].urlToImage);
        this.title.push(this.data[i].title);
        this.Publisher.push(this.data[i].author);
        let time=this.data[i].publishedAt.substring(0,10);
        time=new Date(time);
        time=this.months[time.getMonth()] + ' ' + time.getDate() + ',  ' + time.getFullYear();
        this.Pubdate.push(time);
        this.description.push(this.data[i].description);
        this.link.push("<a href="+this.data[i].url+" target='_blank'>here</a>");
        this.twlink.push("https://twitter.com/intent/tweet?text="+encodeURIComponent( this.data[i].title.trim())+'%20'+this.data[i].url);
        this.fblink.push("https://www.facebook.com/sharer/sharer.php?u="+this.data[i].url);
        this.showup[this.sidx]=true;
        this.sidx+=1;
      }
   }
  }

    open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
