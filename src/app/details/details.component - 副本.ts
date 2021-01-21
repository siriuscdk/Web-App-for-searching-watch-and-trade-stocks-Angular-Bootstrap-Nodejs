import { Component, OnInit,ViewChild, ElementRef   } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {formatDate } from '@angular/common';
import { interval } from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators";
import vbp from "highcharts/indicators/volume-by-price";

IndicatorsCore(Highcharts);

vbp(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  ticker=this._activatedRoute.snapshot.paramMap.get('ticker');
  updown;

  symbol;
  companyname;
  tradingExchange;
  lastprice;
  change;
  perchange;
  perchangech;
  cur;
  difftime;
  time;
  reqtime;
  day;
  marketstart;
  marketend;
  marketendstr;
  marketopen;
  
  color="red";

  respcompany;
  respprice;
  dailyprice=[];
  dailypricearray=[];
  
  histdata=[];
  ohlc=[];
  histvol=[];
  reqdate;
  //dailytime=[];
  
  newsdata;

  isValid=true;
  isLoading=true;
  starempty=true;
  addalert=false;
  removealert=false;

  constructor(
  private _activatedRoute:ActivatedRoute,
  private http: HttpClient
  ) {}
  


	ngOnInit() {
	this._activatedRoute.params.subscribe(params => {
	  //console.log('that kind of madness can\'t be undone');
	  console.log(params['ticker']); // checking result

    this.isLoading=true;
	this.ticker=params['ticker'];

    // get time
    this.updatetime();
	


    // send first req
	  this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/company/'+this.ticker).subscribe(comdata => {
    this.respcompany=comdata;
    console.log(this.respcompany);
    if (this.respcompany.detail!="Not found."){
      console.log("Good");
    }
    else{
      this.isValid=false;
    }
    this.symbol=this.respcompany.ticker;
    this.companyname=this.respcompany.name;
    this.tradingExchange=this.respcompany.exchangeCode;
	  })
	  

    // send second req
	  this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/price/'+this.ticker).subscribe(data => {
    this.respprice=data[0];
    this.updateprice();
	  })

	 // send hist chart req
	this.reqdate=new Date();
	this.reqdate.setFullYear(this.reqdate.getFullYear() -2);
	this.reqdate=this.reqdate.toLocaleString('en-GB');
	this.reqdate=this.reqdate.substring(6,10)+'-'+this.reqdate.substring(3,5)+'-'+this.reqdate.substring(0,2);
	//console.log(this.reqdate);

	this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/histprice/'+this.ticker+'/'+this.reqdate).subscribe(data => {
	this.histdata=data;
	//console.log(this.histdata);
	  })

    // send day price chart req
    
    this.time=this.cur.toLocaleString('en-GB');
    this.time=this.time.substring(6,10)+'-'+this.time.substring(3,5)+'-'+this.time.substring(0,2);

    if (this.marketopen){
      this.reqtime=this.time;
    }
    else{
      this.reqtime=this.marketendstr.substring(0,10);
    }
    //console.log(this.reqtime);
	  this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/dailyprice/'+this.ticker+'/'+this.reqtime).subscribe(data => {
    this.dailyprice=data;
    //console.log(this.dailyprice);
	
	  })

    // send news req
	  this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/news/'+this.ticker).subscribe(data => {

		this.newsdata=data.articles;
		//console.log("news data:",this.newsdata);
	  })
	  
    //this.isloading=false;
    setTimeout(() => { // here
        this.isLoading = false;
		this.checkticker();
		this.updatedailyChart();
		this.updatehistChart();
      }, 3000);


	interval(15*10000000)
	.pipe(
		mergeMap(()=>this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/price/'+this.ticker))
	)
	.subscribe(data=>{
		this.respprice=data[0];
		this.updatetime();
		 this.updateprice();
	})
	
	})
  }
  
   chartOptions: Options = {
    title:{
      text:this.ticker.toUpperCase()
    },
    navigator: {
      enabled: true,
      series: {
        type:"area",
        fillColor: this.color,
      }
    },
    rangeSelector: {
      inputEnabled: false,
      buttonTheme: {
          visibility: 'hidden'
      },
      labelStyle: {
          visibility: 'hidden'
      }
    },
    series: [
      {
        name: this.ticker,
        type: 'line',
        data: this.dailypricearray,
      }
    ]
  };
  
  chartCallback: Highcharts.ChartCallbackFunction = function (chart): void {
	  setTimeout(() => {
	   chart.reflow();
	  },0);
	};
  
	histchart: Options = {
	title:{
	  text:this.ticker.toUpperCase()+' Historical'
	},

	subtitle: {
		text: 'With SMA and Volume by Price technical indicators'
	},

	navigator: {
	  enabled: true,
	  series: {
		type:"area",
	  }
	},
	rangeSelector: {
		selected: 2
	},

			yAxis: [{
			startOnTick: false,
			endOnTick: false,
			labels: {
				align: 'right',
				x: -3
			},
			title: {
				text: 'OHLC'
			},
			height: '60%',
			lineWidth: 2,
			resize: {
				enabled: true
			}
		}, {
			labels: {
				align: 'right',
				x: -3
			},
			title: {
				text: 'Volume'
			},
			top: '65%',
			height: '35%',
			offset: 0,
			lineWidth: 2
		}],


	tooltip: {
		split: true
	},
		
	series: [{
		type: 'candlestick',
		name: 'AAPL',
		id: 'aapl',
		zIndex: 2,
		data: this.ohlc,
	}, {
		type: 'column',
		name: 'Volume',
		id: 'volume',
		data: this.histvol,
		yAxis: 1
	}, {
		type: 'vbp',
		linkedTo: 'aapl',
		params: {
			volumeSeriesID: 'volume'
		},
		dataLabels: {
			enabled: false
		},
		zoneLines: {
			enabled: false
		}
	}, {
		type: 'sma',
		linkedTo: 'aapl',
		zIndex: 1,
		marker: {
			enabled: false
		}
	}]
	};


  updatetime(){
      this.cur=new Date();
      
    //this.difftime=this.cur.getTimezoneOffset().toString();
    //this.time=formatDate(this.cur, 'yyyy-MM-dd h:mm:ss a', 'en-GB');
    //this.time=this.cur.toLocaleString('en-GB');
    //console.log(this.time);
    //this.time=this.time.substring(6,10)+'-'+this.time.substring(3,5)+'-'+this.time.substring(0,2)+this.time.substring(11,);
    this.day=this.cur.getDay();

    this.marketstart = new Date();
    this.marketstart.setHours(6,30,0);
    this.marketend = new Date();
    this.marketend.setHours(13,0,0);

    //this.marketendstr=this.marketend.toLocaleString('en-GB');
    //this.marketendstr=formatDate(this.marketend, 'yyyy-MM-dd h:mm:ss a', 'en-US');
    //this.marketendstr=this.marketendstr.substring(6,10)+'-'+this.marketendstr.substring(3,5)+'-'+this.marketendstr.substring(0,2)+this.marketendstr.substring(11,);

    if (this.day>=1 && this.day<=5 && this.cur>=this.marketstart && this.cur<this.marketend){
      this.marketopen=true;
    }
    else{
		if (this.marketend.getDay()==6){
		this.marketend.setDate(this.marketend.getDate()-1);
		}
		else if (this.marketend.getDay()==0){
		this.marketend.setDate(this.marketend.getDate()-2);
		}
		this.marketendstr=this.marketend.toLocaleString('en-GB');
		this.marketendstr=this.marketendstr.substring(6,10)+'-'+this.marketendstr.substring(3,5)+'-'+this.marketendstr.substring(0,2)+this.marketendstr.substring(11,);

		this.marketopen=false;
		}
  }

  updateprice(){
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
  
  }
  

  
  updatedailyChart() {
	  console.log("update small chart")
	for (var i=0;i<this.dailyprice.length;i++){
		this.dailypricearray.push([]);
		//let timestamp=this.dailyprice[i].date;
		//timestamp=timestamp.substring(0,10)+" "+timestamp.substring(11,19);
		//console.log(timestamp);
		this.dailypricearray[i].push(Date.parse(this.dailyprice[i].date)-25200000);
		this.dailypricearray[i].push(this.dailyprice[i].close);
	} 
	//console.log(this.chartOptions.series)
	
    this.chartOptions.series = [
      {
        name: this.ticker,
        type: 'line',
        data: this.dailypricearray,
        color: this.color
      }
    ];
    this.chartOptions.navigator.series = {
      type:"area",
      fillColor: this.color
    };
  }
  
   updatehistChart() {
	console.log("update big chart");
	for (var i=0;i<this.histdata.length;i++){

        this.ohlc.push([
            new Date(this.histdata[i].date.substring(0,10)).getTime(), // the date
            this.histdata[i].open, // open
            this.histdata[i].high, // high
            this.histdata[i].low, // low
            this.histdata[i].close // close
        ]);

        this.histvol.push([
            new Date(this.histdata[i].date.substring(0,10)).getTime(), // the date
            this.histdata[i].volume // the volume
        ]);
	}
	
	//console.log(this.histchart.series)
	//console.log(this.histdata)
	//console.log(this.ohlc)
    this.histchart.series = [{
		type: 'candlestick',
		name: 'AAPL',
		id: 'aapl',
		zIndex: 2,
		data: this.ohlc,
	}, {
		type: 'column',
		name: 'Volume',
		id: 'volume',
		data: this.histvol,
		yAxis: 1
	}, {
		type: 'vbp',
		linkedTo: 'aapl',
		params: {
			volumeSeriesID: 'volume'
		},
		dataLabels: {
			enabled: false
		},
		zoneLines: {
			enabled: false
		}
	}, {
		type: 'sma',
		linkedTo: 'aapl',
		zIndex: 1,
		marker: {
			enabled: false
		}
	}]
  }
  
  
  onClickEmpty(){
	  this.starempty=false;
	  this.addalert=true;
	  let data = JSON.parse(localStorage.getItem("storetickers"));
	  
	  if (data==null){
		  data=[];
	  }
	  data.push({"ticker": this.symbol, "companyname": this.companyname});
	  localStorage.setItem("storetickers", JSON.stringify(data));
	  	 console.log('Add to localstorage:',data);

    setTimeout(() => { // here
        this.addalert = false;
      }, 2000);

  }
  
    onClickFill(){
	  this.starempty=true;
	  this.removealert=true;
	  
	  let data = JSON.parse(localStorage.getItem("storetickers"));
	  console.log('Get localstorage:',data);
	  
	  data=data.filter(s=>s.ticker!==this.symbol);
	  localStorage.setItem("storetickers", JSON.stringify(data));
	  console.log('Removed:',data);
	  
    setTimeout(() => { // here
        this.removealert = false;
      }, 2000);
	  
  }
  
  	// check if cur ticker exist in localstorage
	checkticker(){
		let storagedata = JSON.parse(localStorage.getItem("storetickers"));
		
		console.log('Localstorage:', storagedata);
		if (storagedata!=null){
			if (storagedata.filter(s => s.ticker === this.symbol).length > 0) {
				console.log('In localstorage');
				this.starempty=false;
			}
			else{
				console.log('Not in localstorage', this.symbol);
				this.starempty=true;
			}
		}
	}
	
	clickBuy(){
		
	}
  

}
