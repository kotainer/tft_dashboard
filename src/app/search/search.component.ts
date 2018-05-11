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
      transactions.map((transaction, i) => {
        if (transaction.coinoutputids != null && transaction.coinoutputids.length !== 0) {
          transaction.coinoutputids.map((coinoutputid, j) => {
            if (transaction.rawtransaction.data.coinoutputs[j].unlockhash === this.id) {
              result = true;
            }
          });
        }
      });
    }
    return result;
  }
  public isAddressMinerPayouts(item: any) {
    let result = false;
    if (item.blocks != null && item.blocks.length !== 0) {
      item.blocks.map((block, i) => {
        block.minerpayoutids.map((minerpayoutid, j) => {
          if (block.rawblock.minerpayouts[j].unlockhash === this.id) {
            result = true;
          }
        });
      });
    }
    return result;
  }
  public isAddressBlockstakeOutputs(transactions: Array<any>) {
    let result = false;
    if (transactions !== null) {
      transactions.map((transaction, i) => {
        const blockstakeoutputids = transaction.blockstakeoutputids;
        if (blockstakeoutputids != null && blockstakeoutputids.length !== 0) {
          blockstakeoutputids.map((blockstakeoutputid, j) => {
            if (transaction.rawtransaction.data.blockstakeoutputs[j].unlockhash === this.id) {
              result = true;
            }
          });
        }
      });
    }
    return result;
  }
  public hasBeenSpent(transactions: any, value: string, typeName: string ) {
    let result = 'No';
    const type = typeName === 'coin' ? 'coininputoutputs' : 'blockstakeinputoutputs';
    // if (typeName === 'coin') {
      transactions.map(transaction => {
        if (transaction[type] !== null) {
          transaction[type].map((el) => {
            if (el.value === value && el.condition.data.unlockhash === this.id) {
              result = 'Yes';
            }
          });
        }
      });
    // }
    //  else {
    //   transactions.map(transaction => {
    //     if (transaction.blockstakeinputoutputs !== null) {
    //       transaction.blockstakeinputoutputs.map((el) => {
    //         if (el.value === value && el.unlockhash === this.id) {
    //           result = 'Yes';
    //         }
    //       });
    //     }
    //   });
    // }
    return result;
  }
}
