import { useGame } from "../contexts/game";
import { GameCreateActionDto } from "../generated/whackend";

export const LobbyRoute = () => {

  const { gameId, playerId, ws, players } = useGame();

  const handleCreateClick = () => {
    const action: GameCreateActionDto = {
      actionType: "GameCreateAction",
      playerId: playerId,
      gameId: gameId(),
    };
    ws.send(JSON.stringify(action));
  };

  return (
    <section id="lobby">
      <div>
        <label>Game ID: {gameId()}</label>
        <br />
        <label>
          Players
          <ul>
            {players().map(({ nickname }) => (
              <li>{nickname}</li>
            ))}
          </ul>
        </label>
        <button onClick={handleCreateClick}>Create Game</button>
      </div>
    </section>
  );
};
