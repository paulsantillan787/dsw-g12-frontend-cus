import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestView } from '../../core/models/test';
import { TestService } from '../../core/services/test.service';
import { Paciente } from '../../core/models/paciente';
import { PacienteService } from '../../core/services/paciente.service';
import { Respuesta } from '../../core/models/respuesta';
import { RespuestaService } from '../../core/services/respuesta.service';
import { TipoTest } from '../../core/models/tipo_test';
import { TipoTestService } from '../../core/services/tipo-test.service';
import { Pregunta } from '../../core/models/pregunta';
import { PreguntaService } from '../../core/services/pregunta.service';
import { Alternativa } from '../../core/models/alternativa';
import { AlternativaService } from '../../core/services/alternativa.service';

@Component({
  selector: 'app-tests-performed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tests-performed.component.html',
  styleUrl: './tests-performed.component.css'
})
export class TestsPerformedComponent implements OnInit {
  tests: TestView[] = [];
  test: TestView | null = null;
  pacientes: Paciente[] = [];
  paciente: Paciente | null = null;
  respuestas: Respuesta[] = [];
  selectedTest = false;
  tipoTest: TipoTest | null = null;
  preguntasContestadas: {
    pregunta: any;
    alternativa: any;
  }[] = [];

  constructor(
    private pacienteService: PacienteService,
    private testService: TestService,
    private respuestaService: RespuestaService,
    private tipoTestService: TipoTestService,
    private preguntaService: PreguntaService,
    private alternativaService: AlternativaService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

    this.pacienteService.getPacientes().subscribe((data: any) => {
      this.pacientes = data.pacientes;
      this.paciente = this.pacientes.find((paciente) => paciente.id_usuario === payload.id_usuario) || null;

      this.testService.getTests().subscribe((data: any) => {
        this.tests = data.tests;
        this.tests = this.tests.filter((test) => test.id_paciente === this.paciente?.id_paciente);
      });
    });



  }


  getResumen(test:TestView){
    this.getTest(test);
    this.getRespuestas();
  }

  getTest(test: TestView) {
    this.selectedTest = true;
    this.test = test;
    console.log(this.test);
    this.tipoTestService.getTiposTest().subscribe((data: any) => {
      this.tipoTest = data.tipos.find((tipo:TipoTest) => tipo.id_tipo_test === test.id_tipo_test) || null;
      console.log(this.tipoTest);
    });
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


  cancelTest(){
    this.selectedTest = false;
    this.test = null;
    this.respuestas = [];
    this.tipoTest = null;
    this.preguntasContestadas = [];
  }

}
