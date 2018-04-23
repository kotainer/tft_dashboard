import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3-shape';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-token-price-chart',
  templateUrl: './token-price-chart.component.html',
  styleUrls: ['./token-price-chart.component.css', '../dashboard.component.css']
})
export class TokenPriceChartComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public currencies = ['usd', 'usdEur', 'btcUsd'];
  public currenciesNames = {
    usd: 'USD',
    usdEur: 'EUR',
    btcUsd: 'BTC'
  };
  public currentCurrency;

  public priceChartData;
  public viewCharts = [400, 175];
  public colorSchemePriceChart = {
    domain: ['#17f9be']
  };
  public curveCharts = d3.curveLinear;

  constructor(
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.currentCurrency = this.currencies[0];
    this.initChart();
    const exchangeRatesSub = this.appComponent.dataService.exchangeRates$.subscribe(
      rates => {
        if (rates) {
          this.calculatePriceChartData();
        }
      }
    );
    this.subscriptions.push(exchangeRatesSub);
  }
  ngOnDestroy() {
    this.subscriptions
      .forEach(s => s.unsubscribe());
  }
  public calculatePriceChartData() {
    this.setData(6);
  }
  public setData(times: number) {
    while (times > 0) {
      const monthNumber = this.monthNumber(times + 1);
      const monthNumberString = monthNumber > 9 ? monthNumber : '0' + monthNumber;
      let price;
      if (times === 1) {
        price = this.calculatePrice(0.1, this.currentCurrency);
      } else if (1 < times && times < 4) {
        price = this.calculatePrice(0.08, this.currentCurrency);
      } else {
        price = this.calculatePrice(0.05, this.currentCurrency);
      }
      const object = {
        name: '01/' + monthNumberString,
        value: price
      };
      this.priceChartData[0].series.push(object);
      times--;
    }
  }
  private monthNumber(monthsCount: number) {
    const currentMonth = new Date().getMonth() + 1;
    const today = new Date();
    const monthNum = new Date(today.setMonth(currentMonth - monthsCount + 1)).getMonth() + 1;
    return monthNum;
  }
  public calculatePrice(amountInUsd: number, currency: string) {
    if (currency === 'usd') {
      return amountInUsd;
    }
    return this.appComponent.calculateAmount(amountInUsd, currency);
  }
  private initChart() {
    this.priceChartData = [
      {
        'name': 'Token price',
        'series': []
      }
    ];
    this.calculatePriceChartData();
  }
  public changeCurrency(currency) {
    this.currentCurrency = currency;
    this.initChart();
  }
}
