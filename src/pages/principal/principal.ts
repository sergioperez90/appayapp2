import { RegistroPage } from './../registro/registro';
import { AccederPage } from './../acceder/acceder';
import { ScanStore } from './../scanstore/scanstore';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';

/*
  Generated class for the Principal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation. 
*/
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html'
})
export class PrincipalPage {

   constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menu: MenuController) {
      
  }
  Acceder(){
    
    this.navCtrl.push(AccederPage);
  }
  Registrar(){
    this.navCtrl.push(RegistroPage);
  }
 
  //Este metodo es para falsear el inicio de sesion
  abrir(){
     this.navCtrl.setRoot(ScanStore);
  }

  ngOnInit() {
    // the left menu should be disabled on the login page
    this.menu.enable(false);
  }

}
