import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SocketService } from '../services/socket.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private subscriptions: Subscription[] = [];

  constructor(
    public socketService: SocketService,
    public dataService: DataService,
  ) {
    this.socketService.initSocket();

    this.socketService.onTick()
      .subscribe((data: any) => {
        this.dataService.lastBlock$.next(data.lastBlock);
        this.dataService.lastBlocks$.next(data.lastBlocks);
      });
  }

}
