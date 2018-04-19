import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-shape';
import * as L from 'leaflet';
import { MapComponent } from '@yaga/leaflet-ng2';
import HeatmapOverlay = require('leaflet-heatmap/leaflet-heatmap');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Charts
  public view: any[] = [400, 175];
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
  colorSchemePrice = {
    domain: ['#17f9be']
  };
  public curve = d3.curveNatural;


  // Map
  public OSM_TILE_LAYER_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png';
  public options = {
    layers: [
      L.tileLayer(this.OSM_TILE_LAYER_URL,
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
  public options2 = {
    layers: [
      L.tileLayer(this.OSM_TILE_LAYER_URL,
        {
          subdomains: 'abcd',
          maxZoom: 5
        })
    ],
    zoom: 0.5,
    center: L.latLng(46.879966, -121.726909)
  };
  constructor() { }

  ngOnInit() {
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
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      'radius': 15,
      'maxOpacity': .6,
      // scales the radius based on map zoom
      'scaleRadius': true,
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      'useLocalExtrema': true,
      // which field name in your data represents the latitude - default 'lat'
      latField: 'lat',
      // which field name in your data represents the longitude - default 'lng'
      lngField: 'lng',
      // which field name in your data represents the data value - default 'value'
      valueField: 'count'
    };


    const heatmapLayer = new HeatmapOverlay(cfg);

    heatmapLayer.setData(testData);
    heatmapLayer.onAdd(map);
  }

}
