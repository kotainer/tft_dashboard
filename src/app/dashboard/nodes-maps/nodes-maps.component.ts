import { Component, OnInit, Input } from '@angular/core';
import * as HeatmapOverlay from 'leaflet-heatmap/leaflet-heatmap';
import * as L from 'leaflet';

const OSM_TILE_LAYER_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png';

@Component({
  selector: 'app-nodes-maps',
  templateUrl: './nodes-maps.component.html',
  styleUrls: ['./nodes-maps.component.css', '../dashboard.component.css']
})

export class NodesMapsComponent implements OnInit {
  @Input() public peers = [];
  // GeoMap
  public geoMapOptions = {
    layers: [
      L.tileLayer(OSM_TILE_LAYER_URL,
        {
          subdomains: 'abcd',
          maxZoom: 4
        })
    ],
    zoom: 0.7,
    center: L.latLng(50, 4)
  };
  public geoMapLayers = [];

  // HeatMap
  public heatMapOptions = {
    layers: [
      L.tileLayer(OSM_TILE_LAYER_URL,
        {
          subdomains: 'abcd',
          maxZoom: 4
        })
    ],
    zoom: 1,
    center: L.latLng(50, 4)
  };
  public heatMapLayerConfigs = {
    'radius': 7,
    'maxOpacity': 0.6,
    'scaleRadius': true,
    'useLocalExtrema': true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
  };
  public heatMapLayers = {
    max: 1,
    min: 1,
    data: []
  };
  public heatMapLayer = new HeatmapOverlay(this.heatMapLayerConfigs);
  constructor() { }

  ngOnInit() {
    this.setGeoMapData();
    this.setHeatMapData();
  }
  public setGeoMapData() {
    this.peers.forEach(peer => {
      const coordinate = L.circle([peer.geo.coordinates[0], peer.geo.coordinates[1]], { radius: 150000, color: '#25dfec' });
      this.geoMapLayers.push(coordinate);
    });
  }
  public setHeatMapData() {
    this.peers.map((peer, index) => {
      const coordinate = { lat: peer.geo.coordinates[0], lng: peer.geo.coordinates[1], count: 1 };
      if (index === 0) {
        coordinate.count = 2;
      }
      this.heatMapLayers.data.push(coordinate);
    });
    this.heatMapLayer.setData(this.heatMapLayers);
  }
  public onHeatMapReady(map: L.Map) {
    this.heatMapLayer.onAdd(map);
  }

}
