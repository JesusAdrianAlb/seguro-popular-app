/**
 * Enumerable que indica el status del permiso de algún plugin
 */
export enum Permission {
    /**
     * Sin solicitar
     */
    NOT_REQUESTED,
    /**
     * Denegado
     */
    DENIED,
    /**
     * Autorizado
     */
    GRANTED,
    /**
     * Desconocido. `Solo en caso WEB`
     */
    UNKNOWN,
    /**
     * En caso de error únicamente
     */
    ERROR
}
