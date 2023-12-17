import { useGame } from "../contexts/game";
import { InventoryUpdateActionDto, WeaponDto } from "../generated/whackend";
import styles from "./PrepareRoute.module.css";

export const PrepareRoute = () => {
  const game = useGame();
  const {
    gameId,
    playerId,
    ws,
  } = game ?? {};

  const handleInventoryDoneClick = () => {
    if (!playerId?.()) {
      throw Error(`Expected \`playerId\` to be defined but found it to be \`${playerId?.()}\``);
    }
    if (!gameId?.()) {
      throw Error(`Expected \`gameId\` to be defined but found it to be \`${gameId?.()}\``);
    }
    if (!ws) {
      throw Error(`Expected a valid websocket instance (\`ws\`) found it to be \`${ws}\``);
    }

    var inventory = [
      WeaponDto.Schere,
      WeaponDto.Stein,
      WeaponDto.Papier,
      WeaponDto.Stein,
      WeaponDto.Papier,
    ];
    const action: InventoryUpdateActionDto = {
      actionType: "InventoryUpdateAction",
      playerId: playerId(),
      gameId: gameId(),
      weapons: inventory.sort((a, b) => 0.5 - Math.random()),
    };
    ws.send(JSON.stringify(action));
  };

  return (
    <section class={['stack', styles.container].join(' ')}>
      <h1>Prepare yourself</h1>
      <div class="card">
        <span>Inventory</span>
      </div>
      <button onClick={handleInventoryDoneClick}>I am ready</button>
    </section>
  );
};
