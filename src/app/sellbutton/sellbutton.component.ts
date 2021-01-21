import { Component, OnInit, Input, EventEmitter, Output   } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sellbutton',
  templateUrl: './sellbutton.component.html',
  styleUrls: ['./sellbutton.component.css']
})
export class SellbuttonComponent implements OnInit {
  @Input() stockdata;
  @Output() deleteticker: EventEmitter<any> = new EventEmitter();
  
  sellbuttondisable=true;
  sellnum;
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
	  console.log("Sell:",this.sellnum);
	  if (this.sellnum>=1 && this.sellnum<=parseFloat(this.stockdata.quantity)){
		  this.sellbuttondisable=false;
	  }
	  else{
		  this.sellbuttondisable=true;
	  }
	  this.totalprice=this.sellnum*this.stockdata.last;
	  this.totalprice=this.totalprice.toFixed(2);
  }
  
  clickSell(){
	  let data = JSON.parse(localStorage.getItem("boughttickers"));
	  
	  console.log('Get portfolio from localstorage:',data);
	  
		let boughtinstance=data.filter(s => s.ticker === this.stockdata.ticker);
		
		if (boughtinstance.length > 0) {
			boughtinstance=boughtinstance[0];
			console.log('Bought previously:',boughtinstance);
			console.log('Bought previously:',data);
			
			console.log('boughtinstance.quantity:',parseFloat(boughtinstance.quantity),parseFloat(this.sellnum));
			this.curnum=parseFloat(boughtinstance.quantity)-parseFloat(this.sellnum);
			this.curtotalprice=this.curnum*parseFloat(boughtinstance.avgcost);
			this.curavgcost=parseFloat(boughtinstance.avgcost);
			
			console.log('curtotalprice',this.curtotalprice,'curavgcost:', this.curavgcost,'curnum:',this.curnum);
			this.curtotalprice=this.curtotalprice.toFixed(2);
			this.curavgcost=this.curavgcost.toFixed(2);
			
			
			// delete from storage 
			data=data.filter(s=>s.ticker!==this.stockdata.ticker);
			if (this.curnum>0){
				// add it back
				data.push({"ticker": this.stockdata.ticker, "companyname": this.stockdata.companyname, "quantity": this.curnum, "avgcost": this.curavgcost, "totcost": this.curtotalprice});
				
				//update table
				this.stockdata.quantity= this.curnum;
				this.stockdata.avgcost= this.curavgcost;
				this.stockdata.totcost= this.curtotalprice;
				
				this.stockdata.marketval= this.curnum*this.stockdata.last;
				this.stockdata.marketval=this.stockdata.marketval.toFixed(2);
				
					// add it back to local storage
				  localStorage.setItem("boughttickers", JSON.stringify(data));
				  console.log('Bought to localstorage:',data);
			}
			else if (this.curnum==0){
				console.log("Clear this stock");
					// add it back to local storage
				  localStorage.setItem("boughttickers", JSON.stringify(data));
				  console.log('Bought to localstorage:',data);
				  
				  this.deleteticker.emit(null);
				  
				  
			}
		}
		

	  data = JSON.parse(localStorage.getItem("boughttickers"));
	  
	  console.log('Check: get portfolio from localstorage:',data);
	  
  }

}
