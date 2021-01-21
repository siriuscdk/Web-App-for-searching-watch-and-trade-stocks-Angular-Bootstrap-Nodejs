import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchllist',
  templateUrl: './watchllist.component.html',
  styleUrls: ['./watchllist.component.css']
})
export class WatchllistComponent implements OnInit {
    storetickers = [];
    isLoading=true;
    infotickers=[];
	
	alltickers=[];
	alltickersstr;
	response;
	
	curticker;
	curcompanyname
	respprice;
	lastprice
	change;
	perchange;
	perchangech;
	color;
	updown;
	
	isempty=false;

  constructor(  private http: HttpClient,private _router: Router) { }

  ngOnInit(): void {
	  this.alltickers=[];
	  this.alltickersstr='';
	  
  	 this.storetickers=JSON.parse(localStorage.getItem("storetickers"));
	  console.log('Get localstorage:',this.storetickers);
	  
	  if ( this.storetickers==null || this.storetickers.length==0){
		  this.isempty=true;
	  }
	  else{
		  this.isempty=false;
	  
	  
		  this.storetickers.sort((a,b) => (a.ticker > b.ticker) ? 1 : ((b.ticker > a.ticker) ? -1 : 0)); 
		  
		  
		  for (var i=0;i<this.storetickers.length;i++){
			  this.alltickers.push(this.storetickers[i].ticker)
		  }
		  console.log('All tickers array:',this.alltickers);
		  this.alltickersstr=this.alltickers.join();
		  console.log('All tickers:',this.alltickersstr);
		
		  this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/price/'+this.alltickersstr).subscribe(data => {
		  this.response=data;
			this.loadlist();
		  })
	}
	  
	 
    setTimeout(() => { // here
        this.isLoading = false;
      }, 1000);

  }

  loadlist(){
	  console.log('Response:',this.response)
	  this.response.sort((a,b) => (a.ticker > b.ticker) ? 1 : ((b.ticker > a.ticker) ? -1 : 0)); 
	  console.log('Response:',this.response)
	  
	  
		this.infotickers=[];
		for (var i=0;i<this.storetickers.length;i++){
		   this.curticker=this.storetickers[i].ticker;
		  this.curcompanyname=this.storetickers[i].companyname;
		  
			this.lastprice=this.response[i].last;
			this.lastprice=this.lastprice.toFixed(2);
			this.change=this.response[i].last-this.response[i].prevClose;
			this.change=this.change.toFixed(2);
			this.perchange=this.change*1.0/this.response[i].prevClose;
			this.perchange=(this.perchange*100).toFixed(2);
			this.perchangech=this.perchange+"%";
			//console.log(this.response[i]);
			if (this.change>=0){
				this.color="green";
			  this.updown=true;
			}
			else{
				this.color="red";
			  this.updown=false;
			}
		
			this.infotickers.push({"ticker": this.curticker,
							 "companyname": this.curcompanyname,
							 "last":this.lastprice,
							 "change":this.change,
							 "perchangech":this.perchangech,
							 "color":this.color,
							 "updown":this.updown})


		}
		console.log('watch-infotickers:',this.infotickers)
  }

  onDelete(infoticker){
    this.infotickers=this.infotickers.filter(s=>s.ticker!==infoticker.ticker);

    this.storetickers=this.storetickers.filter(s=>s.ticker!==infoticker.ticker);
    //then delete in local storage
    localStorage.setItem("storetickers", JSON.stringify(this.storetickers));

    //let data=JSON.parse(localStorage.getItem("storetickers"));
	  //console.log('Delete from localstorage:',data);
	  
	  if (this.storetickers.length==0){
		  this.isempty=true;
	  }
	  else{
		  this.isempty=false;
	  }
  }
  
  onClick(infoticker){
	  console.log("the code :" + infoticker.ticker);
	  if(infoticker.ticker != undefined){
	  this._router.navigate(['/details', infoticker.ticker]);
	  }

  }

}
