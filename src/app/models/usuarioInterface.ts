export interface usuarioInterface {
    id?: string; // idSerie NO
    nombres?: string;
    apellidos?: string;
    direccion?: {
        direccion: any
    }
        

    descripcion?: string;
    fechaNacimiento?: string;
    listaServicios?: string[];
    celular?: string;
    urlPerfil?: string;
    urlPortada?: string;
    profesion?: string;
    edad?: number;
    experiencia?: string;
    disponibilidad?: string;

}