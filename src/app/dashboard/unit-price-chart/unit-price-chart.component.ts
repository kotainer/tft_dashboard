import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppComponent } from '../../app.component';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-unit-price-chart',
  templateUrl: './unit-price-chart.component.html',
  styleUrls: ['./unit-price-chart.component.css', '../dashboard.component.css']
})
export class UnitPriceChartComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public computeUnitPrice;
  public storageUnitPrice;

  public unitsChartData;
  public monthsToShow = 6;
  public chartOptions = {
    view: [400, 155],
    colorScheme : {
      domain: ['#f993ab', '#ffc8a7']
    },
    gradient: true,
    xAxis: true,
    yAxis: true,
    legendTitle: '',
    legend: true,
    showXAxisLabel: false,
    showYAxisLabel: false,
    autoScale: false,
    showGridLines: true
  };
  constructor(
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    const exchangeRatesSub = this.appComponent.dataService.exchangeRates$.subscribe(
      rates => {
        if (rates) {
          this.initChart();
        }
      }
    );
    const currencySub = this.appComponent.dataService.currency$.subscribe(
      curr => {
        if (curr) {
          this.initChart();
        }
      }
    );
    this.subscriptions.push(exchangeRatesSub, currencySub);
  }
  ngOnDestroy() {
    this.subscriptions
      .forEach(s => s.unsubscribe());
  }
  public initChart() {
    this.unitsChartData = [
      {
        'name': 'Compute Unit',
        'series': []
      },
      {
        'name': 'Storage Unit',
        'series': []
      }
    ];
    this.computeUnitPrice = this.appComponent.converter(this.appComponent.computeUnitPriceUSD);
    this.storageUnitPrice = this.appComponent.converter(this.appComponent.storageUnitPriceUSD);
    this.calculateUnitsChartData();
  }
  public calculateUnitsChartData() {
    this.setData(0, this.computeUnitPrice, this.monthsToShow);
    this.setData(1, this.storageUnitPrice, this.monthsToShow);
  }
  private setData(index: number, price: number, months: number) {
    while (months > 0) {
      const monthNumber = this.monthNumber(months);
      const monthNumberString = monthNumber > 9 ? monthNumber : `0${monthNumber}`;
      const object = {
        name: '01/' + monthNumberString,
        value: price
      };
      this.unitsChartData[index].series.push(object);
      months--;
    }
  }
  private monthNumber(monthsCount: number) {
    const monthNumber = moment().subtract(monthsCount - 1, 'month').format('M');
    return Number(monthNumber);
  }
}
