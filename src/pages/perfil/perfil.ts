import { UsuariosService } from './../../services/usuarios.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import {ElementRef,ViewChild, Renderer,} from '@angular/core';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage{
  
//@ViewChild('inputvariable') el:ElementRef;
  email;
  nombre;
  dni;
  direccion;
  cp;
  foto;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private rd: Renderer,
    public usuarioService: UsuariosService,
    public loadingCtrl: LoadingController,
    public menu: MenuController
   ) {
     //Mostramos un cargando
     let loader = this.loadingCtrl.create({});
      loader.present();

     this.usuarioService.getToken().subscribe(
        usuario =>{
            this.nombre = usuario.data.Nombre_usuario;
            this.email = usuario.data.Email_usuario;
            if(usuario.data.Foto_usuario!="")
              this.foto = usuario.data.Foto_usuario;
            else
              this.foto = "assets/logo.png"
            this.dni = usuario.data.DNI_usuario;
            this.direccion = usuario.data.Direccion_usuario;
            this.cp = usuario.data.CP_usuario;
            loader.dismiss();
          }
      );   

   }


  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

 ngOnInit() {
  this.menu.enable(true);

   // this.rd.invokeElementMethod(this.el.nativeElement,'focus');



  }

  SeleccionarGaleria(){
 let actionSheet = this.actionSheetCtrl.create({
      title: 'Imagen de perfil',
      buttons: [
        {
          text: 'Galería',
          role: 'destructive',
          icon: 'image',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Cámara',
          icon: 'camera',
          handler: () => {
            console.log('Archive clicked');
          }
        }
      ]
    });
    actionSheet.present();
  
  }

}
 