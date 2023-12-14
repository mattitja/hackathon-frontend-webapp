import { Component, JSXElement } from "solid-js";
import { Console } from "../components/Console";
import { GameProvider } from "../contexts/game";

export const HomeRoute: Component<{children?: JSXElement}> = (props) => {
  return (
    <GameProvider>
      {props.children}
      <Console />
    </GameProvider>
  );
};
