import { Semaforo } from "./semaforo";

export interface Clasificacion {
    id_clasificacion: number;
    id_tipo_test: number;
    minimo: number;
    maximo: number;
    interpretacion: string;
    id_semaforo: number;

    semaforo: Semaforo
}
