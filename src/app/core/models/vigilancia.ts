import { Ansiedad } from "./ansiedad";
import { Tratamiento } from "./tratamiento";

export interface Vigilancia {
    id_vigilancia: number;
    id_ansiedad: number;
    id_tratamiento: number;
    ansiedad: Ansiedad;
    tratamiento: Tratamiento;
}