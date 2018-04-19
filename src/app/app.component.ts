import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import * as d3 from 'd3-shape';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public socketService: SocketService,
  ) {
    this.socketService.initSocket();

    this.socketService.onMessage()
      .subscribe((message: any) => {
        console.log(message);
      });
  }

}
