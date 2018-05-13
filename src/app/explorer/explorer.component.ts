import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit {
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
  public hashName(type: string) {
    let name;
    switch (type) {
      case 'blockid':
        name = 'Block ID';
        break;
      case 'transactionid':
        name = 'Transaction ID';
        break;
      case 'unlockhash':
        name = 'Address';
        break;
      default:
        name = 'N/A';
    }
    return name;
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
}
