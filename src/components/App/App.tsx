import { createWS, createWSState } from "@solid-primitives/websocket";
import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import {
  GameCreateActionDto,
  JoinActionDto,
  JoinEventDto,
  JoinEventDtoFromJSON,
  PlayerDto,
  StartGameActionDto,
  GameCreatedEventDto,
  GameCreatedEventDtoFromJSON,
  GameStartEventDtoFromJSON,
  WeaponDto,
  InventoryUpdateActionDto,
  CoordinateDto,
  MovementActionDtoFromJSON,
  MovementEventDtoFromJSON,
  NextTurnEventDtoFromJSON,
} from "../../generated/whackend";
import { Router, Route } from "@solidjs/router";
import { JoinRoute } from "../../routes/JoinRoute";
import { LobbyRoute } from "../../routes/LobbyRoute";
import { PrepareRoute } from "../../routes/PrepareRoute";
import { PlayRoute } from "../../routes/PlayRoute";
import { HomeRoute } from "../../routes/HomeRoute";

const App: Component = () => {
  // irgendwie ist die normale random funktion nicht random genug

  return (
    <Router>
      <Route path="/" component={HomeRoute}>
        <Route path="/join" component={JoinRoute} />
        <Route path="/lobby" component={LobbyRoute} />
        <Route path="/prepare" component={PrepareRoute} />
        <Route path="/play" component={PlayRoute} />
      </Route>
    </Router>
  );
};

export { App };
