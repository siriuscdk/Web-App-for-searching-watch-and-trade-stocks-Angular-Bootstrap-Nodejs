import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-buybutton',
  templateUrl: './buybutton.component.html',
  styleUrls: ['./buybutton.component.css']
})
export class BuybuttonComponent implements OnInit {
  @Input() stockdata;
  
  buybuttondisable=true;
  boughtnum;
  totalprice;
  
  curnum;
  curtotalprice;
  curavgcost;
  
  myControl = new FormControl();
  closeResult: string;
	
	
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
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
  
  oninput(){
	  console.log("Buy:",this.boughtnum);
	  if (this.boughtnum>=1){
		  this.buybuttondisable=false;
	  }
	  else{
		  this.buybuttondisable=true;
	  }
	  this.totalprice=this.boughtnum*this.stockdata.last;
	  this.totalprice=this.totalprice.toFixed(2);
  }
  
  clickBuy(){
	  let data = JSON.parse(localStorage.getItem("boughttickers"));
	  
	  console.log('Get portfolio from localstorage:',data);
	  
		let boughtinstance=data.filter(s => s.ticker === this.stockdata.ticker);
		
		if (boughtinstance.length > 0) {
			boughtinstance=boughtinstance[0];
			console.log('Bought previously:',boughtinstance);
			console.log('Bought previously:',data);
			
			
			this.curnum=parseFloat(this.boughtnum)+parseFloat(boughtinstance.quantity);
			this.curtotalprice=parseFloat(this.totalprice)+parseFloat(boughtinstance.totcost);
			this.curavgcost=this.curtotalprice/this.curnum;
			
			console.log('curtotalprice',this.curtotalprice,'curavgcost:', this.curavgcost,'curnum:',this.curnum);
			this.curtotalprice=this.curtotalprice.toFixed(2);
			this.curavgcost=this.curavgcost.toFixed(2);
			
			
			// delete from storage 
			data=data.filter(s=>s.ticker!==this.stockdata.ticker);
			// add it back
			data.push({"ticker": this.stockdata.ticker, "companyname": this.stockdata.companyname, "quantity": this.curnum, "avgcost": this.curavgcost, "totcost": this.curtotalprice});
			
			//update table
			this.stockdata.quantity= this.curnum;
			this.stockdata.avgcost= this.curavgcost;
			this.stockdata.totcost= this.curtotalprice;
			
			this.stockdata.change=this.stockdata.last-this.curavgcost;
			this.stockdata.change=this.stockdata.change.toFixed(2);
			
			if (this.stockdata.change>0){
				//this.color="green";
			  this.stockdata.up=true;
			  this.stockdata.down=false;
			}
			else if (this.stockdata.change<0){
				//this.color="red";
			  this.stockdata.up=false;
			  this.stockdata.down=true;
			}
			else{
			  this.stockdata.up=false;
			  this.stockdata.down=false;
			}
			
			this.stockdata.marketval= this.curnum*this.stockdata.last;
			this.stockdata.marketval=this.stockdata.marketval.toFixed(2);
			
			
		}
		
	  localStorage.setItem("boughttickers", JSON.stringify(data));
	  console.log('Bought to localstorage:',data);
	  data = JSON.parse(localStorage.getItem("boughttickers"));
	  
	  console.log('Check: get portfolio from localstorage:',data);

	  
  }

}
