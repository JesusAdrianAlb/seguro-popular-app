/**
 * Core imports dfor angular
 */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
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
  GoogleMap,
  LatLng,
  LatLngBounds,
  CameraPosition,
  ILatLng,
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
import { Clues } from '../../common/models/clues.model';
import { LoadModalComponent } from '../../common/modals/load-modal/load-modal.component';
import { FormControl } from '@angular/forms';

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
  map: GoogleMap;
  /**
   * Mapa version web
   */
  mapWeb: any;
  mapRoute: any;
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

  startRoute = false;

  origin: LatLng;

  destiny: LatLng;

  directionService = new google.maps.DirectionsService();

  directionDisplay = new google.maps.DirectionsRenderer();

  filteredOptions: Observable<Clues[]>;

  cluesSelected: Clues;

  /**
   * Marcadores a señalar
   */
  @Input() markers: MarkerData[] = [];
  @Input() cluesMarkers: MarkerData[] = [];
  @Input() maoMarkers: MarkerData[] = [];
  @Input() allClues: Clues[] = [];
  @Input() seeYouLocation = false;
  @Input() mode: string;
  // @Input() searchFilter = false;

  searchFormControl = new FormControl();
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
   * Filtro de centro de salud
   * @param value Texto a filtrar
   */
  filteredClues(value: string) {
   if (value.length > 4) {
     this.filteredOptions = of( this.allClues.filter( x => x.INSTITUCION.includes(value.toUpperCase())));
     // console.log(this.filteredOptions);
   } else {
     this.filteredOptions = of([]);
   }

  }

  onSelectClues(clues: Clues) {
    this.cluesSelected = clues;
    // console.log(this.cluesSelected);
    this.filteredOptions = of([]);
    // console.table(this.allClues.filter(x => x.ID === this.cluesSelected.ID));
    this.destiny = new LatLng(this.cluesSelected.LATITUD, this.cluesSelected.LONGITUD);

    this.origin = new LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);

    this.onCalculateRoute();
  }

  /**
   * Genera el mapa nativamente
   * @param currentPosition Posicion actual donde la camara se posiciona
   */
  async generateMap(suscribePosition: boolean = true) {

    this.currentPosition = await this.ubicationService.getCurrentPosition();
    this.origin = new LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);

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

    const markersBounds: LatLng[] = [];
    let markersBoundsMap: LatLngBounds;
    // tu marcador
    if (this.seeYouLocation) {

      const tmp = new LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);
      markersBounds.push(tmp);
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
    }

    // Marcadores generales
    for (const iterator of this.markers) {
      const tmp = new LatLng(iterator.latitud, iterator.longitude);
      markersBounds.push(tmp);
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
      const tmp = new LatLng(iterator.latitud, iterator.longitude);
      this.destiny = tmp;
      markersBounds.push(tmp);
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
      const tmp = new LatLng(iterator.latitud, iterator.longitude);
      markersBounds.push(tmp);
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

    markersBoundsMap = new LatLngBounds(markersBounds);

    this.map.animateCamera({
      target: markersBoundsMap,
      tilt: 30,
      duration: 1000
    });
  }

  /**
   * Actualiza el mapa
   * @param position posicion del marcador de posicion del dispositivo
   */
  updateMap(position: Geoposition) {

  }

  async onCalculateRoute() {
    const dialogRef = this.dialog.open(LoadModalComponent, { width: '350px', data: { message: 'Buscando ruta de llegada'}});
    this.startRoute = true;
    // this.mode = 'route';
    // console.log('onCalculate');
    const element = document.getElementById('map_canvas_route');
    const origin = new google.maps.LatLng(this.origin.lat, this.origin.lng);
    const destiny = new google.maps.LatLng(this.destiny.lat, this.destiny.lng);

    const mapOptions = {
      center: origin,
      zoom: 18,
      tilt: 30
    };

    this.mapRoute = new google.maps.Map(element, mapOptions);
    this.directionDisplay.setMap(this.mapRoute);
    this.directionDisplay.setPanel(document.getElementById('directionsPanel'));

    let request = {
      origin: origin,
      destination: destiny,
      travelMode: 'DRIVING'
    };

    await this.directionService.route(request, (result, status) => {
      dialogRef.close();
      if (status === 'OK') {
        this.directionDisplay.setDirections(result);
      }
    });

    if (this.seeYouLocation) {
      this.suscriptions.push(this.ubicationService.getWatchPosition().subscribe(async (position: Geoposition) => {
        this.currentPosition = position;
        request = {
          origin: new google.maps.LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude),
          destination: destiny,
          travelMode: 'DRIVING'
        };
        await this.directionService.route(request, (result, status) => {
          if (status === 'OK') {
            this.directionDisplay.setDirections(result);
          }
        });
      }));
    }

  }

  /**
   * Generación de mapa con la API Web
   */
  async generateMapWeb(suscribePosition: boolean = false) {
    const element = document.getElementById('map_canvas');

    const bounds = new google.maps.LatLngBounds();

    this.currentPosition = await this.ubicationService.getCurrentPosition();

    const lnt = this.seeYouLocation ?
      new google.maps.LatLng({lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude}) :
      new google.maps.LatLng({lat: this.cluesMarkers[0].latitud, lng: this.cluesMarkers[0].longitude});

    const mapOptions = {
      center: lnt,
      zoom: 18,
      tilt: 30
    };

    this.mapWeb = new google.maps.Map(element, mapOptions);

    // Tu marcador
    if (this.seeYouLocation) {

      this.origin = new LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);
      // console.table(this.currentPosition);
      const markerOwn = new google.maps.Marker({
        map: this.mapWeb,
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
        infoWindowOwn.open(this.mapWeb, markerOwn);
      });

      bounds.extend(markerOwn.position);
    }

    // Marcadores generales
    for (const iterator of this.markers) {
      const marker = new google.maps.Marker({
        map: this.mapWeb,
        animation: google.maps.Animation.DROP,
        position: this.mapWeb.getCenter()
      });

      const infoWindow = new google.maps.InfoWindow({
        content: '<h4>Information!</h4>'
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.mapWeb, marker);
      });

      bounds.extend(marker.position);
    }

    for (const iterator of this.cluesMarkers) {

      // console.log(iterator);
      this.destiny = new LatLng(iterator.latitud, iterator.longitude);
      const mark = new google.maps.LatLng({lat: iterator.latitud, lng: iterator.longitude});

      const marker = new google.maps.Marker({
        map: this.mapWeb,
        animation: google.maps.Animation.DROP,
        position: mark
      });

      const infoWindow = new google.maps.InfoWindow({
        content: '<h4>' + iterator.clues + '</h4>'
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.mapWeb, marker);
      });

      bounds.extend(marker.position);
    }

    if (!this.seeYouLocation) {
      google.maps.event.addListener(this.mapWeb, 'zoom_changed', () => {
        if (this.mapWeb.getZoom() > 18 && this.initialZoom) {
          this.mapWeb.setZoom(18);
          this.initialZoom = false;
        }
      });
    }

    this.mapWeb.fitBounds(bounds);

  }

  /**
   * Actualiza el mapa WEB
   * @param position posicion del marcador de posicion del dispositivo
   */
  updateMapWeb(position: Geoposition) {

  }

}
