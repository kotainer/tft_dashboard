import { Component, OnInit, OnDestroy } from '@angular/core';
import * as HeatmapOverlay from 'leaflet-heatmap/leaflet-heatmap';
import * as d3 from 'd3-shape';
import * as L from 'leaflet';
import { Subscription } from 'rxjs/Subscription';
import { AppComponent } from '../app.component';

const OSM_TILE_LAYER_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public lastBlocks;
  public lastBlock;
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
          maxZoom: 5
        })
    ],
    zoom: 0.5,
    center: L.latLng(46.879966, -121.726909)
  };
  public layers = [
    L.circle([46.95, -102], { radius: 200000, color: '#25dfec' }),
    L.circle([46.95, -102], { radius: 200000, color: '#25dfec' }),
    L.circle([46.95, -102], { radius: 200000, color: '#25dfec' }),
    L.circle([46.95, -102], { radius: 200000, color: '#25dfec' }),
    L.circle([58.95, -182], { radius: 200000, color: '#25dfec' }),
    L.circle([66.95, -122], { radius: 200000, color: '#25dfec' }),
    L.circle([66.95, -222], { radius: 200000, color: '#25dfec' }),
    L.circle([36.95, -352], { radius: 200000, color: '#25dfec' }),
    L.circle([36.95, -352], { radius: 200000, color: '#25dfec' })
  ];

  // Heatmap
  public optionsHeatMap = {
    layers: [
      L.tileLayer(OSM_TILE_LAYER_URL,
        {
          subdomains: 'abcd',
          maxZoom: 5
        })
    ],
    zoom: 0.5,
    center: L.latLng(46.879966, -121.726909)
  };
  constructor(
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    this.getLastBlocks();
    const lastBlockSub = this.appComponent.dataService.lastBlock$.subscribe(
      block => {
        if (block) {
          this.lastBlock = block;
          if (this.lastBlock.height > this.lastBlocks[0].height) {
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

    this.appComponent.API('get', 'block', '').subscribe(
      data => {
        if (data) {
          this.lastBlocks = data.lastBlocks;
        }
      },
    );
  }
  public onMapReady(map: L.Map): void {
    // Do stuff with map
    const testData = {
      max: 1,
      min: 1,
      data: [
        { lat: 46.95, lng: -102, count: 2 },
        { lat: 46.95, lng: -102, count: 1 },
        { lat: 46.95, lng: -102, count: 1 },
        { lat: 46.95, lng: -102, count: 1 },
        { lat: 58.95, lng: -182, count: 1 },
        { lat: 66.95, lng: -122, count: 1 },
        { lat: 66.95, lng: -222, count: 1 },
        { lat: 36.95, lng: -352, count: 1 },
        { lat: 36.95, lng: -353, count: 1 }
      ]
    };
    const baseLayer = L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }
    );

    const cfg = {
      'radius': 15,
      'maxOpacity': .6,
      'scaleRadius': true,
      'useLocalExtrema': true,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count'
    };

    const heatmapLayer = new HeatmapOverlay(cfg);

    heatmapLayer.setData(testData);
    heatmapLayer.onAdd(map);
  }

}
