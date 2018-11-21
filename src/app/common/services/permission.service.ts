import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DevicePlatform } from '../models/device-platform.model';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Permission } from '../enums/permission.enum';
import { PluginEnabled } from '../enums/enabled-plugin.enum';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  /**
   * Indica que dispositivo usa la aplicación
   */
  devicePlatform: DevicePlatform;

  isReady = false;

  constructor(private diagnostic: Diagnostic) {

    }

  /**
   * Obtiene la plataforma del dispositivo que se está usando en la aplicación.
   * Platform no funciona en servicios.
   */
  getDevice(): DevicePlatform {
      return this.devicePlatform;
  }

  /**
   * Establece el dispositivo
   * @param device dispositivo que usa la aplicacion
   */
  setDevice(device: DevicePlatform) {
    this.devicePlatform = device;
  }

  /**
   * Devuelve el estatus del permiso de localización de la aplicación en el dispositivo.
   * `SOLO PARA MÓVILES`
   * @param device Plataforma del dispositivo `see DevicePlatform`
   */
  async getPositionPermission(device: DevicePlatform): Promise<Permission> {

      if (device.isAndroid || device.isIos) {
        return await this.diagnostic.getLocationAuthorizationStatus()
        .then( async (status: any) => {
          switch (status) {
            case 'NOT_REQUESTED':
            return Permission.NOT_REQUESTED;

            case 'DENIED':
            return Permission.DENIED;

            case 'GRANTED':
            return Permission.GRANTED;

          }
        }).catch(error => {
          return Permission.ERROR;
        });
      } else {
        // WEB
        return Permission.UNKNOWN;
      }
  }

  /**
   * Indica si el dispositivo tiene habilitado el GPS. `SOLO PARA MÓVILES`
   * @param device Plataforma del dispositivo `see DevicePlatform`
   */
  async getLocationEnabled(device: DevicePlatform): Promise<PluginEnabled> {
    if (device.isAndroid || device.isIos) {
      return await this.diagnostic.isLocationEnabled().then((result: boolean) => {
        if (result) {
          return PluginEnabled.ENABLED;
        } else {
          return PluginEnabled.DISABLED;
        }
      }).catch(error => {
        return PluginEnabled.ERROR;
      });
    } else {
      // WEB
      return PluginEnabled.UNKNOWN;
    }

  }
}
