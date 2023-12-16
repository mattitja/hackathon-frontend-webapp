import { useGame } from "../contexts/game";
import { InventoryUpdateActionDto, WeaponDto } from "../generated/whackend";

export const PrepareRoute = () => {
  const {
    gameId,
    playerId,
    ws,
    setName,
    setGameId,
    boardProperties,
    isBoardVisible,
    playerPositions,
  } = useGame();

  const handleInventoryDoneClick = () => {
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
    <section id="create-inventory">
      <div>
        Inventory
        <button onClick={handleInventoryDoneClick}>I am ready</button>
      </div>
    </section>
  );
};
