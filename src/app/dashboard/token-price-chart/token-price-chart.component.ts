import { Component, OnInit, OnDestroy } from '@angular/core';
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
  public currenciesNames = ['usd', 'usdEur', 'btcUsd'];
  public currentCurrency = 'usd';
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
    this.priceChartData = this.calculatePriceChartData();
    const exchangeRatesSub = this.appComponent.dataService.exchangeRates$.subscribe(
      rates => {
        if (rates) {
          this.priceChartData = this.calculatePriceChartData();
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
    const that = this;
    const priceData = [
      {
        'name': 'Token price',
        'series': []
      }
    ];
    function setData(times: number) {
      while (times > 0) {
        const monthNumber = that.monthNumber(times + 1);
        const monthNumberString = monthNumber > 9 ? monthNumber : '0' + monthNumber;
        let price;
        if (times === 1) {
          price = that.calculatePrice(0.1, that.currentCurrency);
        } else if (1 < times && times < 4) {
          price = that.calculatePrice(0.08, that.currentCurrency);
        } else {
          price = that.calculatePrice(0.05, that.currentCurrency);
        }
        const object = {
          name: '01/' + monthNumberString,
          value: price
        };
        priceData[0].series.push(object);
        times--;
      }
    }
    setData(6);
    return priceData;
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
  public changeCurrency(currency) {
    this.currentCurrency = currency;
    this.priceChartData = this.calculatePriceChartData();
  }
}
