import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test } from '../../core/models/test';
import { TestService } from '../../core/services/test.service';
import { Paciente } from '../../core/models/paciente';
import { PacienteService } from '../../core/services/paciente.service';
import { Respuesta } from '../../core/models/respuesta';
import { RespuestaService } from '../../core/services/respuesta.service';
import { TipoTest } from '../../core/models/tipo_test';
import { TipoTestService } from '../../core/services/tipo-test.service';
import { VigilanciaService } from '../../core/services/vigilancia.service';
import { Vigilancia } from '../../core/models/vigilancia';

@Component({
  selector: 'app-tests-performed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tests-performed.component.html',
  styleUrl: './tests-performed.component.css'
})
export class TestsPerformedComponent implements OnInit {
  //tests: Test[] = [];
  tests: any[] = [];
  test: any | null = null;
  selectedTest = false;
  tipoTest: TipoTest | null = null;
  vigilancia: Vigilancia | null = null;
    // Para mostrar las respuestas por cada test
  respuestas: any[] = [];
  preguntas: any[] = [];


  //Para la paginación ;D
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedTests: Test[] = [];

  constructor(
    private pacienteService: PacienteService,
    private testService: TestService,
    private respuestaService: RespuestaService,
    private tipoTestService: TipoTestService,
    private vigilanciaService: VigilanciaService,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

    

    this.testService.getTestsDTO(payload.id_paciente).subscribe((data: any) => {
      console.log(data.data);
      this.tests = data.data;
      this.paginateTests();   
    });
  }

  getResumen(test:any ) {
    this.getTest(test);

    if(this.test.id_vigilancia != null){
      this.vigilanciaService.getVigilanciById(this.test.id_test).subscribe(
        (data: any) => {
          this.vigilancia = data.vigilancia;
          console.log(data.vigilancia);
        });
    }
 
    console.log("afuera : " + this.vigilancia);
    console.log(test)
    this.getRespuestas();
  }

  getTest(test: any) {
    this.selectedTest = true;
    this.test = test;
    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tipoTest = data.tipos_test.find((tipo: TipoTest) => tipo.nombre === test.tipo_test) || null;
    });
  }
/*
  getRespuestas() {
    const id_test = this.test?.id_test;
      this.respuestaService.getRespuestasByTest(id_test).subscribe((data: any) => {
        this.respuestas = data.respuestas;
      });
  }*/

  getRespuestas() {
    this.respuestaService.getRespuestasDTO(this.test.id_test).subscribe((data: any) => {
      this.respuestas = data.resumen.alternativas_marcadas;
      this.preguntas = data.resumen.preguntas_planteadas;
    });
  }

  cancelTest() {
    this.selectedTest = false;
    this.test = null;
    this.vigilancia = null;
    this.respuestas = [];
    this.tipoTest = null;
  }



  
  // ↓ Métodos para la paginación
  paginateTests() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTests = this.tests.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.paginateTests();
  }

  get totalPages() {
    return Math.ceil(this.tests.length / this.itemsPerPage);
  }
}
