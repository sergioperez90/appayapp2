import { Observable } from 'rxjs/Observable';
import { UsuariosService } from './../../services/usuarios.service';
import { CarritoService } from './../../services/carrito.service';
import { ProductosService } from './../../services/productos.service';
import { IntroTiendaPage } from './../intro-tienda/intro-tienda';
import { HomePage } from './../home/home';
import { CarritoPage } from './../carrito/carrito';
import { DetallePage } from './../detalle/detalle';
import { Component } from '@angular/core';
import { Tienda, TiendasService } from './../../services/tienda.service';

import { NavController, MenuController, LoadingController, AlertController, Events } from 'ionic-angular';

import { BarcodeScanner } from 'ionic-native';

import {Platform, Alert} from 'ionic-angular';

import {App} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLite } from 'ionic-native';


declare var cordova:any;

@Component({
  selector: 'page-scanstore',
  templateUrl: 'scanstore.html'
})
export class ScanStore {
  homePage = HomePage;
  cant_total;
  vacio = false;
  //tiendas: Tienda[];
  constructor(public navCtrl: NavController, 
              public platform: Platform, 
              public app: App, 
              public menu: MenuController, 
              public tiendasService: TiendasService, 
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController,
              public storage: Storage,
              public events: Events,
              public productosService: ProductosService,
              public carritoService: CarritoService,
              public usuarioService: UsuariosService) {
    //Esto esta pendiente por si la cantidad del carro se cambia en algun momento
    this.events.subscribe('carro:cantidad', (total) => {
      this.cant_total = total;
    });

  }

  scan() {
      let ctrl  = this.navCtrl;
      let tiendasServ = this.tiendasService;
      let productosServ = this.productosService;
      let load = this.loadingCtrl;
      let alertC = this.alertCtrl;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
             //Muestra que carga
             if(result.cancelled == 0){
               let loader = load.create({});
                loader.present();
                tiendasServ.buscarTienda(result.text, 1).subscribe(
                tiendas =>{
                  
                  //Si la tienda no existe
                  if(tiendas == 204){
                    loader.dismiss(); //Cierro el loader
                      let alert = alertC.create({
                        title: '¡Ups!',
                        subTitle: 'La tienda no existe, vuelve a escanear el código',
                        buttons: ['OK']
                      });
                      alert.present();
                  }
                   if(tiendas[0].Id_tienda == result.text){ //Cuando el escaneo es correcto, me redireccionara a la pagina de la tienda
                      tiendasServ.setTiendaStorage(tiendas); //Anyade a storage
                      console.log("LA TIENDA ES CORRECTA");
                      loader.dismiss(); //Elimina el cargando cuando ya ha cargado la tienda
                      ctrl.setRoot(IntroTiendaPage); //Accedo a la intro
                   } 
                   
                }
              );

             }
            
           },
          function (error) {
              alert("El escaneo a fallado: " + error);
          },
          {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : false, // iOS and Android
              showTorchButton : true, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              prompt : "Introduce el codigo dentro del area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
              orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations : true, // iOS
          }
      );
    }

    private cerrar(){
      this.app.getRootNav().setRoot(HomePage);
    }


 ngOnInit() {  

   this.menu.enable(true);
   
   this.storage.ready().then(() => {
       this.storage.get('cant_total').then((cant_total) => {
              this.cant_total = cant_total;
        });
    });
    
  }

  

  carrito(){
    this.navCtrl.push(CarritoPage);
  }

  

}