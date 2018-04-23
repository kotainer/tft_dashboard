import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3-shape';
import * as moment from 'moment/moment';
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
  public monthsToShow = 6;
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
    this.setData(this.monthsToShow);
  }
  public setData(months: number) {
    while (months > 0) {
      const monthNumber = this.monthNumber(months);
      const monthNumberString = monthNumber > 9 ? monthNumber : `0${monthNumber}`;
      const price = this.calculatePrice(this.checkTokenPrice(months), this.currentCurrency);
      const object = {
        name: '01/' + monthNumberString,
        value: price
      };
      this.priceChartData[0].series.push(object);
      months--;
    }
  }
  private monthNumber(monthsCount: number) {
    const monthNumber = moment().subtract(monthsCount - 1, 'month').format('M');
    return Number(monthNumber);
  }
  private checkTokenPrice(months: number) {
    let currentPriceUSD = 0.05;
    const priceChange1 = moment('2018-02-01');
    const priceChange2 = moment('2018-04-01');
    const activeMonth = moment().subtract(months - 1, 'month');
    if (activeMonth.isAfter(priceChange1)) {
      currentPriceUSD = 0.08;
    }
    if (activeMonth.isAfter(priceChange2)) {
      currentPriceUSD = this.appComponent.currentTokenPriceUSD;
    }
    return currentPriceUSD;
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
