import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { AppComponent } from './app.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { WatchllistComponent } from './watchllist/watchllist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

export  const routes: Routes = [
    //{ path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: '',
      component: SearchboxComponent 
    },
    {
      path: 'details/:ticker',
      component: DetailsComponent
    },

    {
      path: 'watchlist',
      component: WatchllistComponent
    },

    {
      path: 'portfolio',
      component: PortfolioComponent
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

