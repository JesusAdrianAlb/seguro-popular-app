/**
 * Información básica de la clues, junto con so longitud, latitud
 * Entragados por la API suissy
 */
export interface Clues {
    /**
     * Domicilio de la clues
     */
    DOMICILIO: string;
    /**
     * Estado de la clues
     */
    ESTADO: string;
    /**
     * Id de referencia en base de datos
     */
    ID: string;
    /**
     * Id de referencia de la clues en base de datos
     */
    ID_CLUES: string;
    /**
     * Id de referencia del estado en base de datos
     */
    ID_ESTADO: string;
    /**
     * Id de la institucion de referencia en base de datos
     */
    ID_INSTITUCION: string;
    /**
     * Id de referencia de la jurisdiccion en base de datos
     */
    ID_JURISDICCION: string;
    /**
     * Id de referencia del municipio
     */
    ID_MUNICIPIO: string;
    /**
     * Id de referencia del tipo de unidad
     */
    ID_TIPO_UNIDAD: string;
    /**
     * Nombre de la institucion
     */
    INSTITUCION: string;
    /**
     * Nombre de la jurisdiccion
     */
    JURISDICCION: string;
    /**
     * Latitud de la ubicacion de clues
     */
    LATITUD: number;
    /**
     * Nombre de la localidad de la clues
     */
    LOCALIDAD: string;
    /**
     * Longitud de la ubicacion de la clues
     */
    LONGITUD: number;
    /**
     * Nombre del municipio
     */
    MUNICIPIO: string;
    /**
     * Nombre de la tipologia de la clues
     */
    NOMBRE_DE_TIPOLOGIA: string;
    /**
     * Responsable de la clues
     */
    RESPONSABLE: string;
    /**
     * Siglas de la institucion
     */
    SIGLAS: string;
    /**
     * Telefono registrado de la clues
     */
    TELEFONO: string;
    /**
     * Nombre del tipo de institución de la clues eg. CRUZ ROJA MEXICANA
     */
    TIPOINSTITUCION: string;
    /**
     * Nombre del tipo de unidad de la clues eg. HOSPITALIZACION
     */
    TIPOUNIDAD: string;

}
