import { Component } from '@angular/core';
import * as d3 from 'd3-shape';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  view: any[] = [430, 130];
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
    domain: ['#00f7da']
  };

  // line, area
  autoScale = true;
  public curve = d3.curveNatural;
}
