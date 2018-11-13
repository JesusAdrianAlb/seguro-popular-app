/**
 * Indica si un plugin del celular está habilitado o no
 */
export enum PluginEnabled {
    /**
     * Habilitado
     */
    ENABLED,
    /**
     * Deshabilitado
     */
    DISABLED,
    /**
     * Error desconocido
     */
    ERROR,
    /**
     * Sin determinar. `SOLO PARA WEB`
     */
    UNKNOWN
}
