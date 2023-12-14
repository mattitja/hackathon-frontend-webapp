import { createWS, createWSState } from '@solid-primitives/websocket';
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import {
  GameCreateActionDto,
  JoinActionDto,
  JoinEventDto,
  JoinEventDtoFromJSON,
  PlayerDto,
  StartGameActionDto,
  GameCreatedEventDto,
  GameCreatedEventDtoFromJSON,
  GameStartEventDtoFromJSON,
  WeaponDto,
  InventoryUpdateActionDto,
  CoordinateDto,
  MovementActionDtoFromJSON,
  MovementEventDtoFromJSON,
  NextTurnEventDtoFromJSON,
} from '../../generated/whackend';

var playerId = 'x';

const App: Component = () => {
  const ws = createWS('ws://localhost:80/actions');
  const state = createWSState(ws);
  const states = ['Connecting', 'Connected', 'Disconnecting', 'Disconnected'];
  const [messages, setMessages] = createSignal<any[]>([]);

  
  const [players, setPlayers] = createSignal<PlayerDto[]>([]);
  const [playerPositions, setPlayerPositions] = createSignal<
    Map<String, CoordinateDto>
  >(new Map());

  const [name, setName] = createSignal('');
  const [gameId, setGameId] = createSignal('');

  const [isJoinSectionVisible, setJoinSectionVisible] = createSignal(true);
  const [isLobbySectionVisible, setLobbySectionVisible] = createSignal(false);
  const [isCreateInventoryVisible, setCreateInventoryVisible] =
    createSignal(false);
  const [isBoardVisible, setBoardVisible] = createSignal(false);
  const [playersTurn, setPlayersTurn] = createSignal('');

  const boardWidth = 5;
  const boardHeight = 5;

  const [boardProperties, setBoardProperties] = createSignal({
    rows: boardHeight,
    cols: boardWidth,
  });

  // WebSocket-Nachrichtenverarbeitung
  createEffect(() => {
    const onMessage = (event: MessageEvent<any>) => {
      // Neue Nachricht zum Array hinzufügen
      setMessages(prevMessages => [...prevMessages, event.data]);
      console.log(event.data);
      if (
        JSON.parse(event.data).playerId != null &&
        JSON.parse(event.data).gameId == null
      ) {
        playerId = (JSON.parse(event.data).playerId);
        console.log('Player id is ' + JSON.parse(event.data).playerId);
      }
      if (JSON.parse(event.data).eventType == 'JoinEvent') {
        setJoinSectionVisible(false);
        setLobbySectionVisible(true);
        const joinEvent = JoinEventDtoFromJSON(JSON.parse(event.data));
        setPlayers(joinEvent.playerNicknames);
        setGameId(joinEvent.gameId);
      }
      if (JSON.parse(event.data).eventType == 'GameCreatedEvent') {
        setJoinSectionVisible(false);
        setLobbySectionVisible(false);
        setCreateInventoryVisible(true);
        const gameCreatedEvent = GameCreatedEventDtoFromJSON(
          JSON.parse(event.data),
        );
        setPlayers(gameCreatedEvent.players);
        setBoardProperties({
          rows: gameCreatedEvent.boardProperties?.width!,
          cols: gameCreatedEvent.boardProperties?.height!,
        });
      }
      if (JSON.parse(event.data).eventType == 'GameStartEvent') {
        setJoinSectionVisible(false);
        setLobbySectionVisible(false);
        setCreateInventoryVisible(false);
        setBoardVisible(true);
        const gameStartedEvent = GameStartEventDtoFromJSON(
          JSON.parse(event.data),
        );
      }
      if (JSON.parse(event.data).eventType == 'MovementEvent') {
        const movementEvent = MovementEventDtoFromJSON(JSON.parse(event.data));
        setPlayerPositions(prevMap => {
          const newMap = new Map(prevMap);
          newMap.set(movementEvent.playerId, movementEvent.to);
          return newMap;
        });
      }
      if (JSON.parse(event.data).eventType == 'NextTurnEvent') {
        const movementEvent = NextTurnEventDtoFromJSON(JSON.parse(event.data));
        setPlayersTurn(movementEvent.nextPlayerId);
      }

      // Zustandsaktualisierung erzwingen
      state(Date.now());
    };
    ws.addEventListener('message', onMessage);

    // Cleanup-Funktion
    onCleanup(() => {
      ws.removeEventListener('message', onMessage);
    });
  });

  const handleJoinClick = () => {
    const joinActionInstance: JoinActionDto = {
      actionType: 'JoinAction',
      nickname: name(),
      playerId: playerId,
      gameId: gameId().length == 4 ? gameId() : null,
    };
    ws.send(JSON.stringify(joinActionInstance));
  };

  const handleCreateClick = () => {
    const action: GameCreateActionDto = {
      actionType: 'GameCreateAction',
      playerId: playerId,
      gameId: gameId(),
    };
    ws.send(JSON.stringify(action));
  };

  const handleInventoryDoneClick = () => {
    const action: InventoryUpdateActionDto = {
      actionType: 'InventoryUpdateAction',
      playerId: playerId,
      gameId: gameId(),
      weapons: [
        WeaponDto.Schere,
        WeaponDto.Stein,
        WeaponDto.Papier,
        WeaponDto.Stein,
        WeaponDto.Papier,
      ],
    };
    ws.send(JSON.stringify(action));
  };

  const totalTiles = new Array(boardHeight * boardWidth).fill(0);

  // irgendwie ist die normale random funktion nicht random genug
  function rand(a, b) {
    return (
      (a +
        ((b - a + 1) * crypto.getRandomValues(new Uint32Array(1))[0]) /
          2 ** 32) |
      0
    );
  }

  function isMyTurn() {

    const myTurn = playerId === playersTurn();
    if (myTurn) {
      console.log("its my turn! playerId: " + playerId + " playersTurn: " + playersTurn())
    }
    
    return myTurn;
  }

  return (
    <div>
      <section id="joinSection" hidden={!isJoinSectionVisible()}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name()}
              onInput={e => setName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Game ID:
            <input
              type="text"
              value={gameId()}
              onInput={e => setGameId(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleJoinClick}>Join</button>
        </div>
      </section>
      <section id="lobby" hidden={!isLobbySectionVisible()}>
        <div>
          <label>Game ID: {gameId()}</label>
          <br />
          <label>
            Players
            <ul>
              {players().map((p, index) => (
                <li>{p.nickname}</li>
              ))}
            </ul>
          </label>
          <button onClick={handleCreateClick}>Create Game</button>
        </div>
      </section>
      <section id="create-inventory" hidden={!isCreateInventoryVisible()}>
        <div>
          Inventory
          <button onClick={handleInventoryDoneClick}>I am ready</button>
        </div>
      </section>
      <section id="play" hidden={!isBoardVisible()}>
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
              const row = Math.floor(index / boardWidth) + 1;
              const col = (index % boardWidth) + 1;
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
      <section id="connection">
        <div>
          <p>Websocket-Connection: <span style="color: #AAFF00"> {states[state()]}</span></p>
        </div>
        <div class="console">
          {messages().map((event, index) => {
            const eventType = JSON.parse(event).eventType != undefined ? JSON.parse(event).eventType : "ConnectionEvent";
            return <ConsoleLog key={index} title={index + ": " + eventType} data={event} />
          }).reverse()}
        </div>
      </section>
    </div>
  );
};

const ConsoleLog = (props) => {
  const [collapsed, setCollapsed] = createSignal(true);

  const toggleCollapse = () => setCollapsed(!collapsed());

  return (
    <div class="log-entry">
      <div class="log-header" onClick={toggleCollapse}>
        {props.title}
      </div>
      {!collapsed() && <div class="log-details">{props.data}</div>}
    </div>
  );
};

export { App };
