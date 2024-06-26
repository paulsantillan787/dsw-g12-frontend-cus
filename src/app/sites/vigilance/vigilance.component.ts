import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test } from '../../core/models/test';
import { TestService } from '../../core/services/test.service';
import { TipoTest } from '../../core/models/tipo_test';
import { TipoTestService } from '../../core/services/tipo-test.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Pregunta } from '../../core/models/pregunta';
import { PreguntaService } from '../../core/services/pregunta.service';
import { Alternativa } from '../../core/models/alternativa';
import { AlternativaService } from '../../core/services/alternativa.service';
import { Respuesta } from '../../core/models/respuesta';
import { RespuestaService } from '../../core/services/respuesta.service';
import { NgxPaginationModule } from 'ngx-pagination';


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
  
  //Para mostrar las respuestas por cada test
  respuestas: Respuesta[] = [];
  preguntasContestadas: {
    pregunta: any;
    alternativa: any;
  }[] = [];

  //Si quiere fitrar
  filterTestId: string = '';
  filterPacienteId: string = '';
  filterConsignado: string = '';

  // Para la paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;

  esOpcionConsignar = false;

  ansiedadConsignada: string = '';
  observaciones: string = '';

  constructor(
    private testService: TestService,
    private tipoTestService: TipoTestService,
    private preguntaService: PreguntaService,
    private alternativaService: AlternativaService,
    private respuestaService: RespuestaService
  ) {}

  ngOnInit() {
    this.testService.getTests().subscribe((data:any) => {
      console.log(data.tests);
      this.tests = data.tests;
      this.filteredTests = this.tests;
    });
  }

  ngOnChanges() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTests = this.tests.filter(test => {
      const matchesTestId = !this.filterTestId || test.id_test.toString().includes(this.filterTestId);
      const matchesPacienteId = !this.filterPacienteId || test.id_paciente.toString().includes(this.filterPacienteId);
      return matchesTestId && matchesPacienteId;
    });
  }

  getTest(test: Test) {
    this.selectedTest = true;
    this.esOpcionConsignar = true;
    this.test = test;
    console.log(this.test);
    this.getRespuestas();
    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tipoTest = data.tipos_test.find((tipo:TipoTest) => tipo.id_tipo_test === test.id_tipo_test) || null;
      console.log(this.tipoTest);
    });
  }

  viewTestDetails(test: Test) {
    this.getTest(test);
    this.esOpcionConsignar = false;
  }

  async getRespuestas() {
    this.respuestaService.getRespuestas().subscribe(async (data: any) => {
      const test = this.test;
      this.respuestas = data.respuestas;
      this.respuestas = this.respuestas.filter((respuesta) => respuesta.id_test === test?.id_test);
      for (let respuesta of this.respuestas) {
        const p = await this.getPregunta(respuesta.id_pregunta);
        const a = await this.getAlternativa(respuesta.id_alternativa);
        this.preguntasContestadas.push({
          pregunta: p,
          alternativa: a
        });
      }
      console.log(this.preguntasContestadas);
    });
  }

  getPregunta(id_pregunta: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.preguntaService.getPreguntas().subscribe((data: any) => {
        const pregunta = data.preguntas.find((pregunta:Pregunta) => pregunta.id_pregunta === id_pregunta) || null;
        const contenido = pregunta ? pregunta.contenido : null;
        resolve(contenido);
      });
    });
  }

  getAlternativa(id_alternativa: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alternativaService.getAlternativas().subscribe((data: any) => {
        const alternativa = data.alternativas.find((alternativa:Alternativa) => alternativa.id_alternativa === id_alternativa) || null;
        const contenido = alternativa ? alternativa.contenido : null;
        resolve(contenido);
      });
    });
  }



  cancel() {
    this.selectedTest = false;
    this.test = null;
    this.esOpcionConsignar = false;
    this.preguntasContestadas = [];   
  }

  submitConsignation() {
    if (this.test) {
      console.log(this.ansiedadConsignada, this.observaciones);
      const testToUpdate = {
          id_test: this.test.id_test,
          id_tipo_test: this.test.id_tipo_test,
          id_paciente: this.test.id_paciente,
          resultado: this.test.resultado,
          ansiedad_consignada: this.ansiedadConsignada,
          observaciones: this.observaciones,
          consignado: true
        }

      console.log(testToUpdate, this.test.id_test);
      this.testService.updateTest(testToUpdate, this.test.id_test).subscribe((data: any) => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Consignación exitosa',
          text: 'La consignación del test se ha realizado con éxito.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.cancel();
          this.cancel();
          window.location.reload();
        });
      });
    }
  }

}
