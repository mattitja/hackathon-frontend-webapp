import { useGame } from "../contexts/game";
import { JoinActionDto } from "../generated/whackend/models/JoinActionDto";
import styles from "./JoinRoute.module.css";

export const JoinRoute = () => {
  const { ws, playerId } = useGame();

  const handleJoinClick = (e: SubmitEvent) => {
    e.preventDefault();
    var formEl = e.target as HTMLFormElement;
    const form = new FormData(formEl);
    const nickname = form.get('nickname') as string;
    const gameId = form.get('gameId') as string || null;
    console.log({ nickname, gameId });
    
    const joinAction: JoinActionDto = {
      actionType: "JoinAction",
      nickname,
      playerId,
      gameId,
    };
    ws.send(JSON.stringify(joinAction));
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
          <input type="text" name="gameId" pattern="\w{4}" />
        </label>
        <button type="submit">Join</button>
      </form>
    </section>
  );
};
