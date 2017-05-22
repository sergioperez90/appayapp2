import { RegistroDatosPage } from './../registro-datos/registro-datos';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';

/*
  Generated class for the Registro page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html'
})
export class RegistroPage {
  public usuario: Object={ correo:'', password1:'', password2:''};
  public msgPassword;
  public validacioncorrecta:boolean=true;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  public registro(){
    this.validarDatos();
    if(this.validacioncorrecta==false){ //datos del usuario no validados
      let alert = this.alertCtrl.create({
        title: 'Registro incorrecto',
        subTitle: this.msgPassword,
        buttons: ['Aceptar']
      });
      alert.present();
    }
    else{ //datos del usuario validados
      let loader = this.loadingCtrl.create({
        content: "Registrando usuario...",
      });
      loader.present();
      console.log("registro");
      console.log(this.usuario);
          this.authService.registro(this.usuario).subscribe(
          res =>{
              console.log(res);
          if(res[0]){
              if (res[0].status==200){ //todo bien
                this.generateToken(loader);
              }
          } 
          else{
              if(res.status==401){
                this.mostrarAlert('Registro incorrecto', 'El correo introducido ya está en uso.');   
                loader.dismiss();
              }
          }        
              //this.accesocorrecto=true;        
          }, 
          err=>{ //Error de conexion con el servidor
              //console.log(err);
              loader.dismiss(); 
              
          },
      );
    }
  }

  public generateToken(loader){
     let user: Object={ username:this.usuario["correo"], password: this.usuario["password1"]};
        this.authService.login(user).subscribe(
        res =>{ 
            console.log(res);
        if(res[0]){
            if (res[0].status==200){ //todo bien
                   console.log("Acceso correcto");
                   loader.dismiss();
                   /*
                      let alert = this.alertCtrl.create({
                      title: 'Registro correcto',
                      subTitle: 'Te hemos enviado un email para que valides tu usuario. Rellénalo en la mayor brevedad posible.',
                      buttons: [
                        {
                          text: 'Aceptar',
                          handler: () => {
                            //this.navCtrl.setRoot(RegistroDatosPage);
                            //this.events.publish('user:created');
                            this.generateToken();
                          }
                        }    
                      ]
                });
                */
                this.mostrarAlertCorrecto('Registro correcto','Te hemos enviado un email para que valides tu usuario. Rellénalo en la mayor brevedad posible.');
                //alert.present();
            }
        }
        else{
            if(res.status==401){      
                 setTimeout(() => {
                    loader.dismiss();
                    this.mostrarAlert('Registro correcto', 'Parece que hay un error en el servidor, por favor vuelve a intentarlo');   
                }, 1000);
            }
        }        
      
        },
        err=>{ //Error de conexion con el servidor        
            console.log(err);
            this.mostrarAlert('Registro Incorrecto','Parece que hay un error en el servidor. Vuelve a intentarlo en unos minutos');
            loader.dismiss();
        },
    );
    
  }

  mostrarAlert(titulo:string,texto:string){
    let alert = this.alertCtrl.create({
      title: 'Login Fallido',
      subTitle: texto,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  mostrarAlertCorrecto(titulo:string,texto:string){
    let alert = this.alertCtrl.create({
      title: 'Registro correcto',
      subTitle: texto,
      buttons: [
        { 
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.setRoot(RegistroDatosPage);
            //this.events.publish('user:created'); 
          }
        }
      ]
    });
    alert.present();
  }

  validarDatos(){
    if(this.usuario["password1"].length<8){
        this.msgPassword="Contraseña inválida (mínimo 8 caracteres). ";
        this.validacioncorrecta=false;
    }

    if(this.usuario["password1"]!=this.usuario["password2"]){
        this.msgPassword="Las contraseñas no coinciden. ";
        this.validacioncorrecta=false;
    }

    if(this.usuario["password1"].length>=8 && (this.usuario["password1"]==this.usuario["password2"])){
        this.validacioncorrecta=true;
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var checkCorreo=re.test(this.usuario["correo"]);
    console.log("checkCorreo es " + checkCorreo);
    if(checkCorreo==false){
        this.msgPassword="La dirección de correo electrónico no es válida";
        this.validacioncorrecta=false;  
    }

  }

}
 