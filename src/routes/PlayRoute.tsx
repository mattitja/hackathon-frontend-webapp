import { createEffect } from "solid-js";
import { useGame } from "../contexts/game";
import {
  CoordinateDto,
  FinishTurnActionDto,
  MovementActionDto,
} from "../generated/whackend";
import styles from "./PlayRoute.module.css";

export const PlayRoute = () => {
  const {
    playerId,
    gameId,
    players,
    ws,
    playersTurn,
    boardProperties,
    playerPositions,
  } = useGame();

  const totalTiles = new Array(
    boardProperties().rows * boardProperties().cols
  ).fill(0);

  function isMyTurn() {
    return playerId() === playersTurn();
  }

  const handleMovePlayer = (x, y) => {
    const action: MovementActionDto = {
      actionType: "MovementAction",
      playerId: playerId(),
      gameId: gameId(),
      from: playerPositions().get(playerId()),
      to: { posX: x, posY: y },
    };
    ws.send(JSON.stringify(action));
  };

  const handleFinishTurn = () => {
    const action: FinishTurnActionDto = {
      actionType: "FinishTurnAction",
      playerId: playerId(),
      gameId: gameId(),
    };
    ws.send(JSON.stringify(action));
  };

  const overlays = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  return (
    <section class={styles.container}>
      <div
        class={styles.board}
        style={{
          "--board-rows": boardProperties().rows,
          "--board-cols": boardProperties().cols,
        }}
      >
        {totalTiles.map((_, idx) => {
          const num = Math.floor(Math.random() * 7 + 1);

          if (num >= 1 && num <= 6) {
            return (
              <div
                class={styles.tile}
                style={{
                  "--tile-url": `url(src/components/App/tile${num}.png)`,
                }}
              ></div>
            );
          } else {
            return <div />;
          }
        })}
        {/* <div
          class={styles.overlay}
          style={{
            "grid-column-start": 2,
            "grid-row-start": 4,
          }}
        ></div> */}
        {overlays.map((o: { x: number; y: number }) => (
          <div
            hidden={!isMyTurn()}
            class={styles.overlay} // Corrected class to className
            onClick={() =>
              handleMovePlayer(
                playerPositions().get(playerId()).posX + o.x,
                playerPositions().get(playerId()).posY + o.y
              )
            }
            style={{
              "grid-column-start": playerPositions().get(playerId()).posX + o.x,
              "grid-row-start": playerPositions().get(playerId()).posY + o.y,
            }}
          ></div>
        ))}

        {players().map((p) => {
          return (
            <div
              class={styles.player}
              style={{
                "--player-row": playerPositions().get(p.playerId)?.posY,
                "--player-col": playerPositions().get(p.playerId)?.posX,
              }}
            >
              <span class="player-label">{p.nickname}</span>
            </div>
          );
        })}
      </div>
      {isMyTurn() ? <button  type="button" onClick={handleFinishTurn}>Finish Turn</button> : <div></div>}
    </section>
  );
};
