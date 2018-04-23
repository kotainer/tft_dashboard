import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3-shape';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public currentTimeTimeStamp = + new Date();
  public lastBlock;
  public lastBlocks = [];
  public peers = [];
  public unitsChartData;
  public priceChartData;

  // Static Stats
  public computeUnitsTotal = 25200;
  public storageUnitsTotal = 91578;
  public storageUnitsPB = 72000;
  public storageUnitsCores = 28000;
  public computeUnitPriceUSD = 12;
  public storageUnitPriceUSD = 10;

  // Charts
  public viewCharts = [400, 175];

  public colorSchemeUnitsChart = {
    domain: ['#f993ab', '#ffc8a7']
  };
  public colorSchemePriceChart = {
    domain: ['#17f9be']
  };
  public curveCharts = d3.curveLinear;
  constructor(
    private appComponent: AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPeers();
    this.getLastBlocks();
    this.unitsChartData = this.calculateUnitsChartData();
    this.priceChartData = this.calculatePriceChartData();

    const lastBlockSub = this.appComponent.dataService.lastBlock$.subscribe(
      block => {
        if (block) {
          this.lastBlock = block;
          // Check&&Replace last block
          if (this.lastBlocks.length > 0 && this.lastBlock.height > this.lastBlocks[0].height) {
            this.appComponent.notify.success('New block', `#${block.height}`);
            this.lastBlocks.unshift(this.lastBlock);
            this.lastBlocks.splice(-1, 1);
          }
        }
      }
    );
    this.subscriptions.push(lastBlockSub);
  }

  ngOnDestroy() {
    this.subscriptions
      .forEach(s => s.unsubscribe());
  }
  public getLastBlocks() {
    this.appComponent.API('get', 'block').subscribe(
      data => {
        if (data) {
          this.lastBlock = data.lastBlock;
          this.lastBlocks = data.lastBlocks;
        }
      },
    );
  }
  public getPeers() {
    this.appComponent.API('get', 'peers').subscribe(
      data => {
        if (data) {
          this.peers = data;
        }
      },
    );
  }

  public search(id) {
    this.router.navigate([`/search/${id}`]);
  }
  public networkPrice() {
    return this.computeUnitsTotal * this.computeUnitPriceUSD + this.storageUnitsTotal * this.storageUnitPriceUSD;
  }
  public convertInThousands(number) {
    return number / 1000;
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
    setData(0, this.computeUnitPriceUSD, 6);
    setData(1, this.storageUnitPriceUSD, 6);
    return unitsData;
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
        if (times  === 1) {
          price = 0.1;
        } else if (1 < times && times < 4) {
          price = 0.08;
        } else {
          price = 0.05;
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
  public timeAgo(timeStampInPast) {
    // let  date= new Date(timeStampInPast * 1000);
    const date = new Date();
    // date.setTime(timeStampInPast.valueOf() - 60000 * timeStampInPast.getTimezoneOffset());
    const datem = new Date(timeStampInPast * 1000); // The 0 there is the key, which sets the date to the epoch
    // const date = datem.setUTCSeconds(timeStampInPast);
    // // Hours part from the timestamp
    // const hours = date.getHours();
    // // Minutes part from the timestamp
    // const minutes = "0" + date.getMinutes();
    // // Seconds part from the timestamp
    // const seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    // const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    const date1 = new Date(this.currentTimeTimeStamp * 1000);
    // Hours part from the timestamp
    const hours1 = date1.getHours();
    // Minutes part from the timestamp
    const minutes1 = '0' + date1.getMinutes();
    // Seconds part from the timestamp
    const seconds1 = '0' + date1.getSeconds();

    // Will display time in 10:30:23 format
    const formattedTime1 = hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);

    const diff = Math.abs(this.currentTimeTimeStamp - timeStampInPast) / 3600000;
    if (diff < 18) { /* do something */ }

    return datem;
  }
}
