const BACKEND = 'http://localhost:5000';

export const MODEL = {
    PERSONA: BACKEND + '/personas',
    USUARIO: BACKEND + '/usuarios',
    PACIENTE: BACKEND + '/pacientes',
    TIPO_TEST: BACKEND + '/tipos',
    PREGUNTA: BACKEND + '/preguntas',
    ALTERNATIVA: BACKEND + '/alternativas',
    CLASIFICACION: BACKEND + '/clasificaciones',
    TEST: BACKEND + '/tests',
    RESPUESTA: BACKEND + '/respuestas',
};

export const SERVICE = {
    GET: '/get',
    POST: '/insert',
    PUT: '/update/', // /update/:id_<modelo>
    DELETE: '/delete/', // /delete/:id_<modelo>
    LOGIN: '/login', // para autenticar usuario
    VALIDATOR: '/validator', // para validar si el correo del usuario ya existe
};
