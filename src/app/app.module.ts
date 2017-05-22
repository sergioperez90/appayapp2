import { DetalleTiendaPage } from './../pages/detalle-tienda/detalle-tienda';
import { TabsPage } from './../pages/tabs/tabs';
import { HomeDetallePage } from './../pages/home-detalle/home-detalle';
import { RecuperarPasswordPage } from './../pages/recuperar-password/recuperar-password';
import { RegistroDatosPage } from './../pages/registro-datos/registro-datos';
import { FilterFacturaPage } from './../pages/filter-factura/filter-factura';
import { BienvenidaPage } from './../pages/bienvenida/bienvenida';
import { OfertasService } from './../services/ofertas.service';
import { FacturasService } from './../services/facturas.service';
import { AuthService } from './../services/auth.service';
import { CarritoService } from './../services/carrito.service';
import { ProductosService } from './../services/productos.service';
import { TiendasService } from './../services/tienda.service';
import { IntroTiendaPage } from './../pages/intro-tienda/intro-tienda';
import { DetalleProductoPage } from './../pages/detalle-producto/detalle-producto';
import { PagoPage } from './../pages/pago/pago';
import { CarritoPage } from './../pages/carrito/carrito';
import { PerfilPage } from './../pages/perfil/perfil';
import { RegistroPage } from './../pages/registro/registro';
import { AccederPage } from './../pages/acceder/acceder';
import { PrincipalPage } from './../pages/principal/principal';
import { MapaInfoPage } from './../pages/mapa-info/mapa-info';
import { MapaPage } from './../pages/mapa/mapa';
import { SlidesPage } from './../pages/slides/slides';
import { DetallefacturaPage } from './../pages/facturas/detallefactura';
import { FacturasPage} from './../pages/facturas/facturas';
import { UsuariosService } from './../services/usuarios.service';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ScanProduct } from '../pages/scanproduct/scanproduct';
import { ScanStore } from '../pages/scanstore/scanstore';
import { Storage } from '@ionic/storage';
import { FlashCardComponent } from '../components/flash-card/flash-card';

import { GLIonic2EnvConfigurationModule } from 'gl-ionic2-env-configuration'; //Para las variables de entorno

//PARA TOKENS
import { AUTH_PROVIDERS, AuthHttp, AuthConfig} from 'angular2-jwt';
import { provideAuth } from 'angular2-jwt';
import { HttpModule,Http, RequestOptions } from '@angular/http';

let storage = new Storage();
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'id_token',
         tokenGetter: (() => storage.get('id_token')),
        globalHeaders: [{'Content-Type':'application/json'}],
     }), http, options);
}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ScanProduct,
    ScanStore,
    FacturasPage,
    DetallefacturaPage,
    SlidesPage,
    MapaPage,
    MapaInfoPage,
    PrincipalPage,
    AccederPage,
    RegistroPage,
    PerfilPage,
    CarritoPage,
    PagoPage,
    DetalleProductoPage,
    IntroTiendaPage,
    FlashCardComponent,
    BienvenidaPage,
    FilterFacturaPage,
    RegistroDatosPage,
    RecuperarPasswordPage,
    HomeDetallePage,
    TabsPage,
    DetalleTiendaPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    GLIonic2EnvConfigurationModule // cargar variables de entorno
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ScanProduct,
    ScanStore,
    FacturasPage,
    DetallefacturaPage,
    SlidesPage,
    MapaPage,
    MapaInfoPage,
    PrincipalPage,
    AccederPage,
    RegistroPage,
    PerfilPage,
    CarritoPage,
    PagoPage,
    DetalleProductoPage,
    IntroTiendaPage,
    BienvenidaPage,
    FilterFacturaPage,
    RegistroDatosPage,
    RecuperarPasswordPage,
    HomeDetallePage,
    TabsPage,
    DetalleTiendaPage
  ],
  providers: [
      {
        provide: AuthHttp,
        useFactory: authHttpServiceFactory,
        deps: [Http, RequestOptions]
      },
      {
        provide: ErrorHandler, 
        useClass: IonicErrorHandler
      }, 
    UsuariosService, 
    TiendasService, 
    ProductosService, 
    CarritoService,
    AuthService, 
    FacturasService,
    OfertasService,
    Storage
  ]
  
})
export class AppModule {}
