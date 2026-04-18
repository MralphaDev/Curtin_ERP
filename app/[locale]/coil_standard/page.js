"use client";

import { useEffect, useState } from "react";
import { ITEM_TYPES } from "@/lib/constants/itemTypes";

export default function CoilStandardPage() {
  const [products, setProducts] = useState([]);
  const [coils, setCoils] = useState([]);

  const [selectedModel, setSelectedModel] = useState("");

  // 🔥 CHANGED: split voltage into value + type
  const [voltageValue, setVoltageValue] = useState("");
  const [voltageType, setVoltageType] = useState("VAC");

  const [manufacturer, setManufacturer] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  async function loadCoils() {
    const res = await fetch("/api/coil");
    const data = await res.json();
    setCoils(data.standard);
  }

  useEffect(() => {
    loadCoils();
  }, []);

  async function submit(e) {
    e.preventDefault();

    // 🔥 CHANGED: combine both fields into original API format
    const voltage = voltageValue !== "" ? `${voltageValue}${voltageType}` : "";

    const body = {
      type: ITEM_TYPES.COIL_STANDARD,
      data: {
        model_number: selectedModel,
        voltage, // unchanged API contract
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
      setSelectedModel("");
      setVoltageValue("");
      setVoltageType("VAC");
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
      <h1 className="text-xl font-bold">coil_standard</h1>

      <form onSubmit={submit} className="border p-3 my-4">

        <select
          className="border p-1 block mb-2"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="">Select Valve Model</option>

          {products.map((p) => (
            <option key={p.id} value={p.model_number}>
              {p.model_number} - {p.manufacturer}
            </option>
          ))}
        </select>

        <div className="mb-2 text-sm text-gray-600">
          Coil Model: <b>{selectedModel}</b>
        </div>

        {/* 🔥 NEW: Voltage split input */}
        <div className="flex gap-2 mb-2">
          <input
            className="border p-1 w-1/2"
            type="number"
            min="0"
            placeholder="Voltage value"
            value={voltageValue}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Number(val) >= 0) {
                setVoltageValue(val);
              }
            }}
          />

          <select
            className="border p-1 w-1/2"
            value={voltageType}
            onChange={(e) => setVoltageType(e.target.value)}
          >
            <option value="VAC">VAC</option>
            <option value="VDC">VDC</option>
          </select>
        </div>

        <input
          className="border p-1 block mb-2"
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />

        <button className="bg-black text-white px-3 py-1">
          Create coil_standard
        </button>
      </form>

      {/* LIST */}
      <div className="mt-6">
        <h2 className="font-bold mb-2">Existing Standard Coils</h2>

        {coils.map((c) => (
          <div key={c.id} className="border p-2 mb-2">
            <div>Coil Model: {c.coil_model}</div>
            <div>Valve Model: {c.valve_model}</div>
            <div>Voltage: {c.voltage}</div>
            <div>Manufacturer: {c.manufacturer}</div>

            <div className="font-bold mt-1">
              Stock: {c.stock}
            </div>

            <button
              onClick={() => deleteCoil(c.id, ITEM_TYPES.COIL_STANDARD)}
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