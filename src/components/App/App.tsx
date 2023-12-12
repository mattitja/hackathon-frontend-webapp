import { createWS, createWSState } from '@solid-primitives/websocket';
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';

const App: Component = () => {
  const ws = createWS('ws://localhost:80/actions');
  const state = createWSState(ws);
  const states = ['Connecting', 'Connected', 'Disconnecting', 'Disconnected'];
  const [messages, setMessages] = createSignal<any[]>([]);

  // WebSocket-Nachrichtenverarbeitung
  createEffect(() => {
    const onMessage = (event: MessageEvent<any>) => {
      // Neue Nachricht zum Array hinzufügen
      setMessages(prevMessages => [...prevMessages, event.data]);
      console.log(event.data);

      // Zustandsaktualisierung erzwingen
      state(Date.now());
    };

    // WebSocket-Event-Listener hinzufügen
    ws.addEventListener('message', onMessage);

    // Cleanup-Funktion
    onCleanup(() => {
      ws.removeEventListener('message', onMessage);
    });
  });
  const boardWidth = 5;
  const boardHeight = 5;
  const totalTiles = new Array(boardHeight * boardWidth).fill(0);

  const [playerPosition, setPlayerPosition] = createSignal({
    row: rand(1, boardWidth),
    col: rand(1, boardHeight),
  });

  const [boardProperties, setBoardProperties] = createSignal({
    rows: boardHeight,
    cols: boardWidth,
  });

  const movePlayer = (row, col) => {
    const x = Math.abs(playerPosition().col - col);
    const y = Math.abs(playerPosition().row - row);
    if ((x == 0 && y == 1) || (x == 1 && y == 0)) {
      setPlayerPosition({ row, col });
    }
  };

  // irgendwie ist die normale random funktion nicht random genug
  function rand(a, b) {
    return (
      (a +
        ((b - a + 1) * crypto.getRandomValues(new Uint32Array(1))[0]) /
          2 ** 32) |
      0
    );
  }

  return (
    <div>
      <section id="connection">
        <div>
          <p>Websocket-Connection: {states[state()]}</p>
          <ul>
            {messages().map((msg, index) => (
              <li>{msg}</li>
            ))}
          </ul>
        </div>
      </section>
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
              const tileClassNumber = 'tile tile' + Math.floor(rand(1, 8));
              return <div class={tileClassNumber}></div>;
            })}
          </div>
          <div id="players">
            <div
              class="player body"
              style={{
                '--player-row': playerPosition().row,
                '--player-col': playerPosition().col,
              }}
            ></div>
          </div>
          <div id="overlays">
            <div
              id="overlay-left"
              class="overlay"
              style={{
                'grid-column-start': playerPosition().col - 1,
                'grid-row-start': playerPosition().row,
              }}
            ></div>
            <div
              id="overlay-right"
              class="overlay"
              style={{
                'grid-column-start': playerPosition().col + 1,
                'grid-row-start': playerPosition().row,
              }}
            ></div>
            <div
              id="overlay-top"
              class="overlay"
              style={{
                'grid-column-start': playerPosition().col,
                'grid-row-start': playerPosition().row - 1,
              }}
            ></div>
            <div
              id="overlay-bottom"
              class="overlay"
              style={{
                'grid-column-start': playerPosition().col,
                'grid-row-start': playerPosition().row + 1,
              }}
            ></div>
          </div>
          <div id="actions">
            {totalTiles.map((_, index) => {
              const row = Math.floor(index / boardWidth) + 1;
              const col = (index % boardWidth) + 1;
              return (
                <div
                  class="action"
                  onclick={() => {
                    movePlayer(row, col);
                  }}
                  data-action-id={`${row}-${col}`}
                ></div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export { App };
