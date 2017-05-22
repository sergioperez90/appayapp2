import { PerfilPage } from './../perfil/perfil';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the RegistroDatos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-registro-datos',
  templateUrl: 'registro-datos.html'
})
export class RegistroDatosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroDatosPage');
  }
  public rellenarAhora(){
    this.navCtrl.setRoot(PerfilPage);
  }

  public masAdelante(){
    this.navCtrl.setRoot(HomePage);
  }


}
