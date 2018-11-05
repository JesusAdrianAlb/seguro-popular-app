/**
 * Representa la información de geolocalización generada por el GPS del teléfono
 */
export interface CoordinatesData {
    /**
     * Representa la precisión de la latitud y longitud, expresado en metros
     */
    accuracy: number;
    /**
     * Representa la posición altitud en relación con el nivel del mar.
     * Este valor puede ser nulo. Expresado en metros
     */
    altitude: number;
    /**
     * Representa la precisión de altitud. Expresado en metros. Este valor puede ser nulo
     */
    altitudeAccuracy: number;
    /**
     * Representa la dirección del dispositivo en su desplazamiento. Este valor expresado en grados,
     * indica que tan lejos se encuentra del norte. 0 representa el verdadero norte, y la dirección es determinada
     * de derecha a izquierda (clockwise) (Lo que significa que 90 es el ESTE y 270 es el OESTE).
     * Si "speed" es 0, "heading" es incalculable (Nan). Si el dispositivo no es capaz de proporcionar esta información, este valor es null
     */
    heading: number;
    /**
     * Representa la posición de latitud en grados decimales
     */
    latitude: number;
    /**
     * Representa la posición de longitud en grados decimales
     */
    longitude: number;
    /**
     * Representa la velocidad del dispositivo en metros/s. Este valor puede ser nulo
     */
    speed: number;
}
