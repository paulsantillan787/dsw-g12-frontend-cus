import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
//↓ Mapa con OpenLayers
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Heatmap as HeatmapLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

import { TestService } from '../../core/services/test.service';
import { Test } from '../../core/models/test';
import { Ubigeo } from '../../core/models/ubigeo';

import { FormsModule } from '@angular/forms';
import { UbigeoService } from '../../core/services/ubigeo.service';
import { TipoTest } from '../../core/models/tipo_test';
import { TipoTestService } from '../../core/services/tipo-test.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit {
  map: Map = new Map();
  overlay: Overlay | undefined;
  tests: any[] = [];
  testsName: TipoTest[] = [];
  filteredTests: any[] = [];

  // Filtros
  filterTestId: string = 'all';
  filterPacienteId: string = 'all';
  filterConsignado: string = 'all';

  constructor(
    private tipotestService: TipoTestService,
    private testService: TestService,
    private ubigeoService: UbigeoService
  ) {}

  ngOnInit(): void {
    this.tipotestService.getTiposTest().subscribe((data: any) => {
      this.testsName = data.tipos_test;
    });

    this.ubigeoService.getUbigeosDTO().subscribe((data: any) => {
      this.tests = data.tests;
      this.applyFilters();
      this.initializeMap();
    });
  }

  initializeMap(): void {
    // Crear el mapa inicialmente
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.createHeatmapLayer()
      ],
      view: new View({
        center: fromLonLat([-77.0428, -12.0464]), // PO: Coordenadas de Lima
        zoom: 6
      })
    });

    // Configurar el overlay
    this.overlay = new Overlay({
      element: this.popup.nativeElement,
      autoPan: true,
    });
    this.map.addOverlay(this.overlay);

    // ↓ Evento para la etiqueta
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
          this.overlay?.setOffset([0, -10]); //<- Ajustar posición de la etiqueta
        }
      } else {
        this.overlay?.setPosition(undefined);
      }
    });
  }

  createHeatmapLayer() {
    const features = this.getHeatmapFeatures();

    const vectorSource = new VectorSource({
      features: features
    });

    return new HeatmapLayer({
      source: vectorSource,
      blur: 15,
      radius: 10
    });
  }

  getHeatmapFeatures() {
    const ubigeoCount: { [key: string]: { count: number, latitud: number, longitud:number, distrito: String } } = {};

    this.filteredTests.forEach(test => {
      const ubigeo = test.ubigeo;
      if (ubigeoCount[ubigeo]) {
        ubigeoCount[ubigeo].count++;
      } else {
        ubigeoCount[ubigeo] = { count: 1, latitud: test.latitud, longitud: test.longitud, distrito: test.distrito};
      }
    });

    const features: Feature[] = [];
    for (const key in ubigeoCount) {
      if (ubigeoCount.hasOwnProperty(key)) {
        const value = ubigeoCount[key];
        const point = new Feature({
          geometry: new Point(fromLonLat([value.longitud, value.latitud])),
          weight: value.count,
          testsCount: value.count,
          ciudad: `${value.distrito}`
        });
        features.push(point);
      }
    }

    return features;
  }

  applyFilters() {
    this.filteredTests = this.tests.filter(test => {
      const matchesTestId = this.filterTestId === 'all' || test.color === this.filterTestId;
      const matchesPacienteId = this.filterPacienteId === 'all' || test.id_tipo_test.toString() === this.filterPacienteId;
      const matchesConsignado = this.filterConsignado === 'all' || (this.filterConsignado === 'true' && !!test.id_vigilancia) || (this.filterConsignado === 'false' && !test.id_vigilancia);

      return matchesTestId && matchesPacienteId && matchesConsignado;
    });

    this.updateMap();
  }

  updateMap() {
    this.map.getLayers().getArray().slice(1).forEach(layer => this.map.removeLayer(layer));

    this.map.addLayer(this.createHeatmapLayer());
  }

  @ViewChild('popupContent', { static: true }) popupContent!: ElementRef;
  @ViewChild('popup', { static: true }) popup!: ElementRef;
}
