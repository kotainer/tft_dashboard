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
  public exchangeRates;
  public query;
  public tokenPrice = {
    usd: 0,
    eur: 0,
    btc: 0
  };
  constructor(
    private appComponent: AppComponent,
    private router: Router,
  ) { }

  ngOnInit() {
    const exchangeRatesSub = this.appComponent.dataService.exchangeRates$.subscribe(
      rates => {
        if (rates) {
          this.exchangeRates = rates;
          this.setTokenPrice();
        }
      }
    );
    this.subscriptions.push(exchangeRatesSub);
  }
  ngOnDestroy() {
    this.subscriptions
      .forEach(s => s.unsubscribe());
  }
  private setTokenPrice() {
    this.tokenPrice.usd = this.appComponent.currentTokenPrice;
    this.tokenPrice.eur = this.tokenPrice.usd / this.exchangeRates.usdEur;
    this.tokenPrice.btc = this.tokenPrice.usd / this.exchangeRates.btcUsd;
  }
  public search() {
    if (!this.query) {
      return;
    }
    this.router.navigate([`/search/${this.query}`]);
  }

}
