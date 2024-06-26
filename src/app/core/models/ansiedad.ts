import { Especialista } from './especialista';

export interface Ansiedad {
    id_ansiedad: number;
    id_especialista: number;
    contenido: string;
    especialista: Especialista;
}