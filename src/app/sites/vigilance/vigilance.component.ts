import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test } from '../../core/models/test';
import { TestService } from '../../core/services/test.service';
import { TipoTest } from '../../core/models/tipo_test';
import { TipoTestService } from '../../core/services/tipo-test.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Respuesta } from '../../core/models/respuesta';
import { RespuestaService } from '../../core/services/respuesta.service';
import { Ansiedad } from '../../core/models/ansiedad';
import { AnsiedadService } from '../../core/services/ansiedad.service';
import { Tratamiento } from '../../core/models/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { VigilanciaService } from '../../core/services/vigilancia.service';
import { EspecialistaService } from '../../core/services/especialista.service';
import { forkJoin, tap } from 'rxjs';


@Component({
  selector: 'app-vigilance',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './vigilance.component.html',
  styleUrl: './vigilance.component.css'
})
export class VigilanceComponent implements OnInit {
  tests: Test[] = [];
  test: Test | null = null;
  filteredTests: Test[] = [];
  selectedTest = false;
  tipoTest: TipoTest | null = null;

  // Para mostrar las respuestas por cada test
  respuestas: Respuesta[] = [];

  // Listar las ansiedades y si es nueva
  ansiedades: Ansiedad[] = [];
  selectedAnsiedad: string = '';
  isOtherAnsiedad = false;
  newAnsiedad: string = '';

  // Listar los tratamientos y si es nuevo
  tratamientos: Tratamiento[] = [];
  selectedTratamiento: string = '';
  isOtherTratamiento = false;
  newTratamiento: string = '';

  idEspecialista: number = 0;

  // Filtros
  filterTestId: string = '';
  filterPacienteId: string = '';
  filterConsignado: string = '';

  // Para la paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;

  esOpcionConsignar = false;
  constructor(
    private testService: TestService,
    private tipoTestService: TipoTestService,
    private respuestaService: RespuestaService,
    private ansiedadService: AnsiedadService,
    private tratamientoService: TratamientoService,
    private vigilanciaService: VigilanciaService,
    private especialistaService: EspecialistaService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null; 

    this.testService.getTests().subscribe((data: any) => {
      console.log(data.tests);
      this.tests = data.tests;
      this.filteredTests = this.tests;
    });

    this.ansiedadService.getAnsiedades().subscribe((data: any) => {
      this.ansiedades = data.ansiedades;
    });

    this.tratamientoService.getTratamientos().subscribe((data: any) => {
      this.tratamientos = data.tratamientos;
    });

    this.especialistaService.getEspecialistas().subscribe((data: any) => {
      this.idEspecialista = data.especialistas.find((especialista: any) => especialista.id_usuario === payload?.id_usuario).id_especialista;
      console.log(this.idEspecialista);
    });
  }

  ngOnChanges() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTests = this.tests.filter(test => {
      const matchesTestId = !this.filterTestId || test.id_test.toString().includes(this.filterTestId);
      const matchesPacienteId = !this.filterPacienteId || test.id_paciente.toString().includes(this.filterPacienteId);
      const matchesConsignado = !this.filterConsignado || test.id_vigilancia.toString().includes(this.filterConsignado);
      return matchesTestId && matchesPacienteId && matchesConsignado;
    });
  }

  getTest(test: Test) {
    this.selectedTest = true;
    this.esOpcionConsignar = true;
    this.test = test;
    console.log(this.test);
    this.getRespuestas();
    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tipoTest = data.tipos_test.find((tipo: TipoTest) => tipo.id_tipo_test === test.id_tipo_test) || null;
      console.log(this.tipoTest);
    });
  }

  viewTestDetails(test: Test) {
    this.getTest(test);
    this.esOpcionConsignar = false;
  }

  getRespuestas() {
    const id_test = this.test?.id_test;
    this.respuestaService.getRespuestasByTest(id_test).subscribe((data: any) => {
      this.respuestas = data.respuestas;
    });
  }

  cancel() {
    this.selectedTest = false;
    this.test = null;
    this.esOpcionConsignar = false;
    this.resetConsignationOptions();
  }

  resetConsignationOptions() {
    this.selectedAnsiedad = '';
    this.isOtherAnsiedad = false;
    this.newAnsiedad = '';
    this.selectedTratamiento = '';
    this.isOtherTratamiento = false;
    this.newTratamiento = '';
  }

  submitVigilancia(vigilancia:any, testToUpdate: any) {
    this.vigilanciaService.insertVigilancia(vigilancia).subscribe((data: any) => {
      console.log(data);
      testToUpdate.id_vigilancia = data.vigilancia.id_vigilancia;
      this.testService.updateTest(testToUpdate, testToUpdate.id_test).subscribe((data: any) => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Consignación exitosa',
          text: 'La consignación del test se ha realizado con éxito.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.cancel();
          window.location.reload();
        });
      });
    });
  }

  submitConsignation() {
    if (this.test) {
      let testToUpdate = {
        id_test: this.test.id_test,
        id_tipo_test: this.test.id_tipo_test,
        id_paciente: this.test.id_paciente,
        id_clasificacion: this.test.id_clasificacion,
        id_vigilancia: this.test.id_vigilancia,
        resultado: this.test.resultado,
        fecha: this.test.fecha,
      }
  
      let ansiedad = {
        id_especialista: this.idEspecialista,
        contenido: this.newAnsiedad
      };
  
      let tratamiento = {
        recomendacion: this.newTratamiento
      };
  
      const vigilancia = {
        id_ansiedad: this.selectedAnsiedad,
        id_tratamiento: this.selectedTratamiento,
      };
  
      const observables = [];
  
      if (this.isOtherAnsiedad) {
        observables.push(this.ansiedadService.insertAnsiedad(ansiedad).pipe(
          tap((data: any) => vigilancia.id_ansiedad = data.ansiedad.id_ansiedad)
        ));
      }
      if (this.isOtherTratamiento) {
        observables.push(this.tratamientoService.insertTratamiento(tratamiento).pipe(
          tap((data: any) => vigilancia.id_tratamiento = data.tratamiento.id_tratamiento)
        ));
      }
  
      if (observables.length > 0) {
        forkJoin(observables).subscribe(() => {
          console.log('Vigilancia:', vigilancia);
          this.submitVigilancia(vigilancia, testToUpdate);
        });
      } else {
        console.log('Vigilancia:', vigilancia);
        this.submitVigilancia(vigilancia, testToUpdate);
      }
    }
  }
}