import { UsuariosService } from './usuarios.service';
import { EnvConfigurationProvider } from 'gl-ionic2-env-configuration';
import { ITestAppEnvConfiguration } from './../env-configuration/ITestAppEnvConfiguration.d';
import { Injectable } from '@angular/core';
import { Headers,Response, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; //esta en el directorio node modules
import { Router } from '@angular/router';
import 'rxjs/Rx'; //para el map, catch, thow...etc
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';



export class LineasFactura{
    //Constructor(id: number, name: string){ }
    Constructor(id: string){ }
}
 
@Injectable()

export class FacturasService {
      environment:ITestAppEnvConfiguration; //objeto que guarda las variables de entorno
      id;
    constructor(private usuarioService: UsuariosService, private http: Http, private authHttp: AuthHttp, private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>) {
        this.environment = envConfiguration.getConfig();
    }

    comprobacion(){
        console.log("OK");
    }
        private obtenerFacturas;
     getFacturasUsuario(id: any){ 
        this.obtenerFacturas= this.environment["dominio"] + '/factura/usuario?id='+id;
        return this.authHttp.get(this.obtenerFacturas).map(this.extractData);   
     }
     getFacturasUsuarioFiltro(id: any, minTotal, maxTotal, fechaIni, fechaFin, ordeNombre, ordeFecha, ordeTotal, nombreTienda){

        this.obtenerFacturas= this.environment["dominio"] + '/factura/usuario?id='+id;
        return this.authHttp.get(this.obtenerFacturas).map(this.extractData);   
     }

     
        private lineaFactura;
     getLineaFactura(id: any){
        this.lineaFactura= this.environment["dominio"] + '/factura?id='+id;
        return this.authHttp.get(this.lineaFactura).map(this.extractDataLinea); 
     }

     postFactura(id, total_pagar, id_usuario, linea){
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        let date = new Date();
        return this.authHttp.post(this.environment["dominio"] + '/factura', 
            JSON.stringify({id_tienda:id, total:total_pagar, fecha:date, pagada:1, id_usuario_tienda:id_usuario, linea:linea}), options)
            .delay(+this.environment["timeout"])
            .map((res: Response) => {
                if (res.status === 200) {
                    console.log("Factura añadida correctamente");
                    return [{ status: res.status}]
                }
                console.log(res);
            }).catch((error: any) => {
                console.log(error);
                if(error.status===401){
                     return  [{ status: error.status, json: "Algun dato es erroneo"}]
                }
                //return [{ status: error.status, json: "Error en la conexión con el servidor" }]
                return Observable.throw(new Error(error.status));
            });
     }
     

    
      private extractData(res: Response) //el elemento que enviamos es de tipo responde
    {   console.log(res);
        if(res.status == 200){
            console.log("Entra");
            let body = res.json(); //los parseamos a json
            //console.log(body.Factura);
            //return body.data || { }; //devolvemos los datos
            return body.Factura || { }; 
            //return [{ stores: body.Tiendas, state: res.status}]
        }else if(res.status == 204){
            return res.status;
        }
       
    }

     private extractDataLinea(res: Response) //el elemento que enviamos es de tipo responde
    {   console.log(res);
        if(res.status == 200){
            console.log("Entra");
            let body = res.json(); //los parseamos a json
            //console.log(body.Factura);
            //return body.data || { }; //devolvemos los datos
            return body.Lineas || { }; 
            //return [{ stores: body.Tiendas, state: res.status}]
        }else if(res.status == 204){
            return res.status;
        }
       
    }


    private handleError(error: any) //te indica el eror
    {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}