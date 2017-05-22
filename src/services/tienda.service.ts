import { EnvConfigurationProvider } from 'gl-ionic2-env-configuration';
import { ITestAppEnvConfiguration } from './../env-configuration/ITestAppEnvConfiguration.d';
import { Injectable } from '@angular/core';
import { Headers,Response, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; //esta en el directorio node modules
import { Router } from '@angular/router';
import 'rxjs/Rx'; //para el map, catch, thow...etc
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage } from '@ionic/storage';


export class Tienda{

    //Constructor(id: number, name: string){ }
    Constructor(Id_Tienda: string, NIF: string, Nombre: string, Direccion: string, Municipio:string, Provincia:string,Comunidad:string, Latitud:string, Longitud:string, Id_gran_superficie:string, Estado:string, Eliminado: string, Foto:string, Descripcion:string, Horario:string, ){ }
}
 
@Injectable()

export class TiendasService {
      environment:ITestAppEnvConfiguration; //objeto que guarda las variables de entorno


    constructor(private http: Http,
                 private authHttp: AuthHttp,
                public storage: Storage,
                private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>) { 
         this.environment = envConfiguration.getConfig();
    }

    comprobacion(){
        console.log("OK");
    }
    private obtenerTienda;

    //Metodo que busca la tienda
     buscarTienda(id: any, usuario:any){
        //this.obtenerTienda= this.environment["dominio"]+"/tienda?id="+id;
        this.obtenerTienda=this.environment["dominio"]+"/usuario/entraTienda?id_tienda="+id+"&id_usuario="+usuario;
       
        return this.authHttp.get(this.obtenerTienda).map(this.extractData);
     }

     setTiendaStorage(tiendas: Observable<Tienda>){
        this.storage.ready().then(() => {
        this.storage.set('tienda', tiendas[0]); //Guardamos todo el objeto de la tienda
        
       /* this.storage.get('tienda').then((tienda) => {
            console.log('ESTO ES TODA LA TIENDA ' + tienda.Id_Tienda);
        });*/
        });
     }


    
     private extractData(res: Response) //el elemento que enviamos es de tipo responde
    {   console.log(res);
        if(res.status == 200){
            console.log("Entra");
            let body = res.json(); //los parseamos a json
            console.log(body.Tiendas);
            //return body.data || { }; //devolvemos los datos
            return body.Tiendas || { }; 
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