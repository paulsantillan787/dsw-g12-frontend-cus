import { Usuario } from "./usuario";

export interface Paciente {
    id_paciente: number;
    id_usuario: number;
    usuario: Usuario;
}