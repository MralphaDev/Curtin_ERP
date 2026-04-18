"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);

    const res = await fetch("/api/products");
    const data = await res.json();

    setProducts(data);
    setLoading(false);
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
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Products
      </h1>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        {[
          { v: modelNumber, s: setModelNumber, p: "Model Number" },
          { v: category, s: setCategory, p: "Category" },
          { v: manufacturer, s: setManufacturer, p: "Manufacturer" },
          { v: innerDiameter, s: setInnerDiameter, p: "Inner Diameter (mm)" },
          { v: tempMin, s: setTempMin, p: "Temp Min (°C)" },
          { v: tempMax, s: setTempMax, p: "Temp Max (°C)" },
          { v: pressureMin, s: setPressureMin, p: "Pressure Min (bar)" },
          { v: pressureMax, s: setPressureMax, p: "Pressure Max (bar)" },
          { v: connection, s: setConnection, p: "Connection" },
        ].map((f, i) => (
          <input
            key={i}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
            placeholder={f.p}
            value={f.v}
            onChange={(e) => f.s(e.target.value)}
          />
        ))}

        <button
          type="submit"
          className="col-span-2 md:col-span-3 mt-2 rounded-xl bg-black text-white py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Create Product
        </button>
      </form>

      {/* PRODUCT AREA (no jitter, reserved space) */}
      <div className="grid md:grid-cols-2 gap-4 min-h-[300px]">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-gray-100 animate-pulse"
              />
            ))
          : products.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">
                      {p.model_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {p.manufacturer} • {p.category}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-1 text-sm text-gray-700">
                  <div>Ø {p.inner_diameter_mm} mm</div>
                  <div>{p.connection}</div>
                  <div>
                    {p.temp_min_c}°C → {p.temp_max_c}°C
                  </div>
                  <div>
                    {p.pressure_min_bar} → {p.pressure_max_bar} bar
                  </div>
                </div>

                <div className="mt-4 text-sm font-medium">
                  Stock: {p.stock}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
