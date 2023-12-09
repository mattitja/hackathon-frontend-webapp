import {
  createWS,
  createWSState,
  makeHeartbeatWS,
  makeReconnectingWS,
} from '@solid-primitives/websocket';
import { Component, createEffect, onCleanup, createMemo, createSignal } from 'solid-js';

const App: Component = () => {
  const ws = createWS('ws://localhost:80/actions');
  const state = createWSState(ws);
  const states = ['Connecting', 'Connected', 'Disconnecting', 'Disconnected'];
  const [messages, setMessages] = createSignal<any[]>([]);

  // WebSocket-Nachrichtenverarbeitung
  createEffect(() => {
    const onMessage = (event: MessageEvent<any>) => {
      // Neue Nachricht zum Array hinzufügen
      setMessages((prevMessages) => [...prevMessages, event.data]);
      console.log(event.data)

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

  return (
    <div>
      <p>Connection: {states[state()]}</p>
      <ul>
        {messages().map((msg, index) => (
          // Direkte Erstellung von Solid.js-Elementen ohne Schlüssel
          <li>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export { App };
