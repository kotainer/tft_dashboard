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
  public currentTokenPrice = 0.1;

  public exchangeRates;
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
  public calculateAmount( amountInUsd: number, currencyName: string) {
     if (this.exchangeRates) {
        return amountInUsd / this.exchangeRates[currencyName];
    } else {
      return 0;
    }
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
