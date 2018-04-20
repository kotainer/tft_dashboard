import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  public blocks$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }
}
