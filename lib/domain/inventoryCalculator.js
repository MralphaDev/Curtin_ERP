export function calculateInventory(events) {
  const map = new Map();

  for (const event of events) {
    const sign = event.action === "IN" ? 1 : -1;

    for (const item of event.items) {
      const key = `${item.item_type}_${item.item_id}`;

      if (!map.has(key)) {
        map.set(key, {
          item_type: item.item_type,
          item_id: item.item_id,
          stock: 0,
        });
      }

      const current = map.get(key);
      current.stock += sign * item.quantity;
    }
  }

  return Array.from(map.values());
}

/*export function calculateInventory(events) {
  const stockMap = {};

  for (const event of events) {
    for (const item of event.items) {
      const key = `${item.item_type}:${item.item_id}`;

      if (!stockMap[key]) {
        stockMap[key] = 0;
      }

      if (event.action === "IN") {
        stockMap[key] += item.quantity;
      }

      if (event.action === "OUT") {
        stockMap[key] -= item.quantity;
      }
    }
  }

  return stockMap;
}*/