/**
 * Representa la plataforma del dispositivo que consulta la aplicación
 */
export interface DevicePlatform {
    /**
     * Indica si el dispositivo es WEB
     */
    isWeb: boolean;
    /**
     * Indica si el dispositivo es ANDROID
     */
    isAndroid: boolean;
    /**
     * Indica si el disposotivo es IOS
     */
    isIos: boolean;
}
