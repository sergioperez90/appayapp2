import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the HomeDetalle page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home-detalle',
  templateUrl: 'home-detalle.html'
})
export class HomeDetallePage {

  constructor(public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
