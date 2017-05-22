import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

/*
  Generated class for the RecuperarPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recuperar-password',
  templateUrl: 'recuperar-password.html'
})
export class RecuperarPasswordPage {
  public validacioncorrecta:boolean=true;
  public email:string='';
  public msgAlert:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public authService: AuthService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperarPasswordPage');
  }

  public enviarCorreo(){
    this.validarDatos();
    if(this.validacioncorrecta==false){ //el correo no es una direccion valida
      let alert = this.alertCtrl.create({
        title: 'Email incorrecto',
        subTitle: this.msgAlert,
        buttons: ['Aceptar']
      });
      alert.present();
    }
    else{ // el correo es una direccion valida
      console.log(this.email);
      let loader = this.loadingCtrl.create({
        //content: "Enviando correo...",
      }); 
      loader.present();
      this.authService.resetpassword(this.email).subscribe(
          res =>{
            if (res[0].status==200){ //todo bien
                this.mostrarAlert('Correo enviado', 'Se ha enviado un correo al correo ' + this.email +'. Si no ve el correo revise su carpeta de SPAM o espere unos minutos.');
                loader.dismiss();
            }
            else{ //datos no encontrados
                //this.msgAlert=res[0].json;
                this.mostrarAlert('Error', 'El correo que has introducido no está registrado en el sistema');
                loader.dismiss();
            }
          },
          err=>{ //Error de conexion con el servidor  
            this.mostrarAlert('Error', 'Parece que hay un error en el servidor. Vuelve a intentarlo en unos minutos');
            loader.dismiss();
          },
      );
    }
  }

  mostrarAlert(titulo:string,texto:string){
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  validarDatos(){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var checkCorreo=re.test(this.email);
    console.log("checkCorreo es " + checkCorreo);
    if(checkCorreo==false){
        this.msgAlert="La dirección de correo electrónico no es válida";
        this.validacioncorrecta=false;  
    }

  }

}
