import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the MapaInfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mapa-info',
  templateUrl: 'mapa-info.html'
})
export class MapaInfoPage {
  tienda: any;
 constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrol: ViewController) {
         this.tienda = "info";

 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPaginaPage');
  }
  dismiss()
  {
    this.viewCtrol.dismiss(); //para cerrar la ventana modal cuando exista
  }

}
