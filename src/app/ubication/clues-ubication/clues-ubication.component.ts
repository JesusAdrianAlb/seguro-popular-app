/**
 * Core imports dfor angular
 */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
/**
 * Plugins imports for native devices
 */
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { MatDialog } from '@angular/material';
/**
 * Imports for google maps
 */
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  HtmlInfoWindow,
} from '@ionic-native/google-maps/ngx';
import { CoordinatesData } from '../../common/models/geolocation.model';
/**
 * Components for behaivior
 */
import { FeatureDisabledComponent } from '../../common/modals/feature-disabled/feature-disabled.component';
import { FeatureDeniedComponent } from '../../common/modals/feature-denied/feature-denied.component';
import { MarkerData } from '../../common/models/marker-data.models';
import { PermissionService } from '../../common/services/permission.service';
import { DevicePlatform } from '../../common/models/device-platform.model';
import { Permission } from '../../common/enums/permission.enum';
import { PluginEnabled } from '../../common/enums/enabled-plugin.enum';

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
   * Indica si el componente es llamado en android
   */
  isAndroid = false;
  /**
   * Indica si el componente es llamado en ios
   */
  isIos = false;
  /**
   * Indica si el component es llamado en web
   */
  isWeb = false;
  /**
   * Indica si el dispositivo está listo para las funcionalidades nativas
   */
  readyDevice = false;
  /**
   * Indica si se tiene habilitado el localizador de los celulares
   */
  hasLocationEnabled = false;
  /**
   * Indica si se tiene permiso a la localización del telefono
   */
  hasLocationPermission = false;
  /**
   * Indica si el permiso de ubicacion esta negado
   */
  locationPermissionDenied = false;
  /**
   * google maps
   */
  map: any;
  /**
   * Indica la posicion actual del dispositivo
   */
  currentPosition: CoordinatesData;
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
   * @param geolocation Geoposicion de dispositivo
   * @param platform elemento que indica que plataforma se esta utilizando
   * @param diagnostic Elemento que obtiene los permisos y solicita permisos a los plugins del celular
   * @param dialog dialog de apertura para indicaciones
   */
  constructor(private geolocation: Geolocation,
    private permissionService: PermissionService,
    private platform: Platform,
    private diagnostic: Diagnostic, private dialog: MatDialog) {
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
        break;

        case PluginEnabled.ENABLED:
        break;

        case PluginEnabled.ERROR:
        break;

        case PluginEnabled.UNKNOWN:
        break;
      }
    }).catch(error => {

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
   * Checa los permisos del usuario para dispositivos móviles
   */
  async CheckPermission() {

      if (!this.isWeb) {

        this.hasLocationEnabled = await this.diagnostic.isLocationEnabled().then((result: boolean) => {
          return result;
        }).catch((error) => {
          return false;
        });
        if (this.hasLocationEnabled) {
          // Verificar los permisos de la aplicacion en cuanto ubicacion
          await this.diagnostic.getLocationAuthorizationStatus().then(async (status: any) => {
            switch (status) {
              case 'NOT_REQUESTED':
                await this.diagnostic.requestLocationAuthorization('always');
              break;
              case 'DENIED':
              this.locationPermissionDenied = true;
                this.dialog.open(FeatureDeniedComponent, { width: '350px', data: {title: 'Ubicación sin permisos',
                message: 'Entre a Administrador de aplicaciones para darle permisos'}});
              break;
              case 'GRANTED':
              this.hasLocationPermission = true;
              break;
            }
          }).catch((error) => {

          });

          if (!this.hasLocationPermission) {
            this.hasLocationPermission = await this.diagnostic.isLocationAuthorized().then((result: any) => {
              if (result) {
                return true;
              } else {
                this.locationPermissionDenied = true;
                this.dialog.open(FeatureDeniedComponent, { width: '350px', data: { title: 'Ubicación sin permisos',
                messsage: 'No se puede ubicar su centro de salud si no se da permsisos a la aplicación de ubicación.' +
                'Entre a Administrador de aplicaciones para darle permisos'} });
                return false;
              }
            }).catch((error) => {
              return false;
            });
          }

        } else {
          // No se tiene el GPS activado, enviar aleta y prompt
          this.dialog.open(FeatureDisabledComponent, { width: '350px',
          data: { title: 'Ubicación desactivada',
          message: 'Es necesario activar la ubicación para localizar su centro de salud más cercano'}});

        }
      } else {
        // La ubicacion en web funiona normal. Utilizando geolocation
      }
  }

  /**
   * Genera el mapa nativamente
   * @param currentPosition Posicion actual donde la camara se posiciona
   */
  async generateMap(currentPosition: CoordinatesData) {

    this.generatedMap = true;
    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: currentPosition.latitude,
          lng: currentPosition.longitude
        },
        zoom: 15,
        tilt: 30
      }
    };
    const element = document.getElementById('map_canvas');
    this.map = GoogleMaps.create(element, mapOptions);

    await this.map.one(GoogleMapsEvent.MAP_READY);

    // Marcadores generales
    for (const iterator of this.markers) {
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
   * Actualiza el mapa en la version SDK
   */
  updateMap() {

  }

  /**
   * Obtiene la posición del dispositivo mediante GPS del dispositivo, sirve igual en WEB
   */
  async getPosition() {

    await this.geolocation.getCurrentPosition().then((data) => {
      this.currentPosition = data.coords;
      if (this.isWeb) {
        this.generateMapWeb(this.currentPosition);
      } else {

        this.generateMap(this.currentPosition);
      }
    }).catch(error => {
      console.log(error);
    });
    this.suscriptions.push(this.geolocation.watchPosition().subscribe((data) => {
      this.currentPosition = data.coords;
      // this.generateMap(this.currentPosition);
    }));
  }

  /**
   * Generación de mapa con la API Web
   */
  generateMapWeb(currentPosition: CoordinatesData) {
    const element = document.getElementById('map_canvas');

    const bounds = new google.maps.LatLngBounds();

    const lnt = this.seeYouLocation ?
      new google.maps.LatLng({lat: currentPosition.latitude, lng: currentPosition.longitude}) :
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
        position: lnt
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



    // const zoom = this.map.getZoom();
    // if (this.map.getZoom() > 18) {
    //   this.map.setZoom(18);
    // }

  }

  /**
   * Actualiza el mapa en la versión WEB
   */
  updateMapWeb() {

  }

}
