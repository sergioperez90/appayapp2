import { MapaInfoPage } from './../mapa-info/mapa-info';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActionSheetController,ModalController } from 'ionic-angular';


declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {

  
  @ViewChild('map') mapElement: ElementRef;
  map: any;


  constructor(public navCtrl: NavController, public modalCtrl: ModalController,public actionSheetCtrl: ActionSheetController) {
 
  }

  ngOnInit(){
    this.loadMap();
  }
 

 
  loadMap(){
    let latLng = new google.maps.LatLng(38.389390, -0.500417);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      //type: this.marcadorguapo;
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";          
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    //infoWindow.open(this.map, marker);
      this.navCtrl.push(MapaInfoPage);

    
  });
 
}

}
