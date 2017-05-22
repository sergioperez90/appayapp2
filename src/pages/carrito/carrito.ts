import { Productos } from './../../services/productos.service';
import { CarritoService } from './../../services/carrito.service';
import { PagoPage } from './../pago/pago';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Events, Alert } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Carrito page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html'
})
export class CarritoPage {
  
  cart=[];
  total_pagar = 0;
  vacio = true;
  cant_total;
  escero = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public events: Events, public carritoService: CarritoService, public storage: Storage) {

  }



  ngOnInit(){
    this.storage.ready().then(() => {
       this.storage.get('cant_total').then((cant_total) => {
              this.cant_total = cant_total;
        });
    });
    //Aqui cargo el carro
     this.storage.get('carrito').then((carrito) => {
              if(carrito != null){
                  for(let i = 0; i<carrito.length; i++){
                        let productos = {
                            nombre: carrito[i].nombre,
                            codigo: carrito[i].codigo,
                            precio: carrito[i].precio,
                            descripcion: carrito[i].descripcion,
                            imagen: carrito[i].imagen,
                            cantidad: carrito[i].cantidad,
                        };
                        this.cart.push(productos);
                    }
                    for(let i = 0; i<this.cart.length; i++){
                        console.log(this.cart[i]);
                    }
                    this.vacio = false; //Ahora ya no se muestra el mensaje Tu Carrito esta vacio
              }
                    
            });
          //Aqui cargo el total a pagar
           this.storage.get('total_pagar').then((total) => {
             if(total != null)
              this.total_pagar = total;
              else
              this.total_pagar = 0;
              
           });

           //Si esta vacio muestro el dibujo de Tu carro esta vacio
           this.storage.get('cant_total').then((total) => {
             if(total == 0)
             this.vacio = true;
              else
              this.vacio = false;
              
           });
           

  }

  //Metodo que incrementa la cantidad de un producto
  increment(codigo: any) {
    this.escero = false;
    this.carritoService.updateProductoCarrito(codigo, 1);
    for(let i = 0; i<this.cart.length; i++){
      if(codigo == this.cart[i].codigo){
        this.cant_total = this.cant_total - this.cart[i].cantidad; //Restamos la cantidad anterior al total del carrito
        this.cart[i].cantidad++;
        this.cant_total = this.cant_total + this.cart[i].cantidad; //Sumamos la nueva cantidad al total del carrito
        this.total_pagar = Math.round((this.total_pagar + this.cart[i].precio)*100)/100; //Le sumo la cantidad de un producto
        this.events.publish('carro:cantidad', this.cant_total);
        this.carritoService.actualizarTotalCarro(this.cant_total); //Actualizo el total del carrito en storage
      }
     
    }
  }
  //Metodo que decrementa la cantidad de un producto
  decrement(codigo: any) {
    for(let i = 0; i<this.cart.length; i++){
      if(codigo == this.cart[i].codigo){
        if(this.cart[i].cantidad > 0){ //Para que no reste si es menor que 0
          this.carritoService.updateProductoCarrito(codigo, -1);
          this.cant_total = this.cant_total - this.cart[i].cantidad; //Restamos la cantidad anterior al total del carrito
          this.cart[i].cantidad--;
          this.cant_total = this.cant_total + this.cart[i].cantidad; //Sumamos la nueva cantidad al total del carrito
          this.total_pagar = Math.round((this.total_pagar - this.cart[i].precio)*100)/100; //Le resto la cantidad de un producto
          this.events.publish('carro:cantidad', this.cant_total);
          this.carritoService.actualizarTotalCarro(this.cant_total); //Actualizo el total del carrito en storage
        }else if(this.cart[i].cantidad <=0){
         this.escero = true;
        }
      }
    }
  }
//Metodo para eliminar un Productos
eliminarProducto(codigo: any){
  this.carritoService.deleteProductoCarrito(codigo);
  let copia = [];
     for(let i = 0; i<this.cart.length; i++){
      if(codigo != this.cart[i].codigo){
         let productos = {
                            nombre: this.cart[i].nombre,
                            codigo: this.cart[i].codigo,
                            precio: this.cart[i].precio,
                            descripcion: this.cart[i].descripcion,
                            imagen: this.cart[i].imagen,
                            cantidad: this.cart[i].cantidad,
                        };
        copia.push(productos);
      }else{
        if(this.cart[i].cantidad > 0){ //Elimino el total a pagar
            this.total_pagar = this.total_pagar - (this.cart[i].precio*this.cart[i].cantidad);
        }
        
      }
    }
    this.cart = copia;

    //Si esta vacio muestro el dibujo de Tu carro esta vacio
    if(this.cart[0] == null){
      this.vacio = true;
    }
      
}


  pagar(){
    if(this.total_pagar != 0)
       this.navCtrl.push(PagoPage);
  }


}
