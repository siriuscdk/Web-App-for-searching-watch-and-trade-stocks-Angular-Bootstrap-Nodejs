import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HighchartsChartModule } from 'highcharts-angular';

import { SearchboxComponent } from './searchbox/searchbox.component';
import { WatchllistComponent } from './watchllist/watchllist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { NewspanelComponent } from './newspanel/newspanel.component'

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BuybuttonComponent } from './buybutton/buybutton.component';
import { SellbuttonComponent } from './sellbutton/sellbutton.component';


@NgModule({
  declarations: [
    AppComponent,
    DetailsComponent,
    HeaderComponent,
    FooterComponent,
    SearchboxComponent,
    WatchllistComponent,
    PortfolioComponent,
    NewspanelComponent,
    BuybuttonComponent,
    SellbuttonComponent,
  ],
  imports: [
      AppRoutingModule,
	    RouterModule,
      BrowserModule,
	    HttpClientModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,

    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,

    NgbModule,

    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
