import { Show, createSignal } from "solid-js";
import { useGame } from "../contexts/game";
import { JoinActionDto } from "../generated/whackend/models/JoinActionDto";
import styles from "./JoinRoute.module.css";

export const JoinRoute = () => {
  const game = useGame();
  const { ws, playerId } = game ?? {};

  const [gameId, setGameId] = createSignal<any>(null);

  const handleJoinClick = (e: SubmitEvent) => {
    if (!playerId?.()) {
      throw Error(`Expected \`playerId\` to be defined but found it to be \`${playerId?.()}\``);
    }
    if (!ws) {
      throw Error(`Expected a valid websocket instance (\`ws\`) found it to be \`${ws}\``);
    }
    e.preventDefault();
    var formEl = e.target as HTMLFormElement;
    const form = new FormData(formEl);
    const nickname = form.get("nickname") as string;

    const joinAction: JoinActionDto = {
      actionType: "JoinAction",
      nickname,
      playerId: playerId(),
      gameId: gameId(),
    };
    ws.send(JSON.stringify(joinAction));
  };

  const handleGameIdInput = (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    setGameId(inputElement.value);
  };

  return (
    <section class={styles.container}>
      <form class={styles.form} onSubmit={handleJoinClick}>
        <label class={styles.formField}>
          <div>Name</div>
          <input type="text" name="nickname" autofocus required />
        </label>
        <label class={styles.formField}>
          <div>Game ID</div>
          <small>Has a length of 4 characters</small>
          <input
            type="text"
            name="gameId"
            pattern=".{4}"
            onInput={handleGameIdInput}
          />
        </label>
        <Show
          when={gameId() != null && gameId().length > 0}
          fallback={<button type="submit">Create new Lobby</button>}
        >
          <button type="submit">Join Lobby</button>
        </Show>
      </form>
    </section>
  );
};
