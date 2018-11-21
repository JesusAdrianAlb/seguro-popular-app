/**
 * Core imports dfor angular
 */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
/**
 * Plugins imports for native devices
 */
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { MatDialog } from '@angular/material';
/**
 * Imports for google maps
 */
import {
  GoogleMaps,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker,
  HtmlInfoWindow,
  Circle,
} from '@ionic-native/google-maps/ngx';

/**
 * Components for behaivior
 */
import { FeatureDisabledComponent } from '../../common/modals/feature-disabled/feature-disabled.component';
import { MarkerData } from '../../common/models/marker-data.models';
import { PermissionService } from '../../common/services/permission.service';
import { DevicePlatform } from '../../common/models/device-platform.model';
import { Permission } from '../../common/enums/permission.enum';
import { PluginEnabled } from '../../common/enums/enabled-plugin.enum';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';
import { UbicationService } from '../../common/services/ubication.service';

/**
 * Para evitar errores en typeScript
 */
declare var google;

@Component({
  selector: 'app-clues-ubication',
  templateUrl: './clues-ubication.component.html',
  styleUrls: ['./clues-ubication.component.scss']
})
export class CluesUbicationComponent implements OnInit, OnDestroy {

  /**
   * Suscripciones del componente
   */
  suscriptions: Subscription[]  = [];

  /**
   * google maps
   */
  map: any;
  /**
   * Indica la posicion actual del dispositivo
   */
  currentPosition: Geoposition;
  generatedMap = false;
  cluesData: any;

  initialZoom = true;
  /**
   * Dispositivo que usa la aplicación
   */
  devicePlatform: DevicePlatform;
  /**
   * Valor de enumerable que contiene si existe permiso de ubicacion
   */
  locationPermision: Permission;
  /**
   * Valor de enumerable que contiene si la ubicación esta habilitada
   */
  locationEnabled: PluginEnabled;


  /**
   * Marcadores a señalar
   */
  @Input() markers: MarkerData[] = [];
  @Input() cluesMarkers: MarkerData[] = [];
  @Input() maoMarkers: MarkerData[] = [];
  @Input() seeYouLocation = false;
  // @Input() searchFilter = false;

  /**
   * Marcadores activos en el mapa
   */
  private activeMarkers: Marker[] = [];

  /**
   * @param geolocation Geoposicion de dispositivo
   * @param platform elemento que indica que plataforma se esta utilizando
   * @param diagnostic Elemento que obtiene los permisos y solicita permisos a los plugins del celular
   * @param dialog dialog de apertura para indicaciones
   */
  constructor(
    private permissionService: PermissionService,
    private ubicationService: UbicationService,
    private platform: Platform,
    private dialog: MatDialog) {
   }

  ngOnInit() {

    this.platform.ready().then(async () => {
      this.devicePlatform = this.permissionService.getDevice();
      if (this.devicePlatform) {
      } else {
        this.devicePlatform = {
          isAndroid: false,
          isIos: false,
          isWeb: false
        };
        this.devicePlatform.isAndroid = this.platform.is('android');
        this.devicePlatform.isIos = this.platform.is('ios');
        this.devicePlatform.isWeb = !this.devicePlatform.isAndroid && !this.devicePlatform.isIos ? true : false;
        this.permissionService.setDevice(this.devicePlatform);
      }
      this.locationEnabled = await this.permissionService.getLocationEnabled(this.devicePlatform);

      switch (this.locationEnabled) {
        case PluginEnabled.DISABLED:
        this.dialog.open(FeatureDisabledComponent , { width: '350px', data: { title: 'Ubicación deshabilitada',
        message: 'Es necesario habilitar el GPS del dispositivo' }});
        break;

        case PluginEnabled.ENABLED:
        if (this.devicePlatform.isAndroid || this.devicePlatform.isIos) {
          this.generateMap();
        } else if (this.devicePlatform.isWeb) {
          this.generateMapWeb();
        }
        break;

        case PluginEnabled.ERROR:
        this.dialog.open(ContentMessageComponent, { width: '350px',
        data: { title: 'Error', icon: 'warning', color: 'red',
          message: 'Ocurrío un error inesperado, vuelva a intentarlo más tarde' }});
        break;

        case PluginEnabled.UNKNOWN:
        this.generateMapWeb();
        break;
      }
    }).catch(error => {
      this.dialog.open(ContentMessageComponent, { width: '350px',
        data: { title: 'Error', icon: 'warning', color: 'red',
          message: 'Ocurrío un error inesperado, vuelva a intentarlo más tarde' }});
    });

  }

  ngOnDestroy() {
    if (this.suscriptions.length > 0) {
      this.suscriptions.forEach(suscription => {
        suscription.unsubscribe();
      });
    }
  }


  /**
   * Genera el mapa nativamente
   * @param currentPosition Posicion actual donde la camara se posiciona
   */
  async generateMap(suscribePosition: boolean = true) {

    this.currentPosition = await this.ubicationService.getCurrentPosition();

    if (suscribePosition) {
      this.suscriptions.push(this.ubicationService.getWatchPosition().subscribe((position: Geoposition) => {
        this.currentPosition = position;
        // update map
        this.updateMap(position);
      }));
    }

    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.currentPosition.coords.latitude,
          lng: this.currentPosition.coords.longitude
        },
        zoom: 15,
        tilt: 30
      }
    };
    const element = document.getElementById('map_canvas');
    this.map = GoogleMaps.create(element, mapOptions);

    await this.map.one(GoogleMapsEvent.MAP_READY);

    // tu marcador
    const markerOwn: Circle = this.map.addCircleSync({
      title: 'Tu ubicación',
      fillColor: '#3779e0',
      strokeColor: '#3779e0',
      radius: 1,
      fillOpacity: 1,
      strokeWeight: 0,
      animation: 'DROP',
      name: 'Tu ubicación',
      center: {
        lat: this.currentPosition.coords.latitude,
        lng: this.currentPosition.coords.longitude
      },
      clickable: true
    });

    const htmlInfoWindowOwn = new HtmlInfoWindow();
    const frameOwn: HTMLElement = document.createElement('div');
    frameOwn.innerHTML = [
      '<div class=".div-map">',
      `<h3 style="color:red">Tu ubicacion</h3>`,
      '<button mat-raised-button>Boton</button>',
      '</div>'
      ].join('');

      frameOwn.getElementsByTagName('button')[0].addEventListener('click', (data) => {
      alert(this.cluesData);
    });

    htmlInfoWindowOwn.setContent(frameOwn, { width: '280px', height: '100px'});

    this.suscriptions.push(markerOwn.on(GoogleMapsEvent.CIRCLE_CLICK).subscribe((data) => {
      // alert('clicked');
      // alert(data);
      // this.cluesData = markerOwn.get('name');
      // alert(this.cluesData);
      // alert(JSON.stringify(marker.get('styles')));
      // alert(marker.get('name'));
      // htmlInfoWindowOwn.open(markerOwn);
    }));

    // Marcadores generales
    for (const iterator of this.markers) {
      const marker: Marker = this.map.addMarkerSync({
        title: iterator.title,
        icon: iterator.icon,
        animation: iterator.animacion,
        name: iterator.clues,
        position: {
          lat: iterator.latitud,
          lng: iterator.longitude
        }
      });

      const htmlInfoWindow = new HtmlInfoWindow();
      const frame: HTMLElement = document.createElement('div');
      frame.innerHTML = [
        '<div class=".div-map">',
        `<h3 style="color:red">${iterator.title}</h3>`,
        '<button mat-raised-button>Boton</button>',
        '</div>'
        ].join('');

      frame.getElementsByTagName('button')[0].addEventListener('click', (data) => {
        alert(this.cluesData);
      });

      htmlInfoWindow.setContent(frame, { width: '280px', height: '100px'});

      this.suscriptions.push(marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((data) => {
        // alert('clicked');
        // alert(data);
        this.cluesData = marker.get('name');
        // alert(JSON.stringify(marker.get('styles')));
        // alert(marker.get('name'));
        htmlInfoWindow.open(marker);
      }));
    }

    // Marcadores de clues
    for (const iterator of this.cluesMarkers) {
      const marker = this.map.addMarkerSync({
        title: iterator.title,
        icon: iterator.icon,
        animation: iterator.animacion,
        name: iterator.clues,
        position: {
          lat: iterator.latitud,
          lng: iterator.longitude
        }
      });

      const htmlInfoWindow = new HtmlInfoWindow();
      const frame: HTMLElement = document.createElement('div');
      frame.innerHTML = [
        '<div class=".div-map">',
        `<h3 style="color:red">${iterator.title}</h3>`,
        '<button mat-raised-button>Boton</button>',
        '</div>'
        ].join('');

      frame.getElementsByTagName('button')[0].addEventListener('click', (data) => {
        alert(this.cluesData);
      });

      htmlInfoWindow.setContent(frame, { width: '280px', height: '100px'});

      this.suscriptions.push(marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((data) => {
        // alert('clicked');
        // alert(data);
        this.cluesData = marker.get('name');
        // alert(JSON.stringify(marker.get('styles')));
        // alert(marker.get('name'));
        htmlInfoWindow.open(marker);
      }));
    }

    // Marcadores de mao
    for (const iterator of this.maoMarkers) {
      const marker = this.map.addMarkerSync({
        title: iterator.title,
        icon: iterator.icon,
        animation: iterator.animacion,
        name: iterator.clues,
        position: {
          lat: iterator.latitud,
          lng: iterator.longitude
        }
      });

      const htmlInfoWindow = new HtmlInfoWindow();
      const frame: HTMLElement = document.createElement('div');
      frame.innerHTML = [
        '<div class=".div-map">',
        `<h3 style="color:red">${iterator.title}</h3>`,
        '<button mat-raised-button>Boton</button>',
        '</div>'
        ].join('');

      frame.getElementsByTagName('button')[0].addEventListener('click', (data) => {
        alert(this.cluesData);
      });

      htmlInfoWindow.setContent(frame, { width: '280px', height: '100px'});

      this.suscriptions.push(marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((data) => {
        // alert('clicked');
        // alert(data);
        this.cluesData = marker.get('name');
        // alert(JSON.stringify(marker.get('styles')));
        // alert(marker.get('name'));
        htmlInfoWindow.open(marker);
      }));
    }
  }

  /**
   * Actualiza el mapa
   * @param position posicion del marcador de posicion del dispositivo
   */
  updateMap(position: Geoposition) {

  }


  /**
   * Generación de mapa con la API Web
   */
  async generateMapWeb(suscribePosition: boolean = false) {
    const element = document.getElementById('map_canvas');

    const bounds = new google.maps.LatLngBounds();

    this.currentPosition = await this.ubicationService.getCurrentPosition();

    if (suscribePosition) {
      this.suscriptions.push(this.ubicationService.getWatchPosition().subscribe((position: Geoposition) => {
        this.currentPosition = position;
        // update map
        this.updateMapWeb(position);
      }));
    }

    const lnt = this.seeYouLocation ?
      new google.maps.LatLng({lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude}) :
      new google.maps.LatLng({lat: this.cluesMarkers[0].latitud, lng: this.cluesMarkers[0].longitude});

    const mapOptions = {
      center: lnt,
      zoom: 18,
      tilt: 30
    };

    this.map = new google.maps.Map(element, mapOptions);

    // Tu marcador
    if (this.seeYouLocation) {

      // console.table(this.currentPosition);
      const markerOwn = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: lnt,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#3779e0',
          stokeColor: '#3779e0',
          scale: 10,
          fillOpacity: 1,
          strokeWeight: 0,
        }
      });

      const infoWindowOwn = new google.maps.InfoWindow({
        content: '<h4>Information! Mi marcador</h4>'
      });

      google.maps.event.addListener(markerOwn, 'click', () => {
        infoWindowOwn.open(this.map, markerOwn);
      });

      bounds.extend(markerOwn.position);
    }

    // Marcadores generales
    for (const iterator of this.markers) {
      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      const infoWindow = new google.maps.InfoWindow({
        content: '<h4>Information!</h4>'
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });

      bounds.extend(marker.position);
    }

    for (const iterator of this.cluesMarkers) {

      // console.log(iterator);
      const mark = new google.maps.LatLng({lat: iterator.latitud, lng: iterator.longitude});

      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: mark
      });

      const infoWindow = new google.maps.InfoWindow({
        content: '<h4>' + iterator.clues + '</h4>'
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });

      bounds.extend(marker.position);
    }

    if (!this.seeYouLocation) {
      google.maps.event.addListener(this.map, 'zoom_changed', () => {
        if (this.map.getZoom() > 18 && this.initialZoom) {
          this.map.setZoom(18);
          this.initialZoom = false;
        }
      });
    }

    this.map.fitBounds(bounds);

  }

  /**
   * Actualiza el mapa WEB
   * @param position posicion del marcador de posicion del dispositivo
   */
  updateMapWeb(position: Geoposition) {

  }


}
