import { For, Show } from "solid-js";
import { useGame } from "../contexts/game";
import {
  FinishTurnActionDto,
  MovementActionDto,
  PlayerDto,
  WeaponDto,
} from "../generated/whackend";
import styles from "./PlayRoute.module.css";
import SchereImgUrl from "../components/weapons/schere.png";
import SteinImgUrl from "../components/weapons/stein.png";
import PapierImgUrl from "../components/weapons/papier.png";

const weaponToImageMap: Record<WeaponDto, string> = {
  SCHERE: SchereImgUrl,
  STEIN: SteinImgUrl,
  PAPIER: PapierImgUrl
} as const;

export const PlayRoute = () => {
  const {
    playerId,
    gameId,
    players,
    ws,
    playersTurn,
    boardProperties,
    playerPositions,
    myInventory,
    fightData,
    myTurn,
    actionsLeft,
  } = useGame();

  const totalTiles = new Array(
    boardProperties().rows * boardProperties().cols
  ).fill(0);

  function isFight() {
    return fightData() != undefined;
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
    <section class={['stack', styles.container].join(' ')}>
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
        {overlays.map((o: { x: number; y: number }) => {
          if (playerPositions().get(playerId()) != undefined) {
            return (
              <div
                hidden={!myTurn() || !actionsLeft()}
                class={styles.overlay}
                onClick={() =>
                  handleMovePlayer(
                    playerPositions().get(playerId()).posX + o.x,
                    playerPositions().get(playerId()).posY + o.y
                  )
                }
                style={{
                  "grid-column-start":
                    playerPositions().get(playerId()).posX + o.x,
                  "grid-row-start":
                    playerPositions().get(playerId()).posY + o.y,
                }}
              ></div>
            );
          }
        })}

        {players().map((p: PlayerDto) => {
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
        <Show when={isFight()}>
          <div
            class={styles.fightWeapon}
            style={{
              "--player-row": playerPositions().get(fightData().playerId1).posY,
              "--player-col": playerPositions().get(fightData().playerId1).posX,
              "--weapon-url": `url(src/components/weapons/${
                fightData().playerWeapon1
              }.png)`,
            }}
          ></div>
          <div
            class={styles.fightWeapon}
            style={{
              "--player-row": playerPositions().get(fightData().playerId2).posY,
              "--player-col": playerPositions().get(fightData().playerId2).posX,
              "--weapon-url": `url(src/components/weapons/${
                fightData().playerWeapon2
              }.png)`,
            }}
          ></div>
        </Show>
      </div>
      <div class={['stack', styles.footer].join(' ')}>
        <button type="button" class={styles.inventory}>
          <For each={myInventory()}>
            {(w: WeaponDto, idx) => {
            return (
              <div
                class={styles.inventoryItem}
                style={{ "--inventory-slot": idx() + 1 }}
              >
                <img src={weaponToImageMap[w]} alt={w} />
              </div>
            );
          }}
          </For>
          <strong class="empty">There are no items in your inventory</strong>
        </button>
        <Show when={myTurn()}>
          <button type="button" onClick={handleFinishTurn}>
            Finish Turn
          </button>
        </Show>
      </div>
    </section>
  );
};
