import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-watchllist',
  templateUrl: './watchllist.component.html',
  styleUrls: ['./watchllist.component.css']
})
export class WatchllistComponent implements OnInit {
    storetickers = [];
    isLoading=true;
    infotickers=[];
	curticker;
	curcompanyname
	respprice;
	lastprice
	change;
	perchange;
	perchangech;
	color;
	updown;

  constructor(  private http: HttpClient) { }

  ngOnInit(): void {
  	 this.storetickers=JSON.parse(localStorage.getItem("storetickers"));
	  console.log('Get localstorage:',this.storetickers);
	
	
    console.log('Start loading localstorage:',this.storetickers);
    this.infotickers=[];
    for (var i=0;i<this.storetickers.length;i++){
       this.curticker=this.storetickers[i].ticker;
      this.curcompanyname=this.storetickers[i].companyname;

      this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/price/'+this.curticker).subscribe(data => {
      this.respprice=data[0];
      //console.log(this.respprice);
		this.lastprice=this.respprice.last;
		this.change=this.respprice.last-this.respprice.prevClose;
		this.change=this.change.toFixed(2);
		this.perchange=this.change*1.0/this.respprice.prevClose;
		this.perchange=(this.perchange*100).toFixed(2);
		this.perchangech=this.perchange+"%";
		//console.log(this.respprice);
		if (this.change>=0){
			this.color="green";
		  this.updown=true;
		}
		else{
			this.color="red";
		  this.updown=false;
		}
	
	  
	  })
	  
		this.infotickers.push({"ticker": this.storetickers[i].ticker,
						 "companyname": this.storetickers[i].companyname,
						 "last":this.lastprice,
						 "change":this.change,
						 "perchangech":this.perchangech,
						 "color":this.color,
						 "updown":this.updown})


    }
	
	 console.log(this.infotickers);
	



    setTimeout(() => { // here
        this.isLoading = false;
        this.loadlist();
      }, 1000);

  }

  loadlist(){
  }

  onDelete(infoticker){
    this.infotickers=this.infotickers.filter(s=>s.ticker!==infoticker.ticker);

    this.storetickers=this.storetickers.filter(s=>s.ticker!==infoticker.ticker);
    //then delete in local storage
    localStorage.setItem("storetickers", JSON.stringify(this.storetickers));

    //let data=JSON.parse(localStorage.getItem("storetickers"));
	  //console.log('Delete from localstorage:',data);
  }

}
