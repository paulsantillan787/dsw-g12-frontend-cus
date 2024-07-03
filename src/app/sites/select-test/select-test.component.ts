import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  tests: Test[] = [];

  counter = 0;
  loading = false;

  constructor(
    private router: Router,
    private tipoTestService: TipoTestService,
    private preguntaService: PreguntaService,
    private alternativaService: AlternativaService,
    private testService: TestService,
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

    this.preguntaService.getPreguntasByTipoTest(test.id_tipo_test).subscribe((data:any) => {
      this.preguntas = data.preguntas
    });

    this.alternativaService.getAlternativasByTipoTest(test.id_tipo_test).subscribe((data:any) => {
      this.alternativas = data.alternativas
    });
  }

  cancelTest() {
    this.isTestSelected = false;
    this.selectedTest = null;
    this.preguntas = [];
    this.alternativas = [];
    this.counter = 0;
    this.loading = false;
  }

  getPuntajePorAlternativa(idAlternativa: number) {
    const alternativa = this.alternativas.find((alternativa) => alternativa.id_alternativa === idAlternativa);
    return alternativa ? alternativa.puntaje : 0;
  }

  async generateTestJson() {
    const respuestas:any[] = [];
    const PuntajesPorAlternativa:any[] = [];
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
        PuntajesPorAlternativa.push(this.getPuntajePorAlternativa(idAlternativa))
      } else {
        allAnswered = false;
      }
    }

    if (allAnswered) {
      this.loading = true;
      const id_tipo_test = this.selectedTest?.id_tipo_test;
      const token = localStorage.getItem('token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      this.date.setHours(this.date.getHours() - 5);
      const testToSend = {
        id_tipo_test: id_tipo_test,
        id_paciente: payload.id_paciente,
        fecha: this.date.toISOString().slice(0,19),
        puntajes: PuntajesPorAlternativa,
        id_vigilancia: null
      }

      console.log('Test a enviar:', testToSend);

      this.testService.insertTest(testToSend).subscribe((data: any) => {
        console.log(data.message);
        const test = data.test;
        const id_test = data.test.id_test;
        respuestas.forEach((respuesta) => {
          respuesta.id_test = id_test;
          this.respuestaService.insertRespuesta(respuesta).subscribe((data: any) => {
            this.counter++;
            console.log(this.counter);
            if(this.counter == respuestas.length){
              console.log('Todas las respuestas enviadas');
              console.log(test);
              console.log(test.clasificacion);
              Swal.fire({
                title: '¡Test enviado!',
                text: 'Su resultado es: ' + test.clasificacion.interpretacion,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.cancelTest();
              this.router.navigate(['../tests-performed']);
            }
          });
        });
      });
    } else {
      alert('Por favor, responda todas las preguntas');
    }
  }
}
