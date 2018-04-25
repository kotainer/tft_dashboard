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
  public calculatedValueInTokens(value) {
    return value / 1000000000;
  }
  public typeName(transaction, lowCase?: boolean) {
    let name;
    const transactionData = transaction.rawtransaction.data;
    if (transactionData.blockstakeinputs || transactionData.blockstakeouputs) {
      name = 'Blockstake';
    } else {
      name = 'Coin';
    }
    return lowCase ? name.toLocaleLowerCase() : name;
  }
}
