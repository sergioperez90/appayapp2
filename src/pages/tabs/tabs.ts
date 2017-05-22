import { HomePage } from './../home/home';
import { HomeDetallePage } from './../home-detalle/home-detalle';
import { DetallefacturaPage } from './../facturas/detallefactura';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Tabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
 template: `
    <ion-tabs color ="primary">
      <ion-tab tabIcon="compass" [root]="tab1"></ion-tab>
      <ion-tab tabIcon="list" [root]="tab2"></ion-tab>
    </ion-tabs>`
})
export class TabsPage {
 tab1: any;
  tab2: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1 = HomePage;
    this.tab2 = HomeDetallePage;
  }


}
