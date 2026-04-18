"use client";

import { useEffect, useState } from "react";
import { INVENTORY_MODES } from "@/lib/constants/inventoryModes";
import { ITEM_TYPES } from "@/lib/constants/itemTypes";

export default function NewInventory() {

  // ================================
  // 📦 DATA STATE (FROM API)
  // ================================
  const [products, setProducts] = useState([]);
  const [coilStd, setCoilStd] = useState([]);
  const [coilIndp, setCoilIndp] = useState([]);
  const [events, setEvents] = useState([]);

  // ================================
  // 🧾 SHARED STATE
  // ================================
  const [mode, setMode] = useState("");
  //  company is shared across IN/OUT submissions in this page
  const [company, setCompany] = useState("");

  // ❌ removed global action (now per-panel)

  // ================================
  // 🟢 IN STATE
  // ================================
  const [inSelectedValve, setInSelectedValve] = useState(null);
  const [inSelectedCoilStd, setInSelectedCoilStd] = useState(null);
  const [inSelectedCoilIndp, setInSelectedCoilIndp] = useState(null);
  const [inQuantity, setInQuantity] = useState(1);

  // ================================
  // 🔴 OUT STATE
  // ================================
  const [outSelectedValve, setOutSelectedValve] = useState(null);
  const [outSelectedCoilStd, setOutSelectedCoilStd] = useState(null);
  const [outSelectedCoilIndp, setOutSelectedCoilIndp] = useState(null);
  const [outQuantity, setOutQuantity] = useState(1);

  // ================================
  // 🌐 FETCH INITIAL DATA
  // ================================
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts);

    fetch("/api/coil")
      .then(res => res.json())
      .then((data) => {
        console.log("coil api:", data);

        if (data.standard && data.independent) {
          setCoilStd(data.standard);
          setCoilIndp(data.independent);
        } else if (Array.isArray(data)) {
          setCoilStd(data.filter(c => c.type === "standard"));
          setCoilIndp(data.filter(c => c.type === "independent"));
        }
      });

    fetch("/api/inventory-event")
      .then(res => res.json())
      .then(setEvents);
    
  }, []);

  // ================================
  // 🧠 BUILD ITEMS (UNCHANGED LOGIC)
  // ================================
  function buildItems(side) {
    const isIn = side === "IN";

    const selectedValve = isIn ? inSelectedValve : outSelectedValve;
    const selectedCoilStd = isIn ? inSelectedCoilStd : outSelectedCoilStd;
    const selectedCoilIndp = isIn ? inSelectedCoilIndp : outSelectedCoilIndp;
    const quantity = isIn ? inQuantity : outQuantity;

    switch (mode) {

      case INVENTORY_MODES.VALVE_ONLY:
        return [
          {
            item_type: ITEM_TYPES.VALVE_BODY,
            item_id: selectedValve,
            quantity,
          },
        ];

      case INVENTORY_MODES.COIL_STANDARD_ONLY:
        return [
          {
            item_type: ITEM_TYPES.COIL_STANDARD,
            item_id: selectedCoilStd,
            quantity,
          },
        ];

      case INVENTORY_MODES.COIL_INDEPENDENT_ONLY:
        return [
          {
            item_type: ITEM_TYPES.COIL_INDEPENDENT,
            item_id: selectedCoilIndp,
            quantity,
          },
        ];

      case INVENTORY_MODES.VALVE_PLUS_STANDARD:
        return [
          {
            item_type: ITEM_TYPES.VALVE_BODY,
            item_id: selectedValve,
            quantity,
          },
        ];

      case INVENTORY_MODES.VALVE_PLUS_INDEPENDENT:
        return [
          {
            item_type: ITEM_TYPES.VALVE_BODY,
            item_id: selectedValve,
            quantity,
          },
          {
            item_type: ITEM_TYPES.COIL_INDEPENDENT,
            item_id: selectedCoilIndp,
            quantity,
          },
        ];

      default:
        return [];
    }
  }

  // ================================
  // 🚀 SUBMIT (IN / OUT SPLIT)
  // ================================
  async function submit(side) {
    const body = {
      action: side,
      mode,
      company: company, // include company in payload
      remark: "from UI",
      items: buildItems(side),
    };

    const res = await fetch("/api/inventory-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    if (data.warnings?.length) {
      alert(data.warnings.join("\n"));
    }

    fetch("/api/inventory-event")
      .then(res => res.json())
      .then(setEvents);
    window.location.reload();
  }

  // ================================
  // 🔍 HELPERS
  // ================================
  function getValve(id) {
    return products.find(p => p.id === id)?.model_number || id;
  }

  function getCoilStd(id) {
    return coilStd.find(c => c.id === id)?.coil_model || id;
  }

  function getCoilIndp(id) {
    return coilIndp.find(c => c.id === id)?.coil_idp_model || id;
  }

  function formatEvent(event) {
    let valve = null;
    let coil = null;
    let qty = event.items[0]?.quantity;

    for (const item of event.items) {
      if (item.item_type === "valve_body") {
        valve = getValve(item.item_id);
      }
      if (item.item_type === "coil_standard") {
        coil = getCoilStd(item.item_id);
      }
      if (item.item_type === "coil_independent") {
        coil = getCoilIndp(item.item_id);
      }
    }

    if (valve && coil) return `${valve} + ${coil} (x${qty})`;
    if (valve) return `${valve} (x${qty})`;
    if (coil) return `${coil} (x${qty})`;

    return "Unknown";
  }

  async function deleteEvent(id) {
    const confirmDelete = confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/inventory-event?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    fetch("/api/inventory-event")
      .then(res => res.json())
      .then(setEvents);
  }

  // ================================
  // 🎨 UI
  // ================================
  return (
    <div className="p-4 space-y-4">

      <h1 className="text-xl font-bold">New Inventory Event</h1>

      {/* MODE */}
      <div>
        <label>Mode:</label>
        <select onChange={(e) => setMode(e.target.value)}>
          <option value="">Select Mode</option>
          {Object.values(INVENTORY_MODES).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* COMPANY */}
      {/* Shared form field used for both IN and OUT submissions */}
      <div>
        <label>Company:</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border px-2"
          placeholder="Enter company"
        />
      </div>

      {/* ===================== IN / OUT PANELS ===================== */}
      <div className="grid grid-cols-2 gap-6">

        {/* ================= IN ================= */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-bold text-green-600">IN</h2>

          {/* VALVE */}
          {(mode === INVENTORY_MODES.VALVE_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_STANDARD ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select onChange={(e) => setInSelectedValve(Number(e.target.value))}>
              <option value="">Select Valve</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.model_number}</option>
              ))}
            </select>
          )}

          {/* COIL STANDARD */}
          {mode === INVENTORY_MODES.COIL_STANDARD_ONLY && (
            <select onChange={(e) => setInSelectedCoilStd(Number(e.target.value))}>
              <option value="">Select Coil Standard</option>
              {coilStd.map((c) => (
                <option key={c.id} value={c.id}>{c.coil_model}</option>
              ))}
            </select>
          )}

          {/* COIL INDEPENDENT */}
          {(mode === INVENTORY_MODES.COIL_INDEPENDENT_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select onChange={(e) => setInSelectedCoilIndp(Number(e.target.value))}>
              <option value="">Select Coil Independent</option>
              {coilIndp.map((c) => (
                <option key={c.id} value={c.id}>{c.coil_idp_model}</option>
              ))}
            </select>
          )}

          {/* QTY */}
          <input
            type="number"
            min={1}
            value={inQuantity}
            onChange={(e) => setInQuantity(Number(e.target.value))}
            className="border px-2"
          />

          <button
            className="bg-green-600 text-white px-3 py-1"
            onClick={() => submit("IN")}
          >
            Submit IN
          </button>
        </div>

        {/* ================= OUT ================= */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-bold text-red-600">OUT</h2>

          {/* VALVE */}
          {(mode === INVENTORY_MODES.VALVE_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_STANDARD ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select onChange={(e) => setOutSelectedValve(Number(e.target.value))}>
              <option value="">Select Valve</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.model_number}</option>
              ))}
            </select>
          )}

          {/* COIL STANDARD */}
          {mode === INVENTORY_MODES.COIL_STANDARD_ONLY && (
            <select onChange={(e) => setOutSelectedCoilStd(Number(e.target.value))}>
              <option value="">Select Coil Standard</option>
              {coilStd.map((c) => (
                <option key={c.id} value={c.id}>{c.coil_model}</option>
              ))}
            </select>
          )}

          {/* COIL INDEPENDENT */}
          {(mode === INVENTORY_MODES.COIL_INDEPENDENT_ONLY ||
            mode === INVENTORY_MODES.VALVE_PLUS_INDEPENDENT) && (
            <select onChange={(e) => setOutSelectedCoilIndp(Number(e.target.value))}>
              <option value="">Select Coil Independent</option>
              {coilIndp.map((c) => (
                <option key={c.id} value={c.id}>{c.coil_idp_model}</option>
              ))}
            </select>
          )}

          {/* QTY */}
          <input
            type="number"
            min={1}
            value={outQuantity}
            onChange={(e) => setOutQuantity(Number(e.target.value))}
            className="border px-2"
          />

          <button
            className="bg-red-600 text-white px-3 py-1"
            onClick={() => submit("OUT")}
          >
            Submit OUT
          </button>
        </div>
      </div>

      {/* ================= EVENT HISTORY ================= */}
      <hr />

      <h2 className="text-lg font-bold">Inventory Events</h2>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="border p-3 rounded">

            <div className="font-bold">
              [{event.action}] {event.mode}
            </div>

            <div>{formatEvent(event)}</div>

            <div>Company: {event.company}</div>

            <div className="text-sm text-gray-500">
              {new Date(event.created_at).toLocaleString()}
            </div>

            <button
              onClick={() => deleteEvent(event.id)}
              className="bg-red-600 text-white px-2 py-1 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}