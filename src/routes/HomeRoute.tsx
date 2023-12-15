import { Component, JSXElement } from "solid-js";
import { Console } from "../components/Console";
import { GameProvider } from "../contexts/game";
import styles from "./HomeRoute.module.css";

export const HomeRoute: Component<{children?: JSXElement}> = (props) => {
  return (
    <GameProvider>
      <main class={styles.main}>
        <div class={styles.outlet}>
          {props.children}
        </div>
        <div class={styles.sidebar}>
          <Console />
        </div>
      </main>
    </GameProvider>
  );
};
