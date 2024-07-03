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
import { Diagnostico } from '../../core/models/diagnostico';
import { DiagnosticoService } from '../../core/services/diagnostico.service';
import { Tratamiento } from '../../core/models/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { VigilanciaService } from '../../core/services/vigilancia.service';
import { forkJoin, tap } from 'rxjs';
import { Vigilancia } from '../../core/models/vigilancia';


@Component({
  selector: 'app-vigilance',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './vigilance.component.html',
  styleUrl: './vigilance.component.css'
})
export class VigilanceComponent implements OnInit {
  tests: any[] = [];
  test: any | null = null;
  vigilancia: Vigilancia | null = null;
  filteredTests: any[] = [];
  selectedTest = false;
  tipoTest: TipoTest | null = null;
  tipos: TipoTest[] = [];
  // Para mostrar las respuestas por cada test
  respuestas: any[] = [];
  preguntas: any[] = [];

  // Listar las ansiedades y si es nueva
  diagnosticos: Diagnostico[] = [];
  selectedDiagnostico: string = '';
  isOtherAnsiedad = false;
  newAnsiedad: string = '';
  fundamentacionAnsiedad: string = '';

  // Listar los tratamientos y si es nuevo
  tratamientos: Tratamiento[] = [];
  selectedTratamiento: string = '';
  isOtherTratamiento = false;
  newTratamiento: string = '';
  fundamentacionTratamiento: string = '';

  //Para certificar el mismo test
  observacion: string = '';
  fundamentacion: string = '';

  // Filtros
  filterTestId: string = 'all'; // Por defecto se muestran todos
  filterPacienteId: string = 'all'; // Por defecto se muestran todos
  filterConsignado: string = 'all'; // Por defecto se muestran todos

  // Para la paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;

  esOpcionConsignar = false;

  constructor(
    private testService: TestService,
    private tipoTestService: TipoTestService,
    private respuestaService: RespuestaService,
    private diagnosticoService: DiagnosticoService,
    private tratamientoService: TratamientoService,
    private vigilanciaService: VigilanciaService,
  ) {}

  ngOnInit() {
    this.vigilanciaService.getVigilanciasDTO().subscribe((data: any) => {
      console.log(data.tests);
      this.tests = data.tests;
      console.log(this.tests)
      this.filteredTests = this.tests;
    });

    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tipos = data.tipos_test;
    });

    this.diagnosticoService.getDiagnosticos().subscribe((data: any) => {
      this.diagnosticos = data.diagnosticos;
    });

    this.tratamientoService.getTratamientos().subscribe((data: any) => {
      this.tratamientos = data.tratamientos;
    });
  }

  ngOnChanges() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTests = this.tests.filter(test => {
      const matchesTestId = this.filterTestId === 'all' || test.clasificacion.semaforo.color === this.filterTestId;
      const matchesPacienteId = this.filterPacienteId === 'all' || test.id_tipo_test.toString() === this.filterPacienteId;
      const matchesConsignado = this.filterConsignado === 'all' || (this.filterConsignado === 'true' && test.id_vigilancia) || (this.filterConsignado === 'false' && !test.id_vigilancia);

      return matchesTestId && matchesPacienteId && matchesConsignado;
    });
  }

  getTest(test: any) {
    const id_vigilancia = test.consignacion
    this.selectedTest = true;
    this.esOpcionConsignar = true;
    if (id_vigilancia != null)
      this.vigilanciaService.getVigilanciById(id_vigilancia).subscribe((data: any) => {
        this.vigilancia = data.vigilancia;
        console.log(this.vigilancia);
      });

    this.getRespuestas(test);
  }

  viewTestDetails(test: any) {
    this.test = test;
    this.getTest(this.test);
    this.esOpcionConsignar = false;
    console.log(this.respuestas);
  }

  getRespuestas(test: any) {
    const id_test = test.id_test;
    console.log(id_test)
    this.respuestaService.getRespuestasDTO(id_test).subscribe((data: any) => {
      this.respuestas = data.resumen.alternativas_marcadas;
      this.preguntas = data.resumen.preguntas_planteadas;
    });
  }

  cancel() {
    this.selectedTest = false;
    this.test = null;
    this.esOpcionConsignar = false;
    this.resetConsignationOptions();
  }

  resetConsignationOptions() {
    this.selectedDiagnostico = '';
    this.isOtherAnsiedad = false;
    this.newAnsiedad = '';
    this.selectedTratamiento = '';
    this.isOtherTratamiento = false;
    this.newTratamiento = '';
    this.preguntas = [];
    this.respuestas = [];
    this.vigilancia = null;
  }

  submitVigilancia(vigilancia: any, testToUpdate: any) {
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

      let diagnostico = {
        descripcion: this.newAnsiedad,
        fundamentacion: this.fundamentacionAnsiedad
      };

      let tratamiento = {
        descripcion: this.newTratamiento,
        fundamentacion: this.fundamentacionTratamiento
      };

      const vigilancia = {
        id_diagnostico: this.selectedDiagnostico,
        id_tratamiento: this.selectedTratamiento,
        observacion: this.observacion,
        fundamentacion: this.fundamentacion,
      };

      console.log(diagnostico);
      console.log(tratamiento);
      console.log(vigilancia);

      const observables = [];

      if (this.isOtherAnsiedad) {
        observables.push(this.diagnosticoService.insertDiagnostico(diagnostico).pipe(
          tap((data: any) => vigilancia.id_diagnostico = data.diagnostico.id_diagnostico)
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
