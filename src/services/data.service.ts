import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  public lastBlock$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public lastBlocks$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }
}
