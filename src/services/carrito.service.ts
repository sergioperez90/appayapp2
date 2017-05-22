import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Headers,Response, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; //esta en el directorio node modules
import { Router } from '@angular/router';
import 'rxjs/Rx'; //para el map, catch, thow...etc
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage } from '@ionic/storage';


export class Carrito{

}
 
@Injectable()

export class CarritoService {


    constructor(private http: Http,
                public event:Events,
                public storage: Storage) { 

    }

    //Con esto muestro el total que hay en el icono carrito
    actualizarTotal(cantidad: any){
        this.storage.ready().then(() => {
            this.storage.get('cant_total').then((cant_total) => {
               cant_total += cantidad;
               this.storage.set('cant_total', cant_total);
               console.log('RECIBO: '+cantidad+' CARRO TOTAL: ' + cant_total);
            });
           
        });
    }
    //Es lo mismo que el metodo anterior pero para el carrito
    actualizarTotalCarro(cantidad: any){
         this.storage.ready().then(() => {
            this.storage.get('cant_total').then((cant_total) => {
               this.storage.set('cant_total', cantidad);
               console.log('RECIBO: '+cantidad+' CARRO TOTAL: ' + cant_total);
            });
           
        });
    }
   
   setProductoCarrito(producto: any, cant: any){
        this.storage.get('carrito').then((carrito) => {
            let carro = [];
            let existe = false;
            //Aqui copio todos los productos que tenia antes
                if(carrito != null){
                 for(let i = 0; i<carrito.length; i++){
                     if(carrito[i].codigo == producto.Codigo_producto){
                         existe = true;
                          let productosAnteriores = {
                                id_producto: carrito[i].id_producto,
                                nombre: carrito[i].nombre,
                                codigo: carrito[i].codigo,
                                precio: carrito[i].precio,
                                descripcion: carrito[i].descripcion,
                                imagen: carrito[i].imagen,
                                cantidad: carrito[i].cantidad+cant,
                          };
                         carro.push(productosAnteriores);
                     }else{
                        let productosAnteriores = {
                            id_producto: carrito[i].id_producto,
                            nombre: carrito[i].nombre,
                            codigo: carrito[i].codigo,
                            precio: carrito[i].precio,
                            descripcion: carrito[i].descripcion,
                            imagen: carrito[i].imagen,
                            cantidad: carrito[i].cantidad,
                        };
                        carro.push(productosAnteriores);
                     }
                   
                 }
                }
                
            //Este es el producto nuevo que le paso si no existe
            if(!existe){
                let nuevoProducto = {
                        id_producto: producto.Id_producto_tienda,
                        nombre: producto.Nombre_producto,
                        codigo: producto.Codigo_producto,
                        precio: producto.Precio_producto,
                        descripcion: producto.Descripcion_producto,
                        imagen: producto.Imagen_producto,
                        cantidad: cant,
                };
             carro.push(nuevoProducto);

            }
        
            /*for(let i = 0; i<carro.length; i++){
                console.log(carro[i]);
            }*/
            this.storage.set("carrito", carro);
            this.setTotalPagar();
        });

   }
   //Actualizo el carro cuando modifico la cantidad dentro de el
   updateProductoCarrito(codigo: any, cant: any){
         this.storage.get('carrito').then((carrito) => {
             let carro = [];
             if(carrito != null){
                 for(let i = 0; i<carrito.length; i++){
                        if(carrito[i].codigo == codigo){ //Si es el producto que le paso por parametro
                            let productoAnterior = {
                                id_producto: carrito[i].id_producto,
                                nombre: carrito[i].nombre,
                                codigo: carrito[i].codigo,
                                precio: carrito[i].precio,
                                descripcion: carrito[i].descripcion,
                                imagen: carrito[i].imagen,
                                cantidad: carrito[i].cantidad+cant, //Le sumo o resto la cantidad que le pase
                          };
                         carro.push(productoAnterior);
                        }else{
                            let productoAnterior = {
                                id_producto: carrito[i].id_producto,
                                nombre: carrito[i].nombre,
                                codigo: carrito[i].codigo,
                                precio: carrito[i].precio,
                                descripcion: carrito[i].descripcion,
                                imagen: carrito[i].imagen,
                                cantidad: carrito[i].cantidad,
                          };
                         carro.push(productoAnterior);
                        }
                 }
             }
              this.storage.set("carrito", carro);
              this.setTotalPagar();
         });
   }

   //Eliminar un producto del carro
   deleteProductoCarrito(codigo: any){
        this.storage.get('carrito').then((carrito) => {
             let carro = [];
             let cant_total = 0;
             if(carrito != null){
                 for(let i = 0; i<carrito.length; i++){
                        if(carrito[i].codigo != codigo){ 
                            let productoAnterior = {
                                id_producto: carrito[i].id_producto,
                                nombre: carrito[i].nombre,
                                codigo: carrito[i].codigo,
                                precio: carrito[i].precio,
                                descripcion: carrito[i].descripcion,
                                imagen: carrito[i].imagen,
                                cantidad: carrito[i].cantidad, 
                            };
                            cant_total += carrito[i].cantidad;
                         carro.push(productoAnterior);
                        }
                 }
             }
              this.storage.set("carrito", carro);
              this.actualizarTotalCarro(cant_total);
              this.event.publish('carro:cantidad', cant_total);
              this.setTotalPagar();
         });
   }

   setTotalPagar(){
       this.storage.ready().then(() => {
            this.storage.get('carrito').then((carrito) => {
                let total_pagar=0;
                for(let i = 0; i<carrito.length; i++){
                    total_pagar = total_pagar + (carrito[i].precio*carrito[i].cantidad);
                }
                this.storage.set('total_pagar', total_pagar);
            });

        });
           
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