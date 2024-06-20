const BACKEND = 'https://two41dswgrupo12sisvita.onrender.com';

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
};

export const SERVICE = {
    GET: '/get',
    GETBY: '/get/', // /get/:id_<modelo> o /get/:id_<modelo1>/:id_<modelo2> o /get/:id_<modelo1>/:id_<modelo2>/:id_<modelo3>... etc
    POST: '/insert',
    PUT: '/update/', // /update/:id_<modelo>
    DELETE: '/delete/', // /delete/:id_<modelo>
    LOGIN: '/login', // para autenticar usuario
    VALIDATOR: '/validator', // para validar si el correo del usuario ya existe
};
