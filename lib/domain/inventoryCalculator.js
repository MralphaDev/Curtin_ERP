// lib/domain/inventoryCalculator.js

export function calculateInventory(events) {
  const map = new Map();

  console.log("📦 [CALC] events received:", events.length);

  for (const event of events) {
    const sign = event.action === "IN" ? 1 : -1;

    console.log(
      `➡️ [CALC] processing event=${event.id} action=${event.action} items=${event.items.length}`
    );

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
      const before = current.stock;

      current.stock += sign * item.quantity;

      console.log(
        `   ↳ item=${key} qty=${item.quantity} ${before} → ${current.stock}`
      );
    }
  }

  const result = Array.from(map.values());

  console.log("📊 [CALC] FINAL STOCK:", result);

  return result;
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