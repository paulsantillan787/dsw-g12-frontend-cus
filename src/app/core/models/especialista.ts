import { Usuario } from "./usuario";

export interface Especialista {
    id_especialista: number;
    id_usuario: number;
    licencia: string;
    especialidad: string;
    usuario: Usuario;
}