import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { SocketService } from '../services/socket.service';
import { DataService } from '../services/data.service';
import { ApiService } from '../services/api.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TokenPriceChartComponent } from './dashboard/token-price-chart/token-price-chart.component';
import { UnitPriceChartComponent } from './dashboard/unit-price-chart/unit-price-chart.component';
import { NodesMapsComponent } from './dashboard/nodes-maps/nodes-maps.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    SearchComponent,
    PageNotFoundComponent,
    TokenPriceChartComponent,
    UnitPriceChartComponent,
    NodesMapsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    AppRoutingModule,
    FormsModule,
    LeafletModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    SocketService,
    DataService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
