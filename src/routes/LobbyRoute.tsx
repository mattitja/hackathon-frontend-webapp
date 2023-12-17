import { For, Show } from "solid-js";
import { useGame } from "../contexts/game";
import { GameCreateActionDto } from "../generated/whackend";
import styles from "./LobbyRoute.module.css";
import { useParams } from "@solidjs/router";

export const LobbyRoute = () => {
  const { gameId } = useParams();
  const game = useGame();

  const { playerId, ws, players } = game ?? {};

  const handleCreateClick = () => {
    if (!playerId?.()) {
      throw Error(`Expected \`playerId\` to be defined but found it to be \`${playerId?.()}\``);
    }
    const action: GameCreateActionDto = {
      actionType: "GameCreateAction",
      playerId: playerId?.(),
      gameId,
    };
    game?.ws.send(JSON.stringify(action));
  };

  return (
    <section class={['stack', styles.container].join(' ')}>
      <h1>Players</h1>
      <ul class={['stack', styles.list].join(' ')}>
        <For each={players?.()}>
          {({ nickname }) => (
            <li class={[
                'fade-up-and-in',
                'card',
                styles.card
              ].join(' ')}
            >
              {nickname}
            </li>
          )}
        </For>
      </ul>
      <Show when={(players?.() ||[]).length >= 2}>
        <button onClick={handleCreateClick}>Create Game</button>
      </Show>
    </section>
  );
};
