export interface Especialista {
    id_especialista: number;
    id_usuario: number;
    licencia: string;
    especialidad: string;
}

import { UsuarioView } from "./usuario";

export interface EspecialistaView {
    id_especialista: number;
    id_usuario: number;
    licencia: string;
    especialidad: string;
    usuario: UsuarioView;
}
