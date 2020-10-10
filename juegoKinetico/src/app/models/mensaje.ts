
export class Mensaje{

    id: string;
    mensaje: string;
    usuario: string;
    fecha: string;
    timestamp: number;
    grupo:string;

    constructor( mensaje:string, usuario:string, fecha:string, timestamp:number, grupo: string ,id?:string ){
        this.mensaje = mensaje;
        this.usuario = usuario;
        this.fecha = fecha;
        this.grupo = grupo;
        this.timestamp = timestamp;
        if(id){
            this.id = id;
        }

    }
}