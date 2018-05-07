import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public id;
  public item;
  constructor(
    private appComponent: AppComponent,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.item = null;
      this.search();
    });
  }
  public search() {
    let path = 'block';
    if (this.id.match(/[a-z]/i)) {
      path = 'hashes';
    }
    this.appComponent.API('get', path, this.id).subscribe(
      data => {
        if (data) {
          this.item = data;
        }
      },
    );
  }
  public newSearch(id) {
    this.router.navigate([`/search/${id}`]);
  }
  public tokens(value) {
    return this.appComponent.tokens(value);
  }
  public tokenConverter(value: number) {
    return this.appComponent.tokenConverter(value);
  }
  public symbol(position: string) {
    return this.appComponent.symbol(position);
  }
  public currentCurrencyPair() {
    return this.appComponent.currentCurrencyPair;
  }
  public isAddressCoinOuputs(transactions: Array<any>) {
    let result = false;
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].coinoutputids != null && transactions[i].coinoutputids.length !== 0) {
        // Scan for a relevant siacoin output.
        for (let j = 0; j < transactions[i].coinoutputids.length; j++) {
          if (transactions[i].rawtransaction.data.coinoutputs[j].unlockhash === this.id) {
            result = true;
          }
        }
      }
    }
    return result;
  }
  public isAddressMinerPayouts(item: any) {
    let result = false;
    if (item.blocks != null && item.blocks.length !== 0) {
      for (let i = 0; i < item.blocks.length; i++) {
        for (let j = 0; j < item.blocks[i].minerpayoutids.length; j++) {
          if (item.blocks[i].rawblock.minerpayouts[j].unlockhash === this.id) {
            result = true;
          }
        }
      }
    }
    return result;
  }
  public isAddressBlockstakeOutputs(transactions: Array<any>) {
    let result = false;
    for (let i = 0; i < transactions.length; i++) {
      const blockstakeinputs = transactions[i].rawtransaction.data.blockstakeinputs;
      if (blockstakeinputs != null && blockstakeinputs.length !== 0) {
        for (let j = 0; j < blockstakeinputs.length; j++) {
          result = true;
        }
      }
    }
    return result;
  }
}
