import { TabsPage } from './../tabs/tabs';
import { UsuariosService } from './../../services/usuarios.service';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Bienvenida page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bienvenida',
  templateUrl: 'bienvenida.html'
})
export class BienvenidaPage {
  nombre;
  constructor(public storage: Storage,public events: Events,public usuarioService: UsuariosService, public navCtrl: NavController, public navParams: NavParams) {
     /*setTimeout(() => {
    
      //this.redirigir();
    }, 3000);*/
  storage.ready().then(() => {
    //this.events.publish('user:created');
    storage.get("id_token").then((token) => {
      console.log(token);
         console.log("Constructor DE BIENBENIDA");
      this.usuarioService.getToken().subscribe(
          usuario =>{
            console.log(usuario); 
              this.nombre = usuario.data.Nombre_usuario;
              this.events.publish('user:login');
              setTimeout(() => {
                this.redirigir();
               }, 2000);
            }
        );    
      });
     
  });

  }


   redirigir(){
     this.navCtrl.setRoot(TabsPage);
   }

   ngOnInit(){
     /*
     console.log("NG ON INIT DE BIENBENIDA");
      this.usuarioService.getToken().subscribe(
          usuario =>{
            console.log(usuario); 
              this.nombre = usuario.data.Nombre_usuario;
            }
        ); 
        */   
     }

}
