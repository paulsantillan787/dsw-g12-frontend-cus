const BACKEND = 'http://localhost:5000';

export const MODEL = {
    UBIGEO: BACKEND + '/ubigeos',
    PERSONA: BACKEND + '/personas',
    USUARIO: BACKEND + '/usuarios',
    PACIENTE: BACKEND + '/pacientes',
    ESPECIALISTA: BACKEND + '/especialistas',
    TIPO_TEST: BACKEND + '/tipos',
    PREGUNTA: BACKEND + '/preguntas',
    ALTERNATIVA: BACKEND + '/alternativas',
    CLASIFICACION: BACKEND + '/clasificaciones',
    SEMAFORO: BACKEND + '/semaforos',
    TEST: BACKEND + '/tests',
    RESPUESTA: BACKEND + '/respuestas',
    VIGILANCIA: BACKEND + '/vigilancias',
    DIAGNOSTICO: BACKEND + '/diagnosticos',
    TRATAMIENTO: BACKEND + '/tratamientos',
    //PARA LOS MENSAJES
    EMAIL: BACKEND + '/email',
};

export const SERVICE = {
    DTO: '/dto',   // Para extraer informacion exacta, sin filtros (en este caso primero se coloca el servicio tdo y luego el modelo, ejemplo: /tdo/vigilancia)
    GET: '/get',
    GETBY: '/get/', // /get/:id_<modelo> o /get/:id_<modelo1>/:id_<modelo2> o /get/:id_<modelo1>/:id_<modelo2>/:id_<modelo3>... etc
    POST: '/insert',
    PUT: '/update/', // /update/:id_<modelo>
    DELETE: '/delete/', // /delete/:id_<modelo>
    LOGIN: '/login', // para autenticar usuario
    VALIDATOR: '/validator', // para validar si el correo del usuario ya existe
};
