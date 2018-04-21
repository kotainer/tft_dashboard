import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as HeatmapOverlay from 'leaflet-heatmap/leaflet-heatmap';
import * as d3 from 'd3-shape';
import * as L from 'leaflet';
import { AppComponent } from '../app.component';

const OSM_TILE_LAYER_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public lastBlock;
  public lastBlocks = [];
  public peers = [];
  public currentTimeTimeStamp = + new Date();
  // Charts
  public view = [400, 175];
  public unitsData = [
    {
      'name': 'Unit price',
      'series': [
        {
          'name': '01/01',
          'value': 100
        },
        {
          'name': '01/02',
          'value': 110
        },
        {
          'name': '01/03',
          'value': 150
        },
        {
          'name': '01/04',
          'value': 150
        },
        {
          'name': '01/05',
          'value': 155
        },
        {
          'name': '01/06',
          'value': 180
        },
      ]
    },
    {
      'name': 'Storage price',
      'series': [
        {
          'name': '01/01',
          'value': 700
        },
        {
          'name': '01/02',
          'value': 680
        },
        {
          'name': '01/03',
          'value': 710
        },
        {
          'name': '01/04',
          'value': 730
        },
        {
          'name': '01/05',
          'value': 740
        },
        {
          'name': '01/06',
          'value': 800
        },
      ]
    }
  ];
  public priceData = [
    {
      'name': 'Token price',
      'series': [
        {
          'name': '01/01',
          'value': 100
        },
        {
          'name': '01/02',
          'value': 110
        },
        {
          'name': '01/03',
          'value': 150
        },
        {
          'name': '01/04',
          'value': 150
        },
        {
          'name': '01/05',
          'value': 155
        },
        {
          'name': '01/06',
          'value': 180
        },
      ]
    }
  ];
  public colorScheme = {
    domain: ['#f993ab', '#ffc8a7']
  };
  public colorSchemePrice = {
    domain: ['#17f9be']
  };
  public curve = d3.curveNatural;

  // Map
  public optionsGeoMap = {
    layers: [
      L.tileLayer(OSM_TILE_LAYER_URL,
        {
          subdomains: 'abcd',
          maxZoom: 4
        })
    ],
    zoom: 0.5,
    center: L.latLng(50, 4)
  };
  public geoMapLayers = [];

  // Heatmap
  public optionsHeatMap = {
    layers: [
      L.tileLayer(OSM_TILE_LAYER_URL,
        {
          subdomains: 'abcd',
          maxZoom: 4
        })
    ],
    zoom: 0.5,
    center: L.latLng(50, 4)
  };
  public heatmapLayerConfigs = {
    'radius': 5,
    'maxOpacity': .6,
    'scaleRadius': true,
    'useLocalExtrema': true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
  };
  public heatmapLayer = new HeatmapOverlay(this.heatmapLayerConfigs);
  public heatMapLayers = {
    max: 2,
    min: 1,
    data: []
  };
  constructor(
    private appComponent: AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.getLastBlocks();
    this.getPeers();
    const lastBlockSub = this.appComponent.dataService.lastBlock$.subscribe(
      block => {
        if (block) {
          this.lastBlock = block;
          if (this.lastBlocks.length > 0 && this.lastBlock.height > this.lastBlocks[0].height) {
            this.appComponent.notify.success('New block', `#${block.height}`);
            this.lastBlocks.unshift(this.lastBlock);
            this.lastBlocks.splice(-1, 1);
          }
        }
      }
    );
    this.subscriptions.push(lastBlockSub);
  }

  ngOnDestroy() {
    this.subscriptions
      .forEach(s => s.unsubscribe());
  }
  public getLastBlocks() {
    this.appComponent.API('get', 'block').subscribe(
      data => {
        if (data) {
          this.lastBlocks = data.lastBlocks;
        }
      },
    );
  }
  public getPeers() {
    this.appComponent.API('get', 'peers').subscribe(
      data => {
        if (data) {
          this.peers = data;
          this.prepareGeoMapData();
          this.prepareHeatMapData();
        }
      },
    );
  }
  public prepareGeoMapData() {
    this.peers.forEach(peer => {
      const coordinate = L.circle([peer.geo.coordinates[0], peer.geo.coordinates[1]], { radius: 150000, color: '#25dfec' });
      this.geoMapLayers.push(coordinate);
    });
  }
  public prepareHeatMapData() {
    this.peers.map((peer, i) => {
      let coordinate = { lat: peer.geo.coordinates[0], lng: peer.geo.coordinates[1], count: 1 };
      if (i === 0) {
        coordinate.count = 2;
      }
      this.heatMapLayers.data.push(coordinate);
    });
    this.heatmapLayer.setData(this.heatMapLayers);
  }
  public onMapReady(map: L.Map): void {
    this.heatmapLayer.onAdd(map);
  }
  public search(id) {
    this.router.navigate([`/search/${id}`]);
  }
  public timeAgo(timeStampInPast) {
    // let  date= new Date(timeStampInPast * 1000);
    const date = new Date();
    // date.setTime(timeStampInPast.valueOf() - 60000 * timeStampInPast.getTimezoneOffset());
    const datem = new Date(timeStampInPast * 1000); // The 0 there is the key, which sets the date to the epoch
    // const date = datem.setUTCSeconds(timeStampInPast);
    // // Hours part from the timestamp
    // const hours = date.getHours();
    // // Minutes part from the timestamp
    // const minutes = "0" + date.getMinutes();
    // // Seconds part from the timestamp
    // const seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    // const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    const date1 = new Date(this.currentTimeTimeStamp * 1000);
    // Hours part from the timestamp
    const hours1 = date1.getHours();
    // Minutes part from the timestamp
    const minutes1 = "0" + date1.getMinutes();
    // Seconds part from the timestamp
    const seconds1 = "0" + date1.getSeconds();

    // Will display time in 10:30:23 format
    const formattedTime1 = hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);

    const diff = Math.abs(this.currentTimeTimeStamp - timeStampInPast) / 3600000;
    if (diff < 18) { /* do something */ }

    return datem;
  }
}
