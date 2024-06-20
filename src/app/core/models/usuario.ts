export interface Usuario {
    id_usuario: number;
    documento: string;
    correo: string;
    password: string;
}

import { Persona } from "./persona";

export interface UsuarioView {
    id_usuario: number;
    documento: string;
    correo: string;
    password: string;
    persona: Persona;
}
