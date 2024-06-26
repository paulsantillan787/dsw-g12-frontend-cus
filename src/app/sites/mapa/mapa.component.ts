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

import { TestService } from '../../core/services/test.service';
import { Test } from '../../core/models/test';
import { Ubigeo } from '../../core/models/ubigeo';

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
  tests: Test[] = [];

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.testService.getTests().subscribe((data: any) => {
      this.tests = data.tests;
      this.initializeMap();
    });
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
        if (geometry instanceof Point) {
          const coord = geometry.getCoordinates();
          const props = feature.getProperties();
          const testsCount = props['testsCount'];
          const ciudad = props['ciudad'];
    
          this.overlay?.setPosition(coord);
          this.popupContent.nativeElement.innerHTML = `<strong>${ciudad}</strong><br/>Tests realizados: ${testsCount}`;
          this.overlay?.setPositioning('top-left');
          this.overlay?.setOffset([0, -10]); // Ajustar posición de la etiqueta
        }
      } else {
        this.overlay?.setPosition(undefined);
      }
    });
  }

  getHeatmapFeatures() {
    // Agrupar los tests por Ubigeo y contar cuántos hay en cada ubicación
    const ubigeoCount: { [key: string]: { count: number, ubigeo: Ubigeo } } = {};

    this.tests.forEach(test => {
      const ubigeo = test.paciente.usuario.persona.ubigeo;
      if (ubigeoCount[ubigeo.id_ubigeo]) {
        ubigeoCount[ubigeo.id_ubigeo].count++;
      } else {
        ubigeoCount[ubigeo.id_ubigeo] = { count: 1, ubigeo: ubigeo };
      }
    });

    // Convertir los datos agrupados en características para el heatmap
    const features: Feature[] = [];
    for (const key in ubigeoCount) {
      if (ubigeoCount.hasOwnProperty(key)) {
        const value = ubigeoCount[key];
        const point = new Feature({
          geometry: new Point(fromLonLat([value.ubigeo.longitud, value.ubigeo.latitud])),
          weight: value.count, // Utiliza la cantidad de tests como peso
          testsCount: value.count, // Para mostrar en el tooltip
          //ciudad: `${value.ubigeo.departamento} - ${value.ubigeo.provincia} - ${value.ubigeo.distrito}`,
          ciudad:`${value.ubigeo.distrito}`
        });
        features.push(point);
      }
    }

    return features;
  }

  @ViewChild('popupContent', { static: true }) popupContent!: ElementRef;
  @ViewChild('popup', { static: true }) popup!: ElementRef;
}