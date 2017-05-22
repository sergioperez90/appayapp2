import { FacturasService } from './../../services/facturas.service';
import { DetalleTiendaPage } from './../detalle-tienda/detalle-tienda';
import { IntroTiendaPage } from './../intro-tienda/intro-tienda';
import { OfertasService } from './../../services/ofertas.service';
import { ProductosService } from './../../services/productos.service';
import { DetallefacturaPage } from './../facturas/detallefactura';
import { Tienda, TiendasService } from './../../services/tienda.service';
import { DetalleProductoPage } from './../detalle-producto/detalle-producto';
import { CarritoPage } from './../carrito/carrito';
import { DetallePage } from './../detalle/detalle';
import { Usuario, UsuariosService } from './../../services/usuarios.service';
import { Component, OnInit} from '@angular/core';
import { MenuController, NavController, LoadingController, AlertController, Events, Platform, ModalController } from 'ionic-angular';
import { ScanProduct } from '../scanproduct/scanproduct';
import { ScanStore } from '../scanstore/scanstore';
import { Storage } from '@ionic/storage';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarker, GoogleMapsMarkerOptions } from 'ionic-native';
import { Geolocation } from 'ionic-native';


declare var cordova:any;
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage{
  scanProduct = ScanProduct;
  scanStore = ScanProduct;
  deal : any; 
  tiendas: Tienda[];
  nombreTienda = "Appay";
  cant_total;
  vacio = false;
  scanTienda=false; //Tiene que estar a false
  ofertasUsuario = [];
  ofertasProducto = [];
  
  map: GoogleMap;
   public latPos;
 public longPos;

  constructor(public modalCtrl: ModalController, public platform: Platform, public facturaService:FacturasService, public ofertaService:OfertasService, public usuarioService: UsuariosService, public productosService: ProductosService,public events: Events, public alertCtrl: AlertController, public menuCtrl: MenuController, public tiendasService: TiendasService, public productoService: ProductosService, public navCtrl: NavController, public loadingCtrl: LoadingController, public storage: Storage) {
    Geolocation.getCurrentPosition().then((position) => {
                  let locat = new GoogleMapsLatLng(position.coords.latitude, position.coords.longitude);
                  this.latPos = position.coords.latitude;
                  this.longPos = position.coords.longitude;
                     platform.ready().then(() => {
                      this.loadMap();
                  });
          });

     //Esto esta pendiente por si la cantidad del carro se cambia en algun momento
    this.events.subscribe('carro:cantidad', (total) => {
      this.cant_total = total;
    });
    //Esto para cambiar el modo de vista
    this.events.subscribe('escaneo:tienda', (tienda) => {
      if(tienda){
        this.scanTienda = true;
        console.log("ESTAS EN LA TIENDA "+this.scanTienda);
      }
    });

   

    /*
     this.events.subscribe('carro:add', () => {
      this.escanearProducto();
    });*/
  }
escanearTienda(){
  console.log("Estas dentro de la tienda guapo");
}
  loadMap(){
        let location = new GoogleMapsLatLng(-34.9290,138.6010);
       let tupos = new GoogleMapsLatLng(this.latPos,this.longPos);

        this.map = new GoogleMap('map', {
          'backgroundColor': 'white',
          'controls': {
            'compass': false,
            'myLocationButton': false,
            'indoorPicker': true,
            'zoom': true
          },
          'gestures': {
            'scroll': true,
            'tilt': true,
            'rotate': true,
            'zoom': true
          },
          'camera': {
            'latLng': tupos,
            'tilt': 30,
            'zoom': 14,
            'bearing': 50
          }
        });
 
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Map is ready!');
        });
        
        let a2 = new GoogleMapsLatLng(38.381050,-0.506837);
                  let markerOptions: GoogleMapsMarkerOptions = {
                    position: a2,
                    icon: {
                        'url': 'assets/location.png'
                          }                    
                    };

        this.map.addMarker(markerOptions)
          .then((marker: GoogleMapsMarker) => {
                  marker.addEventListener(GoogleMapsEvent.MARKER_CLICK)
                      .subscribe(e => {
                        console.log(e.get('position'));
                         let modal = this.navCtrl.push(DetalleTiendaPage);
                      });
            }
        );

        
                    

       
    }

      /*

    //Metodo para escanear los productos
     escanearProducto() {
      let ctrl  = this.navCtrl;
      let load = this.loadingCtrl;
      let storagePro = this.storage;
      let encontrado = false;
      let alertC = this.alertCtrl;
      let productosServ = this.productoService;

        cordova.plugins.barcodeScanner.scan(
          function (result) {
            //Cuando el escaneo es correcto, me redireccionara a la pagina de detalle producto
            //result.text
             if(result.cancelled == 0){
                let loader = load.create({});
                loader.present();

                storagePro.ready().then(() => {
                  storagePro.get('tienda').then((tienda) => {
                          let id_tienda = tienda.Id_tienda;
                          //Busco el producto y lo añado a storage, le paso el id_tienda y codigo del producto
                          productosServ.buscarProductosTienda(id_tienda,result.text).subscribe(
                             productos =>{
                                if(productos == 204){
                                  loader.dismiss(); //Cierro el loader
                                    let alert = alertC.create({
                                      title: '¡Ups!',
                                      subTitle: 'El producto no existe, vuelve a escanear el código',
                                      buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                if(productos[0].Codigo_producto == result.text){
                                  //Si el producto existe pasamos a detalle producto y lo guardamos en storage
                                  productosServ.setProductoStorage(productos);
                                  loader.dismiss();
                                  ctrl.push(DetalleProductoPage);
                                }
                             }
                          );
                  });
                });

             }
   
          },
          function (error) {
              console.log("El escaneo a fallado: " + error);
          },
          {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : false, // iOS and Android
              showTorchButton : true, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              prompt : "Introduce el codigo dentro del area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              formats : "EAN_8,EAN_13", // default: all but PDF_417 and RSS_EXPANDED
              orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations : true // iOS
          }
      );
    }
    //Metodo para escanear la tienda
    escanearTienda(){
      let ctrl  = this.navCtrl;
      let tiendasServ = this.tiendasService;
      let productosServ = this.productosService;
      let userService = this.usuarioService;
      let load = this.loadingCtrl;
      let alertC = this.alertCtrl;
      let evento = this.events;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
             //Muestra que carga
             if(result.cancelled == 0){
               let loader = load.create({});
                loader.present();
                userService.getToken().subscribe(
                   usuario =>{
                   
                      tiendasServ.buscarTienda(result.text, usuario.data.Id_usuario).subscribe(
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
                            evento.publish('escaneo:tienda', true);
                            loader.dismiss(); //Elimina el cargando cuando ya ha cargado la tienda
                            ctrl.setRoot(IntroTiendaPage); //Accedo a la tienda
                        } 
                        
                      }
                    );
                }
              );

             }
            
           },
          function (error) {
              console.log("El escaneo a fallado: " + error);
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

  ngOnInit() {
    
    this.menuCtrl.enable(true);
        
        this.storage.ready().then(() => {
        this.storage.get('tienda').then((tienda) => {
          if(tienda != null){
            this.scanTienda = true;
            this.nombreTienda = tienda.Nombre_tienda;
            console.log(this.nombreTienda);
          }
          
        });
        //Cargo el numero del carro
      this.storage.get('cant_total').then((cant_total) => {
              this.cant_total = cant_total;
        });
      });
      
      //Cargamos ofertas personalizadas
          this.usuarioService.getToken().subscribe(
                usuario =>{
                  let loader = this.loadingCtrl.create({});
                  loader.present();
                    this.ofertaService.getOfertasUsuarios(usuario.data.Id_usuario).subscribe(
                          ofertas =>{
                            //Me guardo el id de usuario tienda
                         if(ofertas[0]){
                            this.storage.set('id_usuario_tienda', ofertas[0].Id_usuario_tienda);
                            for(let i = 0; i<ofertas.length; i++){
                              let ofertaUsuario = {
                                          nombre_producto: ofertas[i].Nombre_producto,
                                          nombre_tienda: ofertas[i].Nombre_tienda,
                                          precio_oferta: ofertas[i].P_oferta_oferta_usuario,
                                          precio_producto: ofertas[i].Precio_producto,
                                          descripcion_oferta: ofertas[i].Descripcion_oferta_usuario,
                                          imagen: ofertas[i].Foto_oferta_usuario,
                                          fecha_inicio: ofertas[i].Fecha_inicio_oferta_usuario.split("T")[0], //Hay que cortar la hora de la fecha
                                          fecha_fin: ofertas[i].Fecha_fin_oferta_usuario.split("T")[0]
                                      };
                                this.ofertasUsuario.push(ofertaUsuario);

                            }
                            }
                          loader.dismiss();
                          }
                    );

                  }
          );
    
      
  
      //Cargamos ofertas de productos

            this.storage.get('tienda').then((tienda) => {
              if(tienda != null){
                let loader = this.loadingCtrl.create({});
                  loader.present();
                  this.ofertaService.getOfertasProductos(tienda.Id_tienda).subscribe(
                    ofertas =>{
                      
                      console.log("Entra dentro de las ofertas de la tienda");
                      for(let i = 0; i<ofertas.length; i++){
                              let ofertaProducto = {
                                          nombre_producto: ofertas[i].Nombre_producto,
                                          nombre_tienda: ofertas[i].Nombre_tienda,
                                          precio_oferta: ofertas[i].P_oferta_oferta_producto,
                                          precio_producto: ofertas[i].Precio_producto,
                                          descripcion_oferta: ofertas[i].Descripcion_oferta_producto,
                                          imagen: ofertas[i].Foto_oferta_producto,
                                          fecha_inicio: ofertas[i].Fecha_inicio_oferta_producto.split("T")[0], //Hay que cortar la hora de la fecha
                                          fecha_fin: ofertas[i].Fecha_fin_oferta_producto.split("T")[0]
                                      };
                                this.ofertasProducto.push(ofertaProducto);
                            }
                        loader.dismiss();
                    }
                  );
              }
          });

         

      
  }
  carrito(){
    this.navCtrl.push(CarritoPage);
  }

  codigoMano(){
    let prompt = this.alertCtrl.create({
      title: 'Introducir Código de Barras',
      message: "Escribe el codigo de barras del producto",
      inputs: [
        {
          name: 'codigo',
          placeholder: 'Codigo de barras',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buscar',
          handler: data => {
            console.log(data.codigo);
            //Si funciona el codigo introducido a mano
            let loader = this.loadingCtrl.create({});
                loader.present();

                this.storage.ready().then(() => {
                  this.storage.get('tienda').then((tienda) => {
                          let id_tienda = tienda.Id_tienda;
                          //Busco el producto y lo añado a storage, le paso el id_tienda y codigo del producto
                          this.productosService.buscarProductosTienda(id_tienda,data.codigo).subscribe(
                             productos =>{
                                if(productos == 204){
                                  loader.dismiss(); //Cierro el loader
                                    let alert = this.alertCtrl.create({
                                      title: '¡Ups!',
                                      subTitle: 'El producto no existe, vuelve a escanear el código',
                                      buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                if(productos[0].Codigo_producto == data.codigo){
                                  //Si el producto existe pasamos a detalle producto y lo guardamos en storage
                                  this.productosService.setProductoStorage(productos);
                                  loader.dismiss();
                                  this.navCtrl.push(DetalleProductoPage);
                                }
                             }
                          );
                  });
                });
          }
        }
      ]
    });
    prompt.present();
  }


//Esto son metodos en local
 escanearTiendaLocal(){
      let ctrl  = this.navCtrl;
      let tiendasServ = this.tiendasService;
      let productosServ = this.productosService;
      let userService = this.usuarioService;
      let load = this.loadingCtrl;
      let alertC = this.alertCtrl;
      let evento = this.events;
             //Muestra que carga
               let loader = load.create({});
                loader.present();
                userService.getToken().subscribe(
                   usuario =>{
                   
                      tiendasServ.buscarTienda(1, usuario.data.Id_usuario).subscribe(
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
                        if(tiendas[0].Id_tienda == 1){ //Cuando el escaneo es correcto, me redireccionara a la pagina de la tienda
                            tiendasServ.setTiendaStorage(tiendas); //Anyade a storage
                            console.log("LA TIENDA ES CORRECTA");
                            evento.publish('escaneo:tienda', true);
                            loader.dismiss(); //Elimina el cargando cuando ya ha cargado la tienda
                            ctrl.setRoot(IntroTiendaPage); //Accedo a la tienda
                        } 
                        
                      }
                    );
                }
              );

            
         

    }

escanearProductoLocal(){
          let ctrl  = this.navCtrl;
      let load = this.loadingCtrl;
      let storagePro = this.storage;
      let encontrado = false;
      let alertC = this.alertCtrl;
      let productosServ = this.productoService;

            //Cuando el escaneo es correcto, me redireccionara a la pagina de detalle producto
            //result.text
                let loader = load.create({});
                loader.present();

                storagePro.ready().then(() => {
                  storagePro.get('tienda').then((tienda) => {
                          let id_tienda = tienda.Id_tienda;
                          //Busco el producto y lo añado a storage, le paso el id_tienda y codigo del producto
                          productosServ.buscarProductosTienda(id_tienda,79098372).subscribe(
                             productos =>{
                                if(productos == 204){
                                  loader.dismiss(); //Cierro el loader
                                    let alert = alertC.create({
                                      title: '¡Ups!',
                                      subTitle: 'El producto no existe, vuelve a escanear el código',
                                      buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                if(productos[0].Codigo_producto == 79098372){
                                  //Si el producto existe pasamos a detalle producto y lo guardamos en storage
                                  productosServ.setProductoStorage(productos);
                                  loader.dismiss();
                                  ctrl.push(DetalleProductoPage);
                                }
                             }
                          );
                  });
                });

  
         
}

//ESTOS METODOS HAY QUE ELIMINARLOS
/*
ofertaProductos(){
  this.storage.get('tienda').then((tienda) => {
              if(tienda != null){
                let loader = this.loadingCtrl.create({});
                  loader.present();
                  this.ofertaService.getOfertasProductos(tienda.Id_tienda).subscribe(
                    ofertas =>{
                      
                      console.log("Entra dentro de las ofertas de la tienda");
                      for(let i = 0; i<ofertas.length; i++){
                              let ofertaProducto = {
                                          nombre_producto: ofertas[i].Nombre_producto,
                                          nombre_tienda: ofertas[i].Nombre_tienda,
                                          precio_oferta: ofertas[i].P_oferta_oferta_producto,
                                          precio_producto: ofertas[i].Precio_producto,
                                          descripcion_oferta: ofertas[i].Descripcion_oferta_producto,
                                          imagen: ofertas[i].Foto_oferta_producto,
                                          fecha_inicio: ofertas[i].Fecha_inicio_oferta_producto.split("T")[0], //Hay que cortar la hora de la fecha
                                          fecha_fin: ofertas[i].Fecha_fin_oferta_producto.split("T")[0]
                                      };
                                this.ofertasProducto.push(ofertaProducto);
                            }
                        loader.dismiss();
                    }
                  );
              }
          });
}

ofertaUsuarios(){
  this.usuarioService.getToken().subscribe(
                usuario =>{
                  let loader = this.loadingCtrl.create({});
                  loader.present();
                    this.ofertaService.getOfertasUsuarios(usuario.data.Id_usuario).subscribe(
                          ofertas =>{
                            //Me guardo el id de usuario tienda
                            this.storage.set('id_usuario_tienda', ofertas[0].Id_usuario_tienda);
                            for(let i = 0; i<ofertas.length; i++){
                              let ofertaUsuario = {
                                          nombre_producto: ofertas[i].Nombre_producto,
                                          nombre_tienda: ofertas[i].Nombre_tienda,
                                          precio_oferta: ofertas[i].P_oferta_oferta_usuario,
                                          precio_producto: ofertas[i].Precio_producto,
                                          descripcion_oferta: ofertas[i].Descripcion_oferta_usuario,
                                          imagen: ofertas[i].Foto_oferta_usuario,
                                          fecha_inicio: ofertas[i].Fecha_inicio_oferta_usuario.split("T")[0], //Hay que cortar la hora de la fecha
                                          fecha_fin: ofertas[i].Fecha_fin_oferta_usuario.split("T")[0]
                                      };
                                this.ofertasUsuario.push(ofertaUsuario);

                            }
                            loader.dismiss();
                          }
                    );

                  }
          );
}
*/



}
