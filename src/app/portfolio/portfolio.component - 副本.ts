import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
	alltickers;
	alltickersstr;
	boughttickers;
	
	response;
	infotickers=[];
	
	
	curticker;
	curcompanyname;
	lastprice;
	change;
	avgcost;
	quantity;
	marketval;
	totcost;
	
	up;
	down;
	isLoading=true;
	isempty=false;

  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit(): void {
	  this.alltickers=[];
	  this.alltickersstr='';
	  
	 this.boughttickers=JSON.parse(localStorage.getItem("boughttickers"));
	 console.log('Get localstorage:',this.boughttickers);
		 
	  if (this.boughttickers.length==0 || this.boughttickers==null){
		  this.isempty=true;
	  }
	  else{
		  this.isempty=false;
	  }
	  
	  this.boughttickers.sort((a,b) => (a.ticker > b.ticker) ? 1 : ((b.ticker > a.ticker) ? -1 : 0)); 
	  
	  for (var i=0;i<this.boughttickers.length;i++){
		  this.alltickers.push(this.boughttickers[i].ticker)
	  }
	  
	  console.log('All tickers array:',this.alltickers);
	  this.alltickersstr=this.alltickers.join();
	  console.log('All tickers:',this.alltickersstr);
	  
	  this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/price/'+this.alltickersstr).subscribe(data => {
      this.response=data;
       this.loadlist();
	  })
	  
		setTimeout(() => { // here
			this.isLoading = false;
		  }, 1000);
  }
  
  loadlist(){
	  console.log('Response:',this.response)
	  this.response.sort((a,b) => (a.ticker > b.ticker) ? 1 : ((b.ticker > a.ticker) ? -1 : 0)); 
	  console.log('Response:',this.response)
	  
	  this.infotickers=[];
	  for (var i=0;i<this.boughttickers.length;i++){
		   this.curticker=this.boughttickers[i].ticker;
		  this.curcompanyname=this.boughttickers[i].companyname;
		  
			this.lastprice=this.response[i].last;
			this.lastprice=this.lastprice.toFixed(2);
			
			this.avgcost=parseFloat(this.boughttickers[i].avgcost);
			this.quantity=parseFloat(this.boughttickers[i].quantity);
			this.marketval=this.quantity*this.lastprice;
			this.marketval=this.marketval.toFixed(2);
			this.totcost=parseFloat(this.boughttickers[i].totcost);
			this.totcost=this.totcost.toFixed(2);
			
			this.change=this.response[i].last-this.avgcost;
			this.change=this.change.toFixed(2);
			
			if (this.change>0){
				//this.color="green";
			  this.up=true;
			  this.down=false;
			}
			else if (this.change<0){
				//this.color="red";
			  this.up=false;
			  this.down=true;
			}
			else{
			  this.up=false;
			  this.down=false;
			}
			
			this.infotickers.push({"ticker": this.curticker,
							 "companyname": this.curcompanyname,
							 "quantity":this.quantity.toString(),
							 "avgcost": this.avgcost.toString(),
							 "totcost": this.totcost.toString(),
							 "last":this.lastprice,
							 "change":this.change.toString(),
							 "marketval":this.marketval.toString(),
							 "up":this.up,
							 "down":this.down
							 })
			
			
	  }
	  console.log('infotickers:',this.infotickers)
  }
  
    onClick(infoticker){
	  console.log("the code :" + infoticker.ticker);
	  if(infoticker.ticker != undefined){
	  this._router.navigate(['/details', infoticker.ticker]);
	  }

  }

}
