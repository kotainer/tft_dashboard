import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public query;
  public currencies = {
    pairs: ['usd', 'usdEur', 'btcUsd'],
    names: {
      usd: 'USD',
      usdEur: 'EUR',
      btcUsd: 'BTC'
    },
    current: ''
  };
  constructor(
    private appComponent: AppComponent,
    private router: Router,
  ) { }

  ngOnInit() {
    const currencySub = this.appComponent.dataService.currency$.subscribe(
      curr => {
        if (curr) {
          this.currencies.current = curr;
        }
      }
    );
    this.subscriptions.push(currencySub);
  }
  ngOnDestroy() {
    this.subscriptions
      .forEach(s => s.unsubscribe());
  }
  public search() {
    if (!this.query) {
      return;
    }
    this.router.navigate([`/search/${this.query}`]);
  }
  public setCurrency(currency: string) {
    this.appComponent.setCurrency(currency);
  }
  public tokenPrice() {
    return this.appComponent.tokenConverter(1000000000);
  }
  public symbol(position: string) {
    return this.appComponent.symbol(position);
  }
  public currentCurrencyPair() {
    return this.appComponent.currentCurrencyPair;
  }
}
