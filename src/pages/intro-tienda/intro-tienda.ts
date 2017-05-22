import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-intro-tienda',
  templateUrl: 'intro-tienda.html'
})
export class IntroTiendaPage {
  nombreTienda;
  foto;
  logo;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menu: MenuController,
    public storage: Storage,
    public events: Events
  ){
    
    setTimeout(() => {
    
      this.redirigir();
    }, 3500);
   }

   redirigir(){
     this.navCtrl.setRoot(HomePage);
   }

    ionViewWillEnter(){
      this.menu.enable(false);
          this.storage.ready().then(() => {
            this.storage.get('tienda').then((tienda) => {
              this.nombreTienda = tienda.Nombre_tienda;
              this.foto = tienda.Foto_tienda;
              this.logo = tienda.Logo_tienda;
            });
          
          });
    }
    
 ngOnInit() {
      this.events.publish('tienda:existe'); //Como la tienda ya existe aqui, ahora ya se muestra el boton Inicio en el menu
 }
  

}
   