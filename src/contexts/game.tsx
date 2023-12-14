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
} from "../generated/whackend";
import { useNavigate } from "@solidjs/router";

const GameContext = createContext();

export const GameProvider = (props) => {
  const navigate = useNavigate();
  const ws = createWS("ws://hackathon-balancer-1963138121.eu-central-1.elb.amazonaws.com/actions");
  const state = createWSState(ws);
  const states = ["Connecting", "Connected", "Disconnecting", "Disconnected"];
  const [messages, setMessages] = createSignal<any[]>([]);

  const [players, setPlayers] = createSignal<PlayerDto[]>([]);
  const [playerPositions, setPlayerPositions] = createSignal<
    Map<String, CoordinateDto>
  >(new Map());

  const [name, setName] = createSignal("asdf");
  const [playerId, setPlayerId] = createSignal("x");
  const [gameId, setGameId] = createSignal("");

  const [isJoinSectionVisible, setJoinSectionVisible] = createSignal(true);
  const [isLobbySectionVisible, setLobbySectionVisible] = createSignal(false);
  const [isCreateInventoryVisible, setCreateInventoryVisible] =
    createSignal(false);
  const [isBoardVisible, setBoardVisible] = createSignal(false);
  const [playersTurn, setPlayersTurn] = createSignal("");

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
      setMessages((prevMessages) => [...prevMessages, event.data]);
      console.log(event.data);
      if (
        JSON.parse(event.data).playerId != null &&
        JSON.parse(event.data).gameId == null
      ) {
        setPlayerId(JSON.parse(event.data).playerId);
        console.log("Player id is " + JSON.parse(event.data).playerId);
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
        navigate("/play");
      }
      if (JSON.parse(event.data).eventType == "MovementEvent") {
        const movementEvent = MovementEventDtoFromJSON(JSON.parse(event.data));
        setPlayerPositions((prevMap) => {
          const newMap = new Map(prevMap);
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

  const gameStore = {
    ws,
    state,
    states,
    messages,
    players,
    playerPositions,
    name,
    gameId,
    isJoinSectionVisible,
    isLobbySectionVisible,
    isCreateInventoryVisible,
    isBoardVisible,
    playersTurn,
    boardProperties,
    setMessages,
    setPlayers,
    setPlayerPositions,
    setJoinSectionVisible,
    setLobbySectionVisible,
    setName,
    playerId,
    setPlayerId,
    setCreateInventoryVisible,
    setBoardVisible,
    setPlayersTurn,
    setBoardProperties,
  };

  return (
    <GameContext.Provider value={gameStore}>
      {props.children}
    </GameContext.Provider>
  );
};

export function useGame() {
  return useContext(GameContext);
}
