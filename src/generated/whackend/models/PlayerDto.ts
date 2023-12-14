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
 * @interface PlayerDto
 */
export interface PlayerDto {
    /**
     * 
     * @type {string}
     * @memberof PlayerDto
     */
    playerId: string;
    /**
     * 
     * @type {string}
     * @memberof PlayerDto
     */
    nickname: string;
}

/**
 * Check if a given object implements the PlayerDto interface.
 */
export function instanceOfPlayerDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "playerId" in value;
    isInstance = isInstance && "nickname" in value;

    return isInstance;
}

export function PlayerDtoFromJSON(json: any): PlayerDto {
    return PlayerDtoFromJSONTyped(json, false);
}

export function PlayerDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlayerDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'playerId': json['playerId'],
        'nickname': json['nickname'],
    };
}

export function PlayerDtoToJSON(value?: PlayerDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'playerId': value.playerId,
        'nickname': value.nickname,
    };
}
