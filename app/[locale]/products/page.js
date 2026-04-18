"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const [modelNumber, setModelNumber] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [pressureMin, setPressureMin] = useState("");
  const [pressureMax, setPressureMax] = useState("");
  const [connection, setConnection] = useState("");

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model_number: modelNumber,
        category,
        manufacturer,

        // NEW FIELDS
        inner_diameter_mm: innerDiameter,
        temp_min_c: tempMin,
        temp_max_c: tempMax,
        pressure_min_bar: pressureMin,
        pressure_max_bar: pressureMax,
        connection,
      }),
    });

    const result = await res.json();

    if (result.success) {
      setModelNumber("");
      setCategory("");
      setManufacturer("");
      setInnerDiameter("");
      setTempMin("");
      setTempMax("");
      setPressureMin("");
      setPressureMax("");
      setConnection("");
      loadProducts();
    } else {
      alert(result.message);
    }
  }

  async function deleteProduct(id) {
  const ok = confirm("Delete this valve body?");
  if (!ok) return;

  const res = await fetch(`/api/products?id=${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  loadProducts();
}

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Products</h1>

      <form onSubmit={submit} className="my-4 border p-3">
        <input
          className="border p-1 mr-2"
          placeholder="Model Number"
          value={modelNumber}
          onChange={(e) => setModelNumber(e.target.value)}
        />

        <input
          className="border p-1 mr-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          className="border p-1 mr-2"
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />

        {/* NEW FIELDS */}

        <input
          className="border p-1 mr-2"
          placeholder="Inner Diameter (mm)"
          value={innerDiameter}
          onChange={(e) => setInnerDiameter(e.target.value)}
        />

        <input
          className="border p-1 mr-2"
          placeholder="Temp Min (°C)"
          value={tempMin}
          onChange={(e) => setTempMin(e.target.value)}
        />

        <input
          className="border p-1 mr-2"
          placeholder="Temp Max (°C)"
          value={tempMax}
          onChange={(e) => setTempMax(e.target.value)}
        />

        <input
          className="border p-1 mr-2"
          placeholder="Pressure Min (bar)"
          value={pressureMin}
          onChange={(e) => setPressureMin(e.target.value)}
        />

        <input
          className="border p-1 mr-2"
          placeholder="Pressure Max (bar)"
          value={pressureMax}
          onChange={(e) => setPressureMax(e.target.value)}
        />

        <input
          className="border p-1 mr-2"
          placeholder="Connection (e.g. G1/4)"
          value={connection}
          onChange={(e) => setConnection(e.target.value)}
        />

        <button onClick={() => {window.location.reload();}} className="bg-black text-white px-3 py-1">
          Create
        </button>
      </form>

      {products.map((p) => (
        <div key={p.id} className="border p-2 my-2">
          
          <div>Model: {p.model_number}</div>
          <div>Manufacturer: {p.manufacturer}</div>
          <div>Category: {p.category}</div>
          <div>Inner Diameter: {p.inner_diameter_mm} mm</div>
          <div>Temperature Range: {p.temp_min_c}°C to {p.temp_max_c}°C</div>
          <div>Pressure Range: {p.pressure_min_bar} bar to {p.pressure_max_bar} bar</div>
          <div>Connection: {p.connection}</div>

          <div className="font-bold mt-1">
            Stock: {p.stock}
          </div>
          <button
            className="bg-red-500 text-white px-3 py-1 mt-2"
            onClick={() => deleteProduct(p.id)}
          >
            Delete
          </button>
        </div>
        
      ))}
    </div>
  );
}