import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';

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
    this.setData(0, this.computeUnitPrice, 6);
    this.setData(1, this.storageUnitPrice, 6);
  }
  private setData(index: number, price: number, times: number) {
    while (times > 0) {
      const monthNumber = this.monthNumber(times + 1);
      const monthNumberString = monthNumber > 9 ? monthNumber : '0' + monthNumber;
      const object = {
        name: '01/' + monthNumberString,
        value: price
      };
      this.unitsChartData[index].series.push(object);
      times--;
    }
  }

  private monthNumber(monthsCount: number) {
    const currentMonth = new Date().getMonth() + 1;
    const today = new Date();
    const monthNum = new Date(today.setMonth(currentMonth - monthsCount + 1)).getMonth() + 1;
    return monthNum;
  }
}
