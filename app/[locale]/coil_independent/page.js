"use client";

import { useEffect, useState } from "react";
import { ITEM_TYPES } from "@/lib/constants/itemTypes";

export default function CoilIndependentPage() {
  const [coils, setCoils] = useState([]);

  const [coilModel, setCoilModel] = useState("");
  const [voltage, setVoltage] = useState("");
  const [manufacturer, setManufacturer] = useState("");

  async function loadCoils() {
    const res = await fetch("/api/coil");
    const data = await res.json();
    setCoils(data.independent);
  }

  useEffect(() => {
    loadCoils();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const body = {
      type: ITEM_TYPES.COIL_INDEPENDENT,
      data: {
        coil_idp_model: coilModel,
        voltage,
        manufacturer,
      },
    };

    const res = await fetch("/api/coil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (result.success) {
      setCoilModel("");
      setVoltage("");
      setManufacturer("");
      loadCoils();
    } else {
      alert(result.message);
    }
  }

  async function deleteCoil(id, type) {
  const ok = confirm("Delete this coil?");
  if (!ok) return;

  const res = await fetch(`/api/coil?id=${id}&type=${type}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  loadCoils();
}

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">coil_independent</h1>

      <form onSubmit={submit} className="border p-3 my-4">

        <input
          className="border p-1 block mb-2"
          placeholder="Coil Model"
          value={coilModel}
          onChange={(e) => setCoilModel(e.target.value)}
        />

        <input
          className="border p-1 block mb-2"
          placeholder="Voltage"
          value={voltage}
          onChange={(e) => setVoltage(e.target.value)}
        />

        <input
          className="border p-1 block mb-2"
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />

        <button className="bg-black text-white px-3 py-1">
          Create coil_independent
        </button>
      </form>

      <div className="mt-6">
        <h2 className="font-bold mb-2">Independent Coils</h2>

        {coils.map((c) => (
          <div key={c.id} className="border p-2 mb-2">
            <div>Model: {c.coil_idp_model}</div>
            <div>Voltage: {c.voltage}</div>
            <div>Manufacturer: {c.manufacturer}</div>

            {/* 🔥 NEW */}
            <div className="font-bold mt-1">
              Stock: {c.stock}
            </div>
            <button
              onClick={() => deleteCoil(c.id, ITEM_TYPES.COIL_INDEPENDENT)}
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