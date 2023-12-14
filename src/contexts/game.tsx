import { createWS, createWSState } from "@solid-primitives/websocket";
import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import {
  PlayerDto,
  CoordinateDto,
  JoinEventDtoFromJSON,
  GameCreatedEventDtoFromJSON,
  GameStartEventDtoFromJSON,
  MovementEventDtoFromJSON,
  NextTurnEventDtoFromJSON,
  EventDto,
} from "../generated/whackend";
import { useNavigate } from "@solidjs/router";

const GameContext = createContext();

export const GameProvider = (props) => {
  const navigate = useNavigate();
  const ws = createWS("ws://localhost:80/actions");
  const state = createWSState(ws);
  const [messages, setMessages] = createSignal<any[]>([]);

  const [players, setPlayers] = createSignal<PlayerDto[]>([]);
  const [playerPositions, setPlayerPositions] = createSignal<Map<string, CoordinateDto>>(new Map());

  const [name, setName] = createSignal("asdf");
  const [playerId, setPlayerId] = createSignal("x");
  const [gameId, setGameId] = createSignal("");

  const [playersTurn, setPlayersTurn] = createSignal("");

  const boardWidth = 5;
  const boardHeight = 5;

  const [boardProperties, setBoardProperties] = createSignal({
    rows: boardHeight,
    cols: boardWidth,
  });

  createEffect(() => {
    console.log(playerId())
    console.log(playerPositions())
  })

  // WebSocket-Nachrichtenverarbeitung
  createEffect(() => {
    const onMessage = (event: MessageEvent<any>) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
      if (
        JSON.parse(event.data).playerId != null &&
        JSON.parse(event.data).gameId == null
      ) {
        setPlayerId(JSON.parse(event.data).playerId);
      }
      if (JSON.parse(event.data).eventType == "JoinEvent") {
        const joinEvent = JoinEventDtoFromJSON(JSON.parse(event.data));
        setPlayers(joinEvent.playerNicknames);
        setGameId(joinEvent.gameId);
        navigate("/lobby");
      }
      if (JSON.parse(event.data).eventType == "GameCreatedEvent") {
        const gameCreatedEvent = GameCreatedEventDtoFromJSON(
          JSON.parse(event.data)
        );
        setPlayers(gameCreatedEvent.players);
        setBoardProperties({
          rows: gameCreatedEvent.boardProperties?.width!,
          cols: gameCreatedEvent.boardProperties?.height!,
        });
        navigate("/prepare");
      }
      if (JSON.parse(event.data).eventType == "GameStartEvent") {
        const gameStartedEvent = GameStartEventDtoFromJSON(
          JSON.parse(event.data)
        );
        setInterval(() => navigate("/play"), 500); // hack
        ;
      }
      if (JSON.parse(event.data).eventType == "MovementEvent") {
        const movementEvent = MovementEventDtoFromJSON(JSON.parse(event.data));
        console.log("update")
        setPlayerPositions((prevMap) => {
            console.log("update1")
          const newMap = new Map(prevMap);
          console.log("update2")
          newMap.set(movementEvent.playerId, movementEvent.to);
          return newMap;
        });
      }
      if (JSON.parse(event.data).eventType == "NextTurnEvent") {
        const movementEvent = NextTurnEventDtoFromJSON(JSON.parse(event.data));
        setPlayersTurn(movementEvent.nextPlayerId);
      }

      // Zustandsaktualisierung erzwingen
      state(Date.now());
    };
    ws.addEventListener("message", onMessage);

    // Cleanup-Funktion
    onCleanup(() => {
      ws.removeEventListener("message", onMessage);
    });
  });

  const gameStore:GameStore = {
    ws,
    state,
    messages,
    players,
    playerPositions,
    name,
    gameId,
    playersTurn,
    boardProperties,
    setMessages,
    setPlayers,
    setPlayerPositions,
    setName,
    playerId,
    setGameId,
    setPlayerId,
    setPlayersTurn,
    setBoardProperties,
  };

  return (
    <GameContext.Provider value={gameStore}>
      {props.children}
    </GameContext.Provider>
  );
};

type GameStore = {
    ws: WebSocket;
    state: (value?: any) => any;
    messages: () => EventDto[];
    players: () => PlayerDto[];
    playerPositions: () => Map<string, CoordinateDto>;
    name: () => string;
    playerId: () => string;
    gameId: () => string;
    playersTurn: () => string;
    boardProperties: () => {
      rows: number;
      cols: number;
    };
    setMessages: (value: EventDto[]) => EventDto[];
    setPlayers: (value: PlayerDto[]) => PlayerDto[];
    setPlayerPositions: (value: Map<string, CoordinateDto>) => Map<string, CoordinateDto>;
    setName: (value: string) => string;
    setPlayerId: (value: string) => string;
    setGameId: (value: string) => string;
    setPlayersTurn: (value: string) => string;
    setBoardProperties: (value: { rows: number; cols: number }) => any;
  }

export function useGame(): GameStore | undefined {
  return useContext(GameContext);
}
