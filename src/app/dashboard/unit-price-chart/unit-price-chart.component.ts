import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-unit-price-chart',
  templateUrl: './unit-price-chart.component.html',
  styleUrls: ['./unit-price-chart.component.css']
})
export class UnitPriceChartComponent implements OnInit {
  public computeUnitPrice;
  public storageUnitPrice;

  public unitsChartData = [
    {
      'name': 'Compute Unit',
      'series': []
    },
    {
      'name': 'Storage Unit',
      'series': []
    }
  ];
  public monthsToShow = 6;
  public viewCharts = [400, 175];
  public colorSchemeUnitsChart = {
    domain: ['#f993ab', '#ffc8a7']
  };
  constructor(
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.computeUnitPrice = this.appComponent.computeUnitPriceUSD;
    this.storageUnitPrice = this.appComponent.storageUnitPriceUSD;
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
