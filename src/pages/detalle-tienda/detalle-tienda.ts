import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-detalle-tienda',
  templateUrl: 'detalle-tienda.html'
})
export class DetalleTiendaPage {
  tienda: any;
  scanTienda=false; //Tiene que estar a false

  constructor(public viewCtrol: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.tienda = "info";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleTiendaPage');
  }



}
