import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-unit-price-chart',
  templateUrl: './unit-price-chart.component.html',
  styleUrls: ['./unit-price-chart.component.css']
})
export class UnitPriceChartComponent implements OnInit {
  public computeUnitPrice = {
    usd: 12,
    eur: 0,
    btc: 0
  };
  public storageUnitPrice = {
    usd: 10,
    eur: 0,
    btc: 0
  };

  public unitsChartData;

  public viewCharts = [400, 175];
  public colorSchemeUnitsChart = {
    domain: ['#f993ab', '#ffc8a7']
  };
  constructor(
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.unitsChartData = this.calculateUnitsChartData();
  }
  public calculateUnitsChartData() {
    const that = this;
    const unitsData = [
      {
        'name': 'Compute Unit',
        'series': []
      },
      {
        'name': 'Storage Unit',
        'series': []
      }
    ];
    function setData(index: number, price: number, times: number) {
      while (times > 0) {
        const monthNumber = that.monthNumber(times + 1);
        const monthNumberString = monthNumber > 9 ? monthNumber : '0' + monthNumber;
        const object = {
          name: '01/' + monthNumberString,
          value: price
        };
        unitsData[index].series.push(object);
        times--;
      }
    }
    setData(0, this.computeUnitPrice.usd, 6);
    setData(1, this.storageUnitPrice.usd, 6);
    return unitsData;
  }

  private monthNumber(monthsCount: number) {
    const currentMonth = new Date().getMonth() + 1;
    const today = new Date();
    const monthNum = new Date(today.setMonth(currentMonth - monthsCount + 1)).getMonth() + 1;
    return monthNum;
  }
}
