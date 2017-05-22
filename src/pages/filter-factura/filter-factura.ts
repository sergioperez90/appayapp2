import { FacturasService } from './../../services/facturas.service';
import { UsuariosService } from './../../services/usuarios.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

/*
  Generated class for the FilterFactura page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-filter-factura',
  templateUrl: 'filter-factura.html'
})
export class FilterFacturaPage {
  precio: any = { lower: 0, upper: 1800 };
   public event = {
    start: '2017-01-01',
    end: '2017-05-31'
   }
   public busqueda = "";
  constructor(public usuarioService: UsuariosService,public facturasService: FacturasService,  public loadingCtrl: LoadingController, public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams) { 
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterFacturaPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  filtrar(){
      let loader = this.loadingCtrl.create({});
      loader.present();
    this.usuarioService.getToken().subscribe(
          usuario =>{
            console.log(this.busqueda);
              /*this.facturasService.getFacturasUsuarioFiltro(usuario.data.Id_usuario, this.precio.lower, this.precio.upper, this.event.start, this.event.end, ).subscribe(
                facturas =>{
                 
                  this.viewCtrl.dismiss();
                  loader.dismiss();
                  
                }
              );*/
          }
    );
  }

}
