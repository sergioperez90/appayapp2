import { ITestAppEnvConfiguration } from './../env-configuration/ITestAppEnvConfiguration.d';
import { EnvConfigurationProvider } from 'gl-ionic2-env-configuration';
import { Injectable } from '@angular/core';
import { Headers,Response, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; //esta en el directorio node modules
import { Router } from '@angular/router';
import 'rxjs/Rx'; //para el map, catch, thow...etc
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage } from '@ionic/storage';


export class Ofertas{

    //Constructor(id: number, name: string){ }
}
 
@Injectable()

export class OfertasService {
        environment:ITestAppEnvConfiguration; //objeto que guarda las variables de entorno

    constructor(private http: Http,
                private authHttp: AuthHttp,
                public storage: Storage,
                private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>) { 
                    this.environment = envConfiguration.getConfig();
    }

  
    private ofertasUsuarios;

    //Metodo que busca los productos de una tienda por id de tienda
     getOfertasUsuarios(id: any){
        this.ofertasUsuarios= this.environment["dominio"] + '/oferta/ofertasUsuario?id_usuario='+id;
        return this.authHttp.get(this.ofertasUsuarios).map(this.extractData);
     }

     private ofertasProductos;
     getOfertasProductos(id: any){
        this.ofertasProductos= this.environment["dominio"] + '/oferta/ofertasProducto?id_tienda='+id;
        return this.authHttp.get(this.ofertasProductos).map(this.extractData);
     }


    
    private extractData(res: Response) //el elemento que enviamos es de tipo responde
    {
        if(res.status == 200){
            console.log("Entra Ofertas");
            let body = res.json(); //los parseamos a json
            console.log(body.Ofertas);
            //return body.data || { }; //devolvemos los datos
            return body.Ofertas || { }; 
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