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
  public sfoids = [];
  public sfoidMatches = [];
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
    if (transactions !== null) {
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
    if (transactions !== null) {
      for (let i = 0; i < transactions.length; i++) {
        const blockstakeoutputids = transactions[i].blockstakeoutputids;
        if (blockstakeoutputids != null && blockstakeoutputids.length !== 0) {
          for (let j = 0; j < blockstakeoutputids.length; j++) {
            this.sfoids.push(blockstakeoutputids[j]);
            this.sfoidMatches.push(false);
            if (transactions[i].rawtransaction.data.blockstakeoutputs[j].unlockhash === this.id) {
              result = true;
            }
          }
        }
        // if (!transactions[i].rawtransaction.data.blockstakeinputs) {
        //   return;
        // }
        // const blockstakeinputs = transactions[i].rawtransaction.data.blockstakeinputs;
        // if (blockstakeinputs !== null && blockstakeinputs.length !== 0) {
        //   for (let j = 0; j < blockstakeinputs.length; j++) {

        //     for (let k = 0; k < this.sfoids.length; k++) {
        //       if (blockstakeinputs[j].parentid === this.sfoids[k]) {
        //         this.sfoidMatches[k] = true;
        //       }
        //     }
        //   }
        // }
      }
    }
    return result;
  }
  public hasBeenSpent(transactions: any, value: string, typeName: string ) {
    let result = 'No';
    // const type = typeName === 'coin' ? 'coininputoutputs' : 'blockstakeoutputids';
    transactions.map( transaction => {
      if (transaction.coininputoutputs !== null ) {
        transaction.coininputoutputs.filter((el) => {
          if (el.value === value && el.unlockhash === this.id) {
            result = 'Yes';
          }
        });
      }
    });
    return result;
  }
}
