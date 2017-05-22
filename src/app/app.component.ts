import { TabsPage } from './../pages/tabs/tabs';
import { Tienda } from './../services/tienda.service';
import { UsuariosService } from './../services/usuarios.service';
import { AuthService } from './../services/auth.service';
import { AccederPage } from './../pages/acceder/acceder';
import { IntroTiendaPage } from './../pages/intro-tienda/intro-tienda';
import { DetalleProductoPage } from './../pages/detalle-producto/detalle-producto';
import { PerfilPage } from './../pages/perfil/perfil';
import { PrincipalPage } from './../pages/principal/principal';
import { MapaPage } from './../pages/mapa/mapa';
import { SlidesPage } from './../pages/slides/slides';
import { FacturasPage } from './../pages/facturas/facturas';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { ScanStore } from '../pages/scanstore/scanstore'
import { ContactPage } from '../pages/contact/contact'
import { Storage } from '@ionic/storage';


@Component({
  selector: 'menu-menu',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage;
  pages: Array<{icon: string, title: string, component: any}>;
  pages2: Array<{icon: string, title: string, component: any}>;
  id_tienda;
  nombreTienda; 
  foto;
  nombre;
  email;
  scanTienda = false;

  constructor(public usuarioService: UsuariosService, public platform: Platform, private alertCtrl: AlertController, public loadingCtrl: LoadingController, public storage: Storage, public events: Events) {
         //Si es la primera vez que se inicia
         this.storage.get('slide').then((slide) => {
            if(slide == 'visto'){
                this.storage.get('id_token').then((token) => {
                  if(token != null){ //Si existe el token del usuario        
                      this.usuarioService.getToken().subscribe(
                          usuario =>{
                            console.log(usuario);
                              this.nombre = usuario.data.Nombre_usuario;
                              this.email = usuario.data.Email_usuario;
                              if(usuario.data.Foto_usuario!="")
                                this.foto = usuario.data.Foto_usuario;
                              else
                                this.foto = "assets/logo.png"
                              
                              console.log("Entra dentro del token con "+usuario.data.Nombre_usuario);
                            }
                        );               
                      
                    this.rootPage=TabsPage; //Me voy a la pantalla principal

                  }else{ //Si no hay token
                    this.rootPage=PrincipalPage;
                    //this.rootPage=RegistroDatosPage;
                  }
                });
                
            }else{
              this.rootPage=SlidesPage;
            }
         });

        //Para que me salga el boton de cambiar tienda
       this.storage.get('tienda').then((tienda) => {
         if(tienda != null){
            this.scanTienda = true;
         }
       });    
       //Para que me salga el boton de cambiar Tienda
       this.events.subscribe('escaneo:tienda', (tienda) => {
          if(tienda){
            this.scanTienda = true;
          }else{
            this.scanTienda = false;
          }
        });     
              
            
         
    this.initializeApp();
    // Array de paginas para el menu, con su icono, su titulo, y el enlace.

      this.pages = [
        { icon: "home", title: 'Inicio', component: TabsPage },
        { icon: "contact", title: 'Mi perfil', component: PerfilPage },
        { icon: "paper", title: 'Mis facturas', component: FacturasPage }
      ];

    
    
     this.pages2 = [
      { icon: "pin", title: 'Ver tiendas', component: MapaPage },
      { icon: "hammer", title: 'Soporte', component: ContactPage },
      { icon: "help", title: 'Ayuda', component: SlidesPage }
    ];

                    
    this.events.subscribe('user:created', () => {
      console.log("Has cerrado sesion y vuelto a entrar");
      this.nombre = "Inicia Sesión";
      this.email = "info@appay.es";
      this.foto = "assets/logo.png"
      this.usuarioService.getToken().subscribe(
            usuario =>{
                this.nombre = usuario.data.Nombre_usuario;
                this.email = usuario.data.Email_usuario;
                this.foto = usuario.data.Foto_usuario;
                console.log("Has cerrado sesión y entrado con "+usuario.data.Nombre_usuario);
              }
      );          
    });

        this.events.subscribe('user:login', () => {
      //console.log("Has cerrado sesion y vuelto a entrar");
      //this.nombre = "Inicia Sesión";
      //this.email = "info@appay.es";
      //this.foto = "assets/logo.png"
      this.usuarioService.getToken().subscribe(
            usuario =>{
                this.nombre = usuario.data.Nombre_usuario;
                this.email = usuario.data.Email_usuario;
                if(usuario.data.Foto_usuario!="")
                  this.foto = usuario.data.Foto_usuario;
                else
                  this.foto = "assets/logo.png"
                //console.log("Has cerrado sesión y entrado con "+usuario.data.Nombre_usuario);
              }
      );          
    });
  }

  

 ngOnInit(){
 }

 cambiarTienda(){
    let alert = this.alertCtrl.create({
    title: 'Cambiar tienda',
    message: '¿Estás seguro de que quieres cambiar de tienda? Tu carro también se eliminará',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Confirmar',
        handler: () => {
          this.MostrarLoadingCierraTienda();
        }
      }
    ]
  });
  alert.present();

 }

MostrarLoadingCierraTienda(){
    let loader = this.loadingCtrl.create({
    });
    loader.present();
    this.storage.remove('tienda');
    this.storage.remove('carrito');
    this.storage.remove('cant_total');
    this.storage.remove('total_pagar'); 
    this.events.publish('escaneo:tienda', false);
    this.nav.setRoot(HomePage);
    loader.dismiss();
}
  CerrarSesion(){
    let alert = this.alertCtrl.create({
    title: 'Cerrar sesión',
    message: '¿Estás seguro de que deseas cerrar tu sesión en Appay?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Confirmar',
        handler: () => {
          this.storage.remove('tienda');
          this.storage.remove('carrito');
          this.storage.remove('cant_total');
          this.storage.remove('total_pagar');
          this.storage.remove('id_usuario_tienda');
          this.events.publish('escaneo:tienda', false);
          this.MostrarLoading();
        }
      }
    ]
  });
  alert.present();
  }

  MostrarLoading(){
    let loader = this.loadingCtrl.create({
      content: "Cerrando sesión...",
    });
    loader.present();
    this.storage.remove('id_token');
    this.nav.setRoot(PrincipalPage);
    loader.dismiss();
  }

  

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
    NavegarPerfil() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(PerfilPage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
}
