/* tslint:disable */
/* eslint-disable */
/**
 * Agile Wars
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface CoordinateDto
 */
export interface CoordinateDto {
    /**
     * 
     * @type {number}
     * @memberof CoordinateDto
     */
    posX: number;
    /**
     * 
     * @type {number}
     * @memberof CoordinateDto
     */
    posY: number;
}

/**
 * Check if a given object implements the CoordinateDto interface.
 */
export function instanceOfCoordinateDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "posX" in value;
    isInstance = isInstance && "posY" in value;

    return isInstance;
}

export function CoordinateDtoFromJSON(json: any): CoordinateDto {
    return CoordinateDtoFromJSONTyped(json, false);
}

export function CoordinateDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CoordinateDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'posX': json['posX'],
        'posY': json['posY'],
    };
}

export function CoordinateDtoToJSON(value?: CoordinateDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'posX': value.posX,
        'posY': value.posY,
    };
}

