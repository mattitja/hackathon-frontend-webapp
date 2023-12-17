import { Component, JSXElement } from "solid-js";
import styles from "./GameRoute.module.css";
import { useParams } from "@solidjs/router";
import { CopyIcon } from "../assets/CopyIcon";

export const GameRoute: Component<{ children?: JSXElement }> = (props) => {
  const { gameId } = useParams();

  return (
    <section class={['stack', styles.container].join(' ')}>
      <div class={styles.gameId}>
        <strong>Game ID: {gameId}</strong>
        <button
          type="button"
          aria-label="Copy Game ID"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(gameId);
            } catch (error) {
              throw new Error('Could not copy Game ID', { cause: error });
            }
          }}
        >
          <CopyIcon />
        </button>
      </div>
      <div class={styles.outlet}>{props.children}</div>
    </section>
  );
};