import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, Form, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoTest } from '../../core/models/tipo_test';
import { TipoTestService } from '../../core/services/tipo-test.service';
import { Pregunta } from '../../core/models/pregunta';
import { PreguntaService } from '../../core/services/pregunta.service';
import { Alternativa } from '../../core/models/alternativa';
import { AlternativaService } from '../../core/services/alternativa.service';
import { Test } from '../../core/models/test';
import { TestService } from '../../core/services/test.service';
import { RespuestaService } from '../../core/services/respuesta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-select-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './select-test.component.html',
  styleUrl: './select-test.component.css'
})
export class SelectTestComponent implements OnInit {
  tiposTest: TipoTest[] = [];
  selectedTest: TipoTest | null = null;
  preguntas: Pregunta[] = [];
  alternativas: Alternativa[] = [];
  isTestSelected = false;
  preguntasDelTest: Pregunta[] = [];
  puntajesDelTest: number[] = [];
  date: Date = new Date();
  tests: Test[] = [];
  testForm: FormGroup;
  respuestasArray: number[] = [];

  counter = 0;

  constructor(
    private router: Router,
    private tipoTestService: TipoTestService,
    private preguntaService: PreguntaService,
    private alternativaService: AlternativaService,
    private testService: TestService,
    private respuestaService: RespuestaService,
    private fb: FormBuilder
  ) {
    this.testForm = this.fb.group({});
  }

  ngOnInit() {
    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tiposTest = data.tipos_test;
    });
  }

  selectTest(test: TipoTest) {
    this.isTestSelected = true;
    this.selectedTest = test;
    console.log("Selected test:", test);

    this.preguntaService.getPreguntasByTipoTest(test.id_tipo_test).subscribe((data:any) => {
      this.preguntas = data.preguntas
      this.cargarFormulario(this.preguntas);
      this.preguntasDelTest = this.preguntas;
    });

    this.alternativaService.getAlternativasByTipoTest(test.id_tipo_test).subscribe((data:any) => {
      this.alternativas = data.alternativas
    });
  }

  cargarFormulario(preguntas: Pregunta[]) {
    preguntas.forEach((pregunta, index) => {
      this.testForm.addControl('pregunta' + pregunta.id_pregunta, new FormControl('', Validators.required));
    });
  }


  cancelTest() {
    this.isTestSelected = false;
    this.selectedTest = null;
    this.preguntas = [];
    this.alternativas = [];
    this.counter = 0;
    this.testForm.reset();
    this.preguntasDelTest = [];
    this.puntajesDelTest = [];
    this.respuestasArray = [];
  }

  getPuntajePorAlternativa(alterntivas: any[]) {
    this.respuestasArray = Object.values(this.testForm.value);
    this.preguntasDelTest.forEach((pregunta, index) => {
      const alternativa = this.alternativas.find(alternativa => alternativa.id_alternativa === this.respuestasArray[index]);
      if (alternativa) {
        this.puntajesDelTest.push(alternativa.puntaje);
      }
    });
  }

  generarRespuestasJSON(id_test: any) {
    const preguntas = this.preguntasDelTest;
    console.log('Preguntas:', preguntas);

    const JSONRespuestas = {
      id_test: null as any,
      marcadas: [] as { id_pregunta: number, id_alternativa: number }[]
    };
    JSONRespuestas.id_test = id_test;
    this.respuestasArray.forEach((respuesta, index) => {
      console.log(index);
      JSONRespuestas.marcadas.push({
        id_pregunta: preguntas[index].id_pregunta,
        id_alternativa: respuesta
      });
    });
    console.log(JSONRespuestas);
    this.respuestaService.insertRespuesta(JSONRespuestas).subscribe((data: any) => {
      console.log(data.message);
    }, (error: any) => {
      console.log(error);
    })
  }

  async generateTestJson() {
    const PuntajesPorAlternativa:any[] = [];

    if (this.testForm.valid) {
      this.getPuntajePorAlternativa(this.alternativas);
      console.log("selectedTest2:", this.selectedTest);
      const id_tipo_test = this.selectedTest?.id_tipo_test;
      const token = localStorage.getItem('token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      this.date.setHours(this.date.getHours() - 5);
      const testToSend = {
        id_tipo_test: id_tipo_test,
        id_paciente: payload.id_paciente,
        fecha: this.date.toISOString().slice(0,19),
        puntajes: this.puntajesDelTest,
        id_vigilancia: null
      }

      console.log('Test a enviar:', testToSend);

      this.testService.insertTest(testToSend).subscribe((data: any) => {
        console.log(data.message);
        const test = data.test;
        const id_test = data.test.id_test;
        this.generarRespuestasJSON(id_test);
        Swal.fire({
          title: '¡Test enviado!',
          text: 'Su resultado es: ' + test.clasificacion,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.cancelTest();
          this.router.navigate(['../tests-performed']);
        });
      }, (error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo enviar el test',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
    } else {
      alert('Por favor, responda todas las preguntas');
    }
  }
}
