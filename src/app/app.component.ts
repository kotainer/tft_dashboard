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
  constructor(
    public socketService: SocketService,
    public dataService: DataService,
    public notify: NotificationsService,
    public apiService: ApiService,
    private router: Router,

  ) {
    this.socketService.initSocket();
    this.socketService.onTick().subscribe(
      (data: any) => {
        this.dataService.lastBlock$.next(data.lastBlock);
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
  public setRoutingScroll() {
    this.subscriptions.push(
      this.router.events.pairwise().subscribe(([prevRouteEvent, currRouteEvent]) => {
        if (currRouteEvent instanceof NavigationEnd) {
          setTimeout(() => {
            const tree = this.router.parseUrl(this.router.url);
            if (tree.fragment) {
              const element = document.querySelector('#' + tree.fragment);
              if (element) {
                element.scrollIntoView();
              }
              return;
            }
            const urlPath = (currRouteEvent.urlAfterRedirects || currRouteEvent.url).split(';', 1)[0];
            window.scrollTo(0, this.routeScrollPositions[urlPath] || 0);
          }, 0);
        }
        if (prevRouteEvent instanceof NavigationEnd && currRouteEvent instanceof NavigationStart) {
          const urlPath = (prevRouteEvent.urlAfterRedirects || prevRouteEvent.url).split(';', 1)[0];
          this.routeScrollPositions[urlPath] = window.pageYOffset;
        }
      })
    );
  }


}
