import { ITestAppEnvConfiguration } from './../env-configuration/ITestAppEnvConfiguration.d';
import { EnvConfigurationProvider } from 'gl-ionic2-env-configuration';
import { Injectable } from '@angular/core';
import { Headers,Response, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; //esta en el directorio node modules
import { Router } from '@angular/router';
import 'rxjs/Rx'; //para el map, catch, thow...etc
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage } from '@ionic/storage';


export class Productos{

    //Constructor(id: number, name: string){ }
}
 
@Injectable()

export class ProductosService {
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
    private obtenerProductos;

    //Metodo que busca los productos de una tienda por id de tienda
     buscarProductosTienda(id_tienda: any, cod_producto: any){
        this.obtenerProductos= this.environment["dominio"] + '/producto?id_tienda='+id_tienda+'&codigo='+cod_producto;
        console.log(this.obtenerProductos);
        return this.authHttp.get(this.obtenerProductos).map(this.extractData);
     }


     //Metodo que busca el producto y lo añade a Storage
     setProductoStorage(producto: Observable<Productos>){
       this.storage.ready().then(() => {
        this.storage.set('producto', producto[0]); //Guardamos el producto de la tienda
        
        });

     }



     setProductoCarrito(id: any){
       
        
     }
    
    private extractData(res: Response) //el elemento que enviamos es de tipo responde
    {
        if(res.status == 200){
            console.log("Entra");
            let body = res.json(); //los parseamos a json
            console.log(body.Productos);
            //return body.data || { }; //devolvemos los datos
            return body.Productos || { }; 
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