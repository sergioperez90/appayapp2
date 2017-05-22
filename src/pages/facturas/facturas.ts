import { FilterFacturaPage } from './../filter-factura/filter-factura';
import { UsuariosService } from './../../services/usuarios.service';
import { FacturasService } from './../../services/facturas.service';
import { DetallefacturaPage } from './detallefactura';

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';


//FACTURA
@Component({
  selector: 'page-facturas',
  templateUrl: 'facturas.html',
})

export class FacturasPage {
  facturas = [];

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public facturasService: FacturasService, public usuarioService: UsuariosService, public loadingCtrl: LoadingController) {
    
  }

  ngOnInit(){
    let loader = this.loadingCtrl.create({});
      loader.present();
    this.usuarioService.getToken().subscribe(
          usuario =>{
              this.facturasService.getFacturasUsuario(usuario.data.Id_usuario).subscribe(
                facturas =>{
                  for(let i = 0; i<facturas.length ; i++){
                    if(facturas[i].Eliminado_factura != 1){
                      let factura = {
                            'title': facturas[i].Nombre_tienda,
                            'id': facturas[i].Id_factura,
                            'direccion': facturas[i].Direccion_tienda,
                            'fecha': facturas[i].Fecha_factura.split("T")[0],
                            'cif': facturas[i].CIF_tienda,
                            'provincia':facturas[i].Provincia_tienda,
                            'ciudad': facturas[i].Localidad_tienda,
                            'cp': facturas[i].CP_tienda,
                            'tlf':facturas[i].Telefono_tienda,
                            'importe': facturas[i].Total_factura,
                            'imagen': facturas[i].Logo_tienda
                        };
                        this.facturas.push(factura);
                    }
                  }
                  loader.dismiss();
                  
                }
              );
          }
    );
    
    
  }

  abrirDetalleFactura(factura) {
    this.navCtrl.push(DetallefacturaPage , { factura: factura });
  }

   filterPage() {
      let modal = this.modalCtrl.create(FilterFacturaPage);
      modal.present();
   }

}