import { EnvConfigurationProvider } from 'gl-ionic2-env-configuration';
import { ITestAppEnvConfiguration } from './../env-configuration/ITestAppEnvConfiguration.d';
import { Injectable } from '@angular/core';
import { Headers,Response, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; //esta en el directorio node modules
import { Router } from '@angular/router';
import 'rxjs/Rx'; //para el map, catch, thow...etc
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';

export class Usuario{
    //Constructor(id: number, name: string){ }
    Constructor(){ }
}
 
@Injectable()

export class UsuariosService {
      environment:ITestAppEnvConfiguration; //objeto que guarda las variables de entorno

    constructor(private http: Http, private authHttp: AuthHttp, private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>) {
        this.environment = envConfiguration.getConfig();
    }

    comprobacion(){
        console.log("OK");
    }
    

    getToken(){    
       let headers = new Headers({ 'content-type': 'application/json' });
       headers.append('X-Requested-With', 'XMLHttpRequest');
       let options = new RequestOptions({ headers: headers, withCredentials: true });
       console.log("Entra en el token");
       return this.authHttp.post(this.environment["dominio"] +'/loginjwt/info', "", options)
           .map( response => {
               console.log(response);
              var respJson = response.json();
              return respJson;
           });
           
   }
    
    
     private extractData(res: Response) //el elemento que enviamos es de tipo responde
    {
        console.log("Entra");
        let body = res.json(); //los parseamos a json
       console.log(body.Usuarios);
        //return body.data || { }; //devolvemos los datos
        return body.Usuarios || { };
    }


    private handleError(error: any) //te indica el eror
    {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}