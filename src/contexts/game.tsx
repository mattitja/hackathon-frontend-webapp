import { createWS, createWSState } from "@solid-primitives/websocket";
import { useNavigate } from "@solidjs/router";
import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import {
  CoordinateDto,
  FightEventDto,
  FightEventDtoFromJSON,
  GameCreatedEventDtoFromJSON,
  GameStartEventDtoFromJSON,
  InventoryUpdateEventDtoFromJSON,
  JoinEventDtoFromJSON,
  KillEventDtoFromJSON,
  MovementEventDtoFromJSON,
  NextTurnEventDtoFromJSON,
  PlayerDto,
  WeaponDto,
} from "../generated/whackend";

const GameContext = createContext();

export const GameProvider = (props) => {
  const navigate = useNavigate();
  const ws = createWS("ws://localhost:80/actions");
  // const ws = createWS(
  //   "ws://hackathon-balancer-1963138121.eu-central-1.elb.amazonaws.com/actions"
  // );
  const state = createWSState(ws);
  const [messages, setMessages] = createSignal<any[]>([]);

  const [players, setPlayers] = createSignal<PlayerDto[]>([]);
  const [playerPositions, setPlayerPositions] = createSignal<
    Map<string, CoordinateDto>
  >(new Map());

  const [name, setName] = createSignal("asdf");
  const [playerId, setPlayerId] = createSignal("x");
  const [gameId, setGameId] = createSignal("");

  const [playersTurn, setPlayersTurn] = createSignal("");

  const [myInventory, setMyInventory] = createSignal<WeaponDto[]>([]);
  const [fightData, setFightData] = createSignal<FightEventDto>();

  const [actionsLeft, setActionsLeft] = createSignal<number>(0);
  const [myTurn, setMyTurn] = createSignal<boolean>(false);

  const boardWidth = 5;
  const boardHeight = 5;

  const [boardProperties, setBoardProperties] = createSignal({
    rows: boardHeight,
    cols: boardWidth,
  });

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
        navigate("/play");
      }
      if (JSON.parse(event.data).eventType == "MovementEvent") {
        const movementEvent = MovementEventDtoFromJSON(JSON.parse(event.data));
        setPlayerPositions((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(movementEvent.playerId, movementEvent.to);
          return newMap;
        });
        setActionsLeft(actionsLeft() - 1);
      }
      if (JSON.parse(event.data).eventType == "InventoryUpdateEvent") {
        const inventoryEvent = InventoryUpdateEventDtoFromJSON(
          JSON.parse(event.data)
        );
        setMyInventory(inventoryEvent.weapons);
      }
      if (JSON.parse(event.data).eventType == "NextTurnEvent") {
        const movementEvent = NextTurnEventDtoFromJSON(JSON.parse(event.data));
        setPlayersTurn(movementEvent.nextPlayerId);
        if (playersTurn() == playerId()) {
          setMyTurn(true);
          setActionsLeft(2);
        } else {
          setMyTurn(false);
          setActionsLeft(0);
        }
      }
      if (JSON.parse(event.data).eventType == "KillEvent") {
        const killEvent = KillEventDtoFromJSON(JSON.parse(event.data));
        setPlayers(players().filter((v) => v.playerId != killEvent.playerId));
      }
      if (JSON.parse(event.data).eventType == "FightEvent") {
        const fightEvent = FightEventDtoFromJSON(JSON.parse(event.data));
        setFightData(fightEvent);
        setInterval(() => {
          setFightData(undefined);
        }, 2000);
        setActionsLeft(actionsLeft() - 1);
      }
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
    myInventory,
    setFightData,
    fightData,
    actionsLeft,
    setActionsLeft,
    myTurn,
    setMyTurn,
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
