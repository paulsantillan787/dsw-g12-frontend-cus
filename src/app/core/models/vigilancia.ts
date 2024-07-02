import { Diagnostico } from "./diagnostico";
import { Tratamiento } from "./tratamiento";

export interface Vigilancia {
    id_vigilancia: number;
    id_diagnostico: number;
    id_tratamiento: number;
    observacion: string;
    fundamentacion: string;
    diagnostico: Diagnostico;
    tratamiento: Tratamiento;
}