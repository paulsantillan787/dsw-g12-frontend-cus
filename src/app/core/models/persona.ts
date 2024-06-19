export interface Persona {
    documento: string;
    tipo_documento: string; //DNI, Pasaporte, Carnet Extranjería, Carnet Universitario
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    telefono: string;
    fecha_nacimiento: Date;
    sexo: string; //M, F, X
}