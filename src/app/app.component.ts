import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/pairwise';
import { NotificationsService } from 'angular2-notifications';

import { SocketService } from '../services/socket.service';
import { DataService } from '../services/data.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private routeScrollPositions = [];
  private subscriptions: Subscription[] = [];
  public notyOptions = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: false,
    pauseOnHover: true,
    preventDuplicates: true,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'scale',
    position: ['right', 'top']
  };
  // Static Stats
  public computeUnitsTotal = 25200;
  public storageUnitsTotal = 91578;
  public storageUnitsPB = 73000;
  public storageUnitsCores = 28000;
  public computeUnitPriceUSD = 12;
  public storageUnitPriceUSD = 10;
  public currentTokenPriceUSD = 0.1;
  public totalSupply = 1000000000;
  public maxSupply = 2000000000;

  public exchangeRates;
  public currentCurrencyPair = 'usd';
  constructor(
    public socketService: SocketService,
    public dataService: DataService,
    public notify: NotificationsService,
    public apiService: ApiService,
    private router: Router,

  ) {
    this.socketService.initSocket();
    this.socketService.onTick().subscribe(
      (data) => {
        this.exchangeRates = data.currency;
        dataService.exchangeRates$.next(data.currency);
        dataService.lastBlock$.next(data.lastBlock);
      });
    this.setCurrency('usd');
    this.setRoutingScroll();
  }
  public API(...args): Observable<any> {
    return new Observable<any>(observer => {
      this.apiService[args[0]](...args.slice(1)).subscribe(
        res => {
          if (res.result) {
            observer.next(res.data);
          } else {
            this.notify.error('Error', res.message);
          }
        },
        err => {
          this.notify.error('Error', 'Server unavailable');
        },
      );
    });
  }
  public converter(amountInUsd: number, currencyPair?: string ) {
    const pair = currencyPair ? currencyPair : this.currentCurrencyPair;
    if ( pair === 'usd' ) {
      return amountInUsd;
    }
    if (this.exchangeRates) {
      return amountInUsd / this.exchangeRates[pair];
    } else {
      this.setCurrency('usd');
      return amountInUsd;
    }
  }
  public symbol(position: string) {
    let result;
    if (position === 'l') {
      if (this.currentCurrencyPair === 'usd') {
        result = '$';
      } else if (this.currentCurrencyPair === 'usdEur') {
        result = '€';
      } else {
        result = '';
      }
    }
    if (position === 'r') {
      if (this.currentCurrencyPair === 'btcUsd') {
        result = 'Ƀ';
      } else {
        result = '';
      }
    }
    return result;
  }
  public setCurrency(currency: string) {
    this.currentCurrencyPair = currency;
    this.dataService.currency$.next(currency);
  }
  public tokens(value: number) {
    return value / 1000000000;
  }
  public setRoutingScroll() {
    // Routing scrolling up
    this.subscriptions.push(
      this.router.events.pairwise().subscribe(([prevRouteEvent, currRouteEvent]) => {
        if (prevRouteEvent instanceof NavigationEnd && currRouteEvent instanceof NavigationStart) {
          const urlPath = (prevRouteEvent.urlAfterRedirects || prevRouteEvent.url).split(';', 1)[0];
          this.routeScrollPositions[urlPath] = window.pageYOffset;
        }
        if (currRouteEvent instanceof NavigationEnd) {
          setTimeout(() => {
            const urlPath = (currRouteEvent.urlAfterRedirects || currRouteEvent.url).split(';', 1)[0];
            window.scrollTo(0, this.routeScrollPositions[urlPath] || 0);
          }, 0);
        }
      })
    );
  }
}
