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
  const boardWidth = 8;
  const boardHeight = 8;
  const totalTiles = new Array(boardHeight * boardWidth).fill(0);

  const player = document.querySelector('#root') as HTMLElement;
  player.style.setProperty('--player-row', rand(1,8).toString());
  player.style.setProperty('--player-col', rand(1,8).toString());

  // irgendwie ist die normale random funktion nicht random genug
  function rand(a, b) {
    return (
      (a +
        ((b - a + 1) * crypto.getRandomValues(new Uint32Array(1))[0]) /
          2 ** 32) |
      0
    );
  }

  function movePlayer(newCol: number, newRow: number): void {
    const player = document.querySelector('#root') as HTMLElement;
    player.style.setProperty('--player-col', newCol.toString());
    player.style.setProperty('--player-row', newRow.toString());
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
          <button id="moveButton" onClick={ e => {
            player.style.setProperty('--player-row', rand(1,8).toString());
            player.style.setProperty('--player-col', rand(1,8).toString());
          }
            
          }>Move Player</button>
        </div>
      </section>
      <section id="play">
        <div class="game-board">
          <div id="map">
            {totalTiles.map(() => {
              const tileClassNumber = 'tile tile' + Math.floor(rand(1, 8));
              return <div class={tileClassNumber}></div>;
            })}
          </div>
          <div id="players">
            <div class="player body"></div>
          </div>
        </div>
      </section>
    </div>
  );
};



export { App };
