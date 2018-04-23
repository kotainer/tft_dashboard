import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
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

  // Static Stats
  public computeUnitsTotal = 25200;
  public storageUnitsTotal = 91578;
  public storageUnitsPB = 72000;
  public storageUnitsCores = 28000;
  public computeUnitPriceUSD = 12;
  public storageUnitPriceUSD = 10;

  constructor(
    private appComponent: AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPeers();
    this.getLastBlocks();

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
  public calculatedValueInTokens(value) {
    return value / 1000000000;
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
