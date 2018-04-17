import { Component } from '@angular/core';
import * as d3 from 'd3-shape';
import * as L from 'leaflet';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  view: any[] = [450, 120];
  unitsData = [
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
  priceData = [
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

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Month';
  showYAxisLabel = false;
  yAxisLabel = 'Price';

  colorScheme = {
    domain: ['#f993ab', '#ffc8a7']
  };
  colorSchemePrice = {
    domain: ['#17f9be']
  };
  // line, area
  autoScale = true;
  public curve = d3.curveNatural;



  options = {
    layers: [
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png',
      {
      subdomains: 'abcd',
      maxZoom: 5
    })
    ],
    zoom: 1.1,
    center: L.latLng(46.879966, -121.726909)
  };
  layers = [
    L.circle([46.95, -122], { radius: 300000, color: '#25dfec'  }),
    L.circle([46.95, -112], { radius: 300000, color: '#25dfec' }),
    L.circle([46.95, -102], { radius: 300000, color: '#25dfec' }),
    L.circle([48.95, -122], { radius: 300000, color: '#25dfec' }),
    L.circle([58.95, -182], { radius: 200000, color: '#25dfec' }),
    L.circle([66.95, -122], { radius: 300000, color: '#25dfec' }),
    L.circle([66.95, -222], { radius: 200000, color: '#25dfec' }),
    L.circle([36.95, -352], { radius: 200000, color: '#25dfec' })
  ];
}
