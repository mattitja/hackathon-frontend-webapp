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
 * @interface GameCreatedEventDtoAllOfBoardProperties
 */
export interface GameCreatedEventDtoAllOfBoardProperties {
    /**
     * 
     * @type {number}
     * @memberof GameCreatedEventDtoAllOfBoardProperties
     */
    width: number;
    /**
     * 
     * @type {number}
     * @memberof GameCreatedEventDtoAllOfBoardProperties
     */
    height: number;
}

/**
 * Check if a given object implements the GameCreatedEventDtoAllOfBoardProperties interface.
 */
export function instanceOfGameCreatedEventDtoAllOfBoardProperties(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "width" in value;
    isInstance = isInstance && "height" in value;

    return isInstance;
}

export function GameCreatedEventDtoAllOfBoardPropertiesFromJSON(json: any): GameCreatedEventDtoAllOfBoardProperties {
    return GameCreatedEventDtoAllOfBoardPropertiesFromJSONTyped(json, false);
}

export function GameCreatedEventDtoAllOfBoardPropertiesFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameCreatedEventDtoAllOfBoardProperties {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'width': json['width'],
        'height': json['height'],
    };
}

export function GameCreatedEventDtoAllOfBoardPropertiesToJSON(value?: GameCreatedEventDtoAllOfBoardProperties | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'width': value.width,
        'height': value.height,
    };
}

