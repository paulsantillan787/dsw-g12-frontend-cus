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

@Component({
  selector: 'app-tests-performed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tests-performed.component.html',
  styleUrl: './tests-performed.component.css'
})
export class TestsPerformedComponent implements OnInit {
<<<<<<< HEAD
  //tests: Test[] = [];
  tests: any[] = [];
  test: any | null = null;
  selectedTest = false;
  tipoTest: TipoTest | null = null;
  vigilancia: Vigilancia | null = null;
    // Para mostrar las respuestas por cada test
  respuestas: any[] = [];
  preguntas: any[] = [];

=======
  tests: Test[] = [];
  test: Test | null = null;
  pacientes: Paciente[] = [];
  paciente: Paciente | null = null;
  respuestas: Respuesta[] = [];
  selectedTest = false;
  tipoTest: TipoTest | null = null;
  preguntasContestadas: {
    pregunta: any;
    alternativa: any;
  }[] = [];
>>>>>>> 991ff903aebf04ece7e00d20c2f8b561370d0989

  //Para la paginación ;D
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedTests: Test[] = [];

  constructor(
    private pacienteService: PacienteService,
    private testService: TestService,
    private respuestaService: RespuestaService,
    private tipoTestService: TipoTestService,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

<<<<<<< HEAD
    

    this.testService.getTestsDTO(payload.id_paciente).subscribe((data: any) => {
      console.log(data.data);
      this.tests = data.data;
      this.paginateTests();   
=======
    this.pacienteService.getPaciente(payload.id_usuario).subscribe((data: any) => {
      this.paciente = data.paciente;

      this.testService.getTestsByPaciente(this.paciente?.id_paciente).subscribe((data: any) => {
        this.tests = data.tests;
        this.paginateTests();
      });
>>>>>>> 991ff903aebf04ece7e00d20c2f8b561370d0989
    });
  }

  getResumen(test: Test) {
    this.getTest(test);
    this.getRespuestas();
  }

  getTest(test: Test) {
    this.selectedTest = true;
    this.test = test;
    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tipoTest = data.tipos_test.find((tipo: TipoTest) => tipo.id_tipo_test === test.id_tipo_test) || null;
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
