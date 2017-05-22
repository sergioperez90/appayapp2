import { HomePage } from './../home/home';
import { CarritoService } from './../../services/carrito.service';
import { Storage } from '@ionic/storage';
import { CarritoPage } from './../carrito/carrito';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

/*
  Generated class for the DetalleProducto page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detalle-producto',
  templateUrl: 'detalle-producto.html'
})
export class DetalleProductoPage {
  nombre;
  descripcion;
  precio; 
  codigo;
  video;
  imagen;
  cant_total;
  vacio = false;
  constructor(public viewController: ViewController, private sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public storage: Storage, public carritoService: CarritoService, public events: Events) {}

  carrito(){
    this.navCtrl.push(CarritoPage);
  }

  public cantidad: number = 1;


  increment(e) {
    this.cantidad++;
  }

  decrement(e) {
    if(this.cantidad > 0){
      this.cantidad--;
    }
  }


  addCart() {
    this.carritoService.actualizarTotal(this.cantidad); //Actualizo el total del carrito en storage
    this.cant_total +=this.cantidad; //Actualizo el total del carrito en local
     this.events.publish('carro:cantidad', this.cant_total); //Creo un evento para que se cambie el tamaño del carro
     this.storage.ready().then(() => { //Guardo el producto nuevo
            this.storage.get('producto').then((producto) => {
                this.carritoService.setProductoCarrito(producto, this.cantidad);
                
            });
    });

    let toast = this.toastCtrl.create({
      message: 'Producto añadido al carrito',
      duration: 3000
    });
    toast.present();
    this.viewController.dismiss()
    this.events.publish('carro:add');
  }

  ngOnInit(){
    this.getTotal();
    this.storage.ready().then(() => { //Recojo todos los productos que tengo en el carro
            this.storage.get('producto').then((producto) => {
             this.nombre = producto.Nombre_producto;
             this.descripcion = producto.Descripcion_producto;
             this.precio = producto.Precio_producto;
             this.codigo = producto.Codigo_producto;
             this.imagen = producto.Imagen_producto;
             this.video = this.sanitizer.bypassSecurityTrustResourceUrl(producto.URL_video_producto);
             console.log("ESTE ES EL PRODUCTO DEL ESCANEO DEL CODIGO: "+producto.Nombre_producto);

            });
           
      });
      
  }

  //Metodo que recoge el total que hay actualmente y lo muestro en icono del carro
  getTotal(){
    this.storage.ready().then(() => {
       this.storage.get('cant_total').then((cant_total) => {
              this.cant_total = cant_total;
        });
    });
  }

}
