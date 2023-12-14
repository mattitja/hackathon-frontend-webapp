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
import type { GameCreatedEventDtoAllOfBoardProperties } from './GameCreatedEventDtoAllOfBoardProperties';
import {
    GameCreatedEventDtoAllOfBoardPropertiesFromJSON,
    GameCreatedEventDtoAllOfBoardPropertiesFromJSONTyped,
    GameCreatedEventDtoAllOfBoardPropertiesToJSON,
} from './GameCreatedEventDtoAllOfBoardProperties';
import type { PlayerDto } from './PlayerDto';
import {
    PlayerDtoFromJSON,
    PlayerDtoFromJSONTyped,
    PlayerDtoToJSON,
} from './PlayerDto';

/**
 * 
 * @export
 * @interface GameCreatedEventDto
 */
export interface GameCreatedEventDto extends EventDto {
    /**
     * 
     * @type {Array<PlayerDto>}
     * @memberof GameCreatedEventDto
     */
    players: Array<PlayerDto>;
    /**
     * 
     * @type {GameCreatedEventDtoAllOfBoardProperties}
     * @memberof GameCreatedEventDto
     */
    boardProperties?: GameCreatedEventDtoAllOfBoardProperties;
}

/**
 * Check if a given object implements the GameCreatedEventDto interface.
 */
export function instanceOfGameCreatedEventDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "players" in value;

    return isInstance;
}

export function GameCreatedEventDtoFromJSON(json: any): GameCreatedEventDto {
    return GameCreatedEventDtoFromJSONTyped(json, false);
}

export function GameCreatedEventDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameCreatedEventDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        ...EventDtoFromJSONTyped(json, ignoreDiscriminator),
        'players': ((json['players'] as Array<any>).map(PlayerDtoFromJSON)),
        'boardProperties': !exists(json, 'boardProperties') ? undefined : GameCreatedEventDtoAllOfBoardPropertiesFromJSON(json['boardProperties']),
    };
}

export function GameCreatedEventDtoToJSON(value?: GameCreatedEventDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        ...EventDtoToJSON(value),
        'players': ((value.players as Array<any>).map(PlayerDtoToJSON)),
        'boardProperties': GameCreatedEventDtoAllOfBoardPropertiesToJSON(value.boardProperties),
    };
}

