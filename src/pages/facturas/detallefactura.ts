import { FacturasService } from './../../services/facturas.service';

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'

//DETALLE FACTURA
@Component({
  selector: 'page-detallefactura',
  templateUrl: 'detallefactura.html',
})
export class DetallefacturaPage {
  factura;
  lineas = [];
  importe;
  iva;
  constructor(public loadingCtrl:LoadingController, params: NavParams, public actionSheetCtrl: ActionSheetController, public facturasService: FacturasService) {
    this.factura = params.data.factura;
  }
  ngOnInit(){
    let loader = this.loadingCtrl.create({});
    loader.present();
    this.facturasService.getLineaFactura(this.factura.id).subscribe(
                lineasfactura =>{
                    for(var i = 0; i < lineasfactura.length; i++){
                    let linea = {
                          cantidad: lineasfactura[i].Cantidad_linea_factura,
                          nombre: lineasfactura[i].Nombre_producto,
                          precio_producto: lineasfactura[i].Precio_producto,
                          total_linea: lineasfactura[i].Total_linea_factura
                        };
                      this.lineas.push(linea);
                  }
                  this.importe = Math.round((this.factura.importe/1.21)*100)/100;
                  this.iva = Math.round((this.factura.importe - this.importe)*100)/100;
                  loader.dismiss();
                }
    );
  }

 
}
