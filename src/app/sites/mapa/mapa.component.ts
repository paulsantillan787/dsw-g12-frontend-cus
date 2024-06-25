import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { GoogleMapsModule } from '@angular/google-maps';
//import { BrowserModule } from '@angular/platform-browser';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Heatmap as HeatmapLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill } from 'ol/style';

import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit {
  map: Map = new Map();
  overlay: Overlay | undefined;  
  
  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    const features = this.getHeatmapFeatures();

    const vectorSource = new VectorSource({
      features: features
    });

    const heatmapLayer = new HeatmapLayer({
      source: vectorSource,
      blur: 15,
      radius: 10
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        heatmapLayer
      ],
      view: new View({
        center: fromLonLat([-77.0428, -12.0464]), // Coordenadas de Lima
        zoom: 6
      })
    });

    // Configurar el overlay
    this.overlay = new Overlay({
      element: this.popup.nativeElement,
      autoPan: true,
    });
    this.map.addOverlay(this.overlay);

    // Evento para mostrar la etiqueta al pasar el mouse sobre el punto
    this.map.on('pointermove', (event) => {
      const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) { // Verifica si la geometría es un Point
          const coord = geometry.getCoordinates(); // Ahora es seguro llamar a getCoordinates
          const props = feature.getProperties();
          const ciudad = props['ciudad'];
    
          this.overlay?.setPosition(coord);
          this.popupContent.nativeElement.innerHTML = `<strong>${ciudad}</strong>`;
          this.overlay?.setPositioning('top-left');
          this.overlay?.setOffset([0, -10]); // Ajustar posición de la etiqueta
        }
      } else {
        this.overlay?.setPosition(undefined);
      }
    });
  }

  getHeatmapFeatures() {
    // Simulando la obtención de datos de ejemplo
    const data = [
      { lon: -77.0428, lat: -12.0464, weight: 1, ciudad: 'Lima' },
      { lon: -71.5375, lat: -16.409, weight: 1, ciudad: 'Arequipa' },
      { lon: -71.9782, lat: -13.5319, weight: 1, ciudad: 'Cusco' },
      { lon: -80.6328, lat: -5.1945, weight: 1, ciudad: 'Piura' },
      { lon: -79.0059, lat: -8.1091, weight: 1, ciudad: 'Trujillo' }
    ];

    return data.map(point => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lon, point.lat])),
        weight: point.weight,
        ciudad: point.ciudad // Agregar la propiedad ciudad al feature
      });
      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({
            color: 'red'
          })
        })
      }));
      return feature;
    });
  }

  @ViewChild('popupContent', { static: true }) popupContent!: ElementRef;
  @ViewChild('popup', { static: true }) popup!: ElementRef;
}