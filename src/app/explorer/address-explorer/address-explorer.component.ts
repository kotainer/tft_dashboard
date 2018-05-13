import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-address-explorer',
  templateUrl: './address-explorer.component.html',
  styleUrls: ['../explorer.component.css', './address-explorer.component.css']
})
export class AddressExplorerComponent implements OnInit {
  @Input() public item;
  @Input() public id;
  constructor(
    public router: Router,
    private appComponent: AppComponent,
  ) { }

  public currentPage = 1;
  public collection = [1, 2, 3, 4, 5, 6, 7, 16];
  public pageSize = 4;
  public totalItems = this.collection.length;

  ngOnInit() {
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
  public hasBeenSpent(transactions: any, value: string, typeName: string) {
    let result = 'No';
    const type = typeName === 'coin' ? 'coininputoutputs' : 'blockstakeinputoutputs';
    transactions.map(transaction => {
      if (transaction[type] !== null) {
        transaction[type].map((el) => {
          if (el.value === value && el.condition.data.unlockhash === this.id) {
            result = 'Yes';
          }
        });
      }
    });
    return result;
  }

  public pageChanged(event) {
    this.currentPage = event;
  }

}
