export interface Test {
    id_test: number;
    id_tipo_test: number;
    id_paciente: number;
    resultado: number;
    interpretacion: string;
    fecha: Date;
    color: string;
    ansiedad_consignada: string;
    observaciones: string;
    consignado: boolean;
}