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
import type { EventDto } from './EventDto';
import {
    EventDtoFromJSON,
    EventDtoFromJSONTyped,
    EventDtoToJSON,
} from './EventDto';
import type { PlayerDto } from './PlayerDto';
import {
    PlayerDtoFromJSON,
    PlayerDtoFromJSONTyped,
    PlayerDtoToJSON,
} from './PlayerDto';

/**
 * 
 * @export
 * @interface JoinEventDto
 */
export interface JoinEventDto extends EventDto {
    /**
     * 
     * @type {Array<PlayerDto>}
     * @memberof JoinEventDto
     */
    playerNicknames: Array<PlayerDto>;
}

/**
 * Check if a given object implements the JoinEventDto interface.
 */
export function instanceOfJoinEventDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "playerNicknames" in value;

    return isInstance;
}

export function JoinEventDtoFromJSON(json: any): JoinEventDto {
    return JoinEventDtoFromJSONTyped(json, false);
}

export function JoinEventDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): JoinEventDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        ...EventDtoFromJSONTyped(json, ignoreDiscriminator),
        'playerNicknames': ((json['playerNicknames'] as Array<any>).map(PlayerDtoFromJSON)),
    };
}

export function JoinEventDtoToJSON(value?: JoinEventDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        ...EventDtoToJSON(value),
        'playerNicknames': ((value.playerNicknames as Array<any>).map(PlayerDtoToJSON)),
    };
}
