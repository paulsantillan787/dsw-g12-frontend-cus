import { Alternativa } from "./alternativa";
import { Pregunta } from "./pregunta";

export interface Respuesta {
    id_respuesta: number;
    id_test: number;
    id_pregunta: number;
    id_alternativa: number;

    pregunta: Pregunta
    alternativa: Alternativa
}
