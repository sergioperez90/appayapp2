import { RecuperarPasswordPage } from './../recuperar-password/recuperar-password';
import { BienvenidaPage } from './../bienvenida/bienvenida';
import { HomePage } from './../home/home';
import { ScanStore } from './../scanstore/scanstore';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';

@Component({
  selector: 'page-acceder',
  templateUrl: 'acceder.html'
})
export class AccederPage {

  user: Object = {   //creamos un objeto user que va a representar un usuario tambien podria crear una clase que represente al usuario
    username: '',
    password: ''
  };
 
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public events: Events) 
    {  }
 

  onLogin(){
    let loader = this.loadingCtrl.create({
      content: "Iniciando sesión...",
    });
    loader.present();
    console.log(this.user);
    this.authService.login(this.user).subscribe(
        res =>{ 
            console.log(res);
        if(res[0]){
            if (res[0].status==200){ //todo bien
                   console.log("Acceso correcto");
                   loader.dismiss();
                   //this.events.publish('user:created');
                   this.navCtrl.setRoot(BienvenidaPage);
            }
        }
        else{
            if(res.status==401){      
                 setTimeout(() => {
                    loader.dismiss();
                    this.mostrarAlert('Asegúrate de haber puesto tus datos de acceso correctamente.');   
                }, 1000);
            }
        }        
      
        },
        err=>{ //Error de conexion con el servidor        
            console.log(err);
            this.mostrarAlert('Parece que hay un error en el servidor. Vuelve a intentarlo en unos minutos');
            loader.dismiss();
        },
    );
  } 

  mostrarAlert(texto:string){
    let alert = this.alertCtrl.create({
      title: 'Login Fallido',
      subTitle: texto,
      buttons: ['Aceptar']
    });
    alert.present();
  }  

  recuperarPass() {
    this.navCtrl.push(RecuperarPasswordPage);
    /*
    let alert = this.alertCtrl.create({
      title: 'Recuperar contraseña',
      subTitle: 'Te enviaremos un email para recuperar la contraseña',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: data => {
          console.log("Te enviaremos un email a "+data.email);
          }
        }
      ]
    });
    alert.present();
  */
}


}
 