import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith,switchMap, debounceTime, tap, finalize} from 'rxjs/operators';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {
	ticker;
  autocominfo;
  myControl = new FormControl();
  isLoading = false;
  response=[];
  options=[];
  names=[];
  name;
  symbol;

  constructor(
  private http: HttpClient, 
	private _router: Router
	) { }

  ngOnInit(): void {
  }


  oninput(){
    console.log("the input :" + this.ticker);
    this.isLoading=true;
    this.options=[];
    this.names=[];

    this.http.get<any>('https://siriusangularnojsapp.wl.r.appspot.com/autocomplete/'+this.ticker).subscribe(data => {
        //console.log(JSON.stringify(data));
        this.response = data;
        //console.log(this.response);
        var i;
        for (i=0;i<this.response.length;i++){
          this.name=this.response[i].name;
          this.symbol=this.response[i].ticker;
          this.options.push(this.symbol);
          this.names.push(this.name);
        }
        this.isLoading=false;
        })
  }

	
  onSubmit(){
	  console.log("the code :" + this.ticker);
	  if(this.ticker != undefined){
	  this._router.navigate(['/details', this.ticker]);
	  }
  }

}
