import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Paciente } from '../../core/models/paciente';
import { PacienteService } from '../../core/services/paciente.service';
import { TipoTest } from '../../core/models/tipo_test';
import { TipoTestService } from '../../core/services/tipo-test.service';
import { Pregunta } from '../../core/models/pregunta';
import { PreguntaService } from '../../core/services/pregunta.service';
import { Alternativa } from '../../core/models/alternativa';
import { AlternativaService } from '../../core/services/alternativa.service';
import { Clasificacion } from '../../core/models/clasificacion';
import { ClasificacionService } from '../../core/services/clasificacion.service';
import { Test } from '../../core/models/test';
import { TestService } from '../../core/services/test.service';
import { RespuestaService } from '../../core/services/respuesta.service';
import Swal from 'sweetalert2';
import { Semaforo } from '../../core/models/semaforo';
import { SemaforoService } from '../../core/services/semaforo.service';

@Component({
  selector: 'app-select-test',
  standalone: true,
  imports: [CommonModule],
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
  date: Date = new Date();
  pacientes: Paciente[] = [];
  paciente: Paciente | null = null;
  clasificaciones: Clasificacion[] = [];
  tests: Test[] = [];
  semaforos: Semaforo[] = [];

  constructor(
    private router: Router,
    private tipoTestService: TipoTestService,
    private preguntaService: PreguntaService,
    private alternativaService: AlternativaService,
    private pacienteService: PacienteService,
    private clasificacionService: ClasificacionService,
    private testService: TestService,
    private semaforoService: SemaforoService,
    private respuestaService: RespuestaService
  ) {}

  ngOnInit() {
    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tiposTest = data.tipos_test;
    });
  }

  selectTest(test: TipoTest) {
    this.isTestSelected = true;
    this.selectedTest = test;

    console.log('Test seleccionado:', test);

    this.preguntaService.getPreguntas().subscribe((data:any) => {
      this.preguntas = data.preguntas
      this.preguntas = this.preguntas.filter(preguntas => preguntas.id_tipo_test === test.id_tipo_test);
    });

    this.alternativaService.getAlternativas().subscribe((data:any) => {
      this.alternativas = data.alternativas
      this.alternativas = this.alternativas.filter(alternativas => alternativas.id_tipo_test === test.id_tipo_test);
    });

    this.clasificacionService.getClasificaciones().subscribe((data: any) => {
      this.clasificaciones = data.clasificaciones;
      this.clasificaciones = this.clasificaciones.filter(clasificacion => clasificacion.id_tipo_test === test.id_tipo_test);
    });

    this.semaforoService.getSemaforos().subscribe((data: any) => {
      this.semaforos = data.semaforos;
    });

  }

  cancelTest() {
    this.isTestSelected = false;
    this.selectedTest = null;
    this.preguntas = [];
    this.alternativas = [];
    this.clasificaciones = [];
  }

  calculateResult() {
    let result = 0;

    this.preguntas.forEach((pregunta) => {
      const selectedOption = (document.querySelector(`input[name="pregunta${pregunta.id_pregunta}"]:checked`) as HTMLInputElement);

      if (selectedOption) {
        const idAlternativa = parseInt(selectedOption.value, 10);
        const alternativa = this.alternativas.find((alternativa) => alternativa.id_alternativa === idAlternativa);

        if (alternativa) {
          result += alternativa.puntaje;
        }
      }
    });

    console.log('Resultado:', result);
    return result;
  }

  calculateInterpretacion() {
    const result = this.calculateResult();

    const clasificacion = this.clasificaciones.find(clasif => {
      return result >= clasif.minimo && result <= clasif.maximo;
    });
    return clasificacion ? clasificacion.interpretacion : '';
  }

  getIdSemaforo() {
    const result = this.calculateResult();
    const clasificacion = this.clasificaciones.find(clasif => {
      return result >= clasif.minimo && result <= clasif.maximo;
    });
    return clasificacion ? clasificacion.id_semaforo : '';
  }

  getColor(){
    const getIdSemaforo = this.getIdSemaforo();
    const semaforo = this.semaforos.find(semaforo => semaforo.id_semaforo === getIdSemaforo);
    console.log(semaforo?.color);
    return semaforo?.color;
  }

  async generateTestJson() {
    const respuestas:any[] = [];
    let allAnswered = true;

    for (const pregunta of this.preguntas) {
      const selectedOption = (document.querySelector(`input[name="pregunta${pregunta.id_pregunta}"]:checked`) as HTMLInputElement);
  
      if (selectedOption) {
        const idAlternativa = parseInt(selectedOption.value, 10);
        respuestas.push({
          id_test: 0,
          id_pregunta: pregunta.id_pregunta,
          id_alternativa: idAlternativa
        });
      } else {
        allAnswered = false;
      }
    }

    if (allAnswered) {
      const result = this.calculateResult();
      const interpretacion = this.calculateInterpretacion();
      const color = this.getColor();
      const id_tipo_test = this.selectedTest?.id_tipo_test;
      const token = localStorage.getItem('token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      this.date.setHours(this.date.getHours() - 5);
      this.pacienteService.getPacientes().subscribe((data: any) => {
        this.pacientes = data.pacientes;
        this.paciente = this.pacientes.find((paciente) => paciente.id_usuario === payload.id_usuario) || null;
        const testResult = {
          id_tipo_test: id_tipo_test,
          id_paciente: this.paciente?.id_paciente,
          resultado: result,
          interpretacion: interpretacion,
          color: color,
          fecha: this.date.toISOString().slice(0,19),
          ansiedad_consignada: "Por consignar",
          observaciones: "Por detallar",
          consignado: false
        };
        console.log(JSON.stringify(testResult, null, 2));

        this.testService.insertTest(testResult).subscribe((data: any) => {
          console.log(data.message);
          const id_test = data.test.id_test;
          respuestas.forEach((respuesta) => {
            respuesta.id_test = id_test;
            console.log(JSON.stringify(respuesta, null, 2));
            this.respuestaService.insertRespuesta(respuesta).subscribe((data: any) => {
              console.log(data.message);
            });
          });
          Swal.fire({
            title: '¡Test enviado!',
            text: 'Su resultado es: ' + interpretacion,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.cancelTest();
          this.router.navigate(['../tests-performed']);
        });
      });
    } else {
      alert('Por favor, responda todas las preguntas');
    }
  }

}
