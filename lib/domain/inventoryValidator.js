import { INVENTORY_MODES } from "@/lib/constants/inventoryModes";
import { ITEM_TYPES } from "@/lib/constants/itemTypes";

export function validateInventoryEvent(event) {
  const { mode, items } = event;

  if (!mode || !items?.length) {
    throw new Error("Invalid event structure");
  }

  const itemTypes = items.map(i => i.item_type);

  switch (mode) {
    case INVENTORY_MODES.VALVE_ONLY:
      if (!itemTypes.every(t => t === ITEM_TYPES.VALVE_BODY)) {
        throw new Error("VALVE_ONLY allows only valve_body");
      }
      break;

    case INVENTORY_MODES.COIL_STANDARD_ONLY:
      if (!itemTypes.every(t => t === ITEM_TYPES.COIL_STANDARD)) {
        throw new Error("Only standard coils allowed");
      }
      break;

    case INVENTORY_MODES.COIL_INDEPENDENT_ONLY:
      if (!itemTypes.every(t => t === ITEM_TYPES.COIL_INDEPENDENT)) {
        throw new Error("Only independent coils allowed");
      }
      break;

    case INVENTORY_MODES.VALVE_PLUS_STANDARD:
      if (!itemTypes.includes(ITEM_TYPES.VALVE_BODY)) {
        throw new Error("Valve required");
      }
      break;

    case INVENTORY_MODES.VALVE_PLUS_INDEPENDENT:
      if (!itemTypes.includes(ITEM_TYPES.VALVE_BODY)) {
        throw new Error("Valve required");
      }
      break;

    default:
      throw new Error("Unknown mode");
  }

  return true;
}