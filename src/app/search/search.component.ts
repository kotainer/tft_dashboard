import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public id;
  public loading = false;
  public item;
  constructor(
    private appComponent: AppComponent,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
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
}
