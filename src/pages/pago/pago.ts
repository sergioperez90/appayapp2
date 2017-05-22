import { FacturasService, LineasFactura } from './../../services/facturas.service';
import { FacturasPage } from './../facturas/facturas';
import { UsuariosService } from './../../services/usuarios.service';
import { HomePage } from './../home/home';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController } from 'ionic-angular';

/*
  Generated class for the Pago page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pago',
  templateUrl: 'pago.html'
})
export class PagoPage {
  total_pagar = 0;
  id_tienda;
  id_usuario_tienda;
  lineas = [];

constructor(public facturaService:FacturasService, public usuarioService:UsuariosService, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public storage: Storage) {
    
}

  ngOnInit(){
     //Aqui cargo el total a pagar
           this.storage.get('total_pagar').then((total) => {
             if(total != null)
              this.total_pagar = total;
              else
              this.total_pagar = 0;
              
           });
           this.storage.get('tienda').then((tienda) => {
              this.id_tienda = tienda.Id_tienda;
              
           });
           this.storage.get('id_usuario_tienda').then((id) => {
              this.id_usuario_tienda = id;
              
           });
           this.storage.get('carrito').then((carrito) => {
             for(let i=0; i<carrito.length; i++){
                let linea = {
                            Cantidad_linea_factura: carrito[i].cantidad,
                            Id_producto_tienda_linea_factura : carrito[i].id_producto,
                            Total_linea_factura : (carrito[i].cantidad*carrito[i].precio),
                            Id_oferta_producto_linea_factura : null,
                            Id_oferta_usuario_linea_factura: null,
                            Estado_linea_factura : 1,
                            Eliminado_linea_factura: 0
                        };
                  
                  this.lineas.push(linea);
             }
           });
           
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Pago Realizado',
      subTitle: 'Tu pago se ha realizado correctamente',
      buttons: [
      {
        text: 'Inicio',
        role: 'inicio',
        handler: () => {
          this.storage.remove('carrito');
          this.storage.remove('cant_total');
          this.storage.remove('total_pagar');
          this.navCtrl.setRoot(HomePage);
        }
      },{
        text: 'Mis Pedidos',
        role: 'pedidos',
        handler: () => {
          this.storage.remove('carrito');
          this.storage.remove('cant_total');
          this.storage.remove('total_pagar');
          this.navCtrl.setRoot(FacturasPage);
        }
      }]
      
    });
    alert.present();
    this.crearFactura();
  }

  crearFactura(){
    this.facturaService.postFactura(this.id_tienda, this.total_pagar, this.id_usuario_tienda, this.lineas).subscribe();
  }

 

} 
 