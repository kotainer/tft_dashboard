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
    this.setTokenPrice();
    const exchangeRatesSub = this.appComponent.dataService.exchangeRates$.subscribe(
      rates => {
        if (rates) {
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
    this.tokenPrice.usd = this.appComponent.currentTokenPriceUSD;
    this.tokenPrice.eur = this.appComponent.calculateAmount(this.tokenPrice.usd, 'usdEur');
    this.tokenPrice.btc = this.appComponent.calculateAmount(this.tokenPrice.usd, 'btcUsd');
  }
  public search() {
    if (!this.query) {
      return;
    }
    this.router.navigate([`/search/${this.query}`]);
  }

}
