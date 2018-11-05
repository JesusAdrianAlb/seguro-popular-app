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
  map: GoogleMap;
  /**
   * Indica la posicion actual del dispositivo
   */
  currentPosition: CoordinatesData;
  generatedMap = false;
  cluesData: any;

  @Input() markers: Marker[] = [];
  @Input() searchFilter = false;


  /**
   * @param geolocation Geoposicion de dispositivo
   * @param platform elemento que indica que plataforma se esta utilizando
   * @param diagnostic Elemento que obtiene los permisos y solicita permisos a los plugins del celular
   * @param dialog dialog de apertura para indicaciones
   */
  constructor(private geolocation: Geolocation, private platform: Platform,
    private diagnostic: Diagnostic, private dialog: MatDialog) {
   }

  async ngOnInit() {

    this.readyDevice = await this.platform.ready().then(() => {
      return true;
    }).catch(error => {
      return false;
    });


    this.isAndroid = this.platform.is('android');
    this.isIos = this.platform.is('ios');
    this.isWeb = !this.isAndroid && !this.isIos ? true : false;

    this.CheckPermission();
    this.getPosition();

  }

  ngOnDestroy() {
    if (this.suscriptions.length > 0) {
      this.suscriptions.forEach(suscription => {
        suscription.unsubscribe();
      });
    }
  }

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

    const marker: Marker = this.map.addMarkerSync({
      title: 'Ubicación',
      icon: 'red',
      animation: 'DROP',
      name: 'Nombre de la clues',
      position: {
        lat: currentPosition.latitude,
        lng: currentPosition.longitude
      },
    });

    const htmlInfoWindow = new HtmlInfoWindow();
    const frame: HTMLElement = document.createElement('div');
    frame.innerHTML = [
      '<div class=".div-map">',
      '<h3 style="color:red">Texto de prueba</h3>',
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

  async getPosition() {

    await this.geolocation.getCurrentPosition().then((data) => {
      this.currentPosition = data.coords;
      this.generateMap(this.currentPosition);
    });
    this.suscriptions.push(this.geolocation.watchPosition().subscribe((data) => {
      this.currentPosition = data.coords;
      // this.generateMap(this.currentPosition);
    }));
  }

}
