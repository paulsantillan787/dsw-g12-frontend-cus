import { TipoTest } from "./tipo_test";
import { Paciente } from "./paciente";
import { Clasificacion } from "./clasificacion";
import { Vigilancia } from "./vigilancia";

export interface Test {
    id_test: number;
    id_tipo_test: number;
    id_paciente: number;
    id_clasificacion: number;
    id_vigilancia: number;
    resultado: number;
    fecha: Date;
    tipo_test: TipoTest;
    paciente: Paciente;
    clasificacion: Clasificacion;
    vigilancia: Vigilancia;
}