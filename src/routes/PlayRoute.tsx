import { useGame } from "../contexts/game";

export const PlayRoute = () => {

  const { name, players, playerId, ws, playersTurn, setName, setGameId, boardProperties, playerPositions } = useGame();
  
  const totalTiles = new Array(boardProperties().rows * boardProperties().cols).fill(0);
    
  function isMyTurn() {
    const myTurn = playerId === playersTurn();
    if (myTurn) {
      console.log(
        "its my turn! playerId: " + playerId + " playersTurn: " + playersTurn()
      );
    }

    return myTurn;
  }

  return (
    <section id="play">
        <div
          class="game-board"
          style={{
            '--board-rows': boardProperties().rows,
            '--board-cols': boardProperties().cols,
          }}
        >
          <div id="map">
            {totalTiles.map(() => {
              const tileClassNumber = 'tile tile' + Math.floor(Math.random()*7+1);
              return <div class={tileClassNumber}></div>;
            })}
          </div>
          <div id="players">
            {players().map(p => {
              return (
                <div
                  class="player body"
                  style={{
                    '--player-row': playerPositions().get(p.playerId)?.posY,
                    '--player-col': playerPositions().get(p.playerId)?.posX,
                  }}
                >
                  <div class="player-label">{p.nickname}</div>
                </div>
              );
            })}
          </div>
          <div id="overlays" hidden={!isMyTurn()}>
            <div
              id="overlay-left"
              class="overlay"
              style={{
                'grid-column-start':
                  playerPositions().get(playerId)?.posX! - 1,
                'grid-row-start': playerPositions().get(playerId)?.posY!,
              }}
            ></div>
            <div
              id="overlay-right"
              class="overlay"
              style={{
                'grid-column-start':
                  playerPositions().get(playerId)?.posX! + 1,
                'grid-row-start': playerPositions().get(playerId)?.posY!,
              }}
            ></div>
            <div
              id="overlay-top"
              class="overlay"
              style={{
                'grid-column-start': playerPositions().get(playerId)?.posX!,
                'grid-row-start': playerPositions().get(playerId)?.posY! - 1,
              }}
            ></div>
            <div
              id="overlay-bottom"
              class="overlay"
              style={{
                'grid-column-start': playerPositions().get(playerId)?.posX!,
                'grid-row-start': playerPositions().get(playerId)?.posY! + 1,
              }}
            ></div>
          </div>
          <div id="actions">
            {totalTiles.map((_, index) => {
              const row = Math.floor(index / boardProperties().rows) + 1;
              const col = (index % boardProperties().rows) + 1;
              return (
                <div
                  class="action"
                  onclick={() => {
                    //movePlayer(row, col);
                  }}
                  data-action-id={`${row}-${col}`}
                ></div>
              );
            })}
          </div>
        </div>
      </section>
  );
};
