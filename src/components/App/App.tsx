import { Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { JoinRoute } from "../../routes/JoinRoute";
import { LobbyRoute } from "../../routes/LobbyRoute";
import { PrepareRoute } from "../../routes/PrepareRoute";
import { PlayRoute } from "../../routes/PlayRoute";
import { HomeRoute } from "../../routes/HomeRoute";
import { GameRoute } from "../../routes/GameRoute";

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={HomeRoute}>
        <Route path="/join" component={JoinRoute} />
        <Route path="/:gameId" component={GameRoute}>
          <Route path="/lobby" component={LobbyRoute} />
          <Route path="/prepare" component={PrepareRoute} />
          <Route path="/play" component={PlayRoute} />
        </Route>
      </Route>
    </Router>
  );
};

export { App };
