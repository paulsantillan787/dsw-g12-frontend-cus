export interface Paciente {
    id_paciente: number;
    id_usuario: number;
}

import { UsuarioView } from "./usuario";

export interface PacienteView {
    id_paciente: number;
    id_usuario: number;
    usuario: UsuarioView;
}