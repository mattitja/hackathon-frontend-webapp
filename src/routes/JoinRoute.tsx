import { useGame } from "../contexts/game";
import { JoinActionDto } from "../generated/whackend/models/JoinActionDto";

export const JoinRoute = () => {
  const { name, gameId, ws, setName, playerId, setGameId } = useGame();

  const handleJoinClick = () => {
    const joinAction: JoinActionDto = {
      actionType: "JoinAction",
      nickname: name(),
      playerId: playerId(),
      gameId: gameId().length == 4 ? gameId() : null,
    };
    console.log(joinAction)
    ws.send(JSON.stringify(joinAction));
  };

  return (
    <section id="joinSection">
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name()}
            onInput={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Game ID:
          <input
            type="text"
            value={gameId()}
            onInput={(e) => setGameId(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleJoinClick}>Join</button>
      </div>
    </section>
  );
};
