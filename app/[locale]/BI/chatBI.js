"use client";

import { useEffect, useState ,useRef} from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import SearchableSelect from "./searchableSelect";
// ================= AUTO SCROLL LOGIC =================
//
// chatRef points to the scrollable chat container (the div with overflow-y-auto)
//
// Whenever `messages` changes (new user message, AI reply, chart, table, etc.):
// 1. React re-renders the UI
// 2. useEffect runs after render
// 3. We check if chatRef exists
// 4. We set scrollTop = scrollHeight
//
// 👉 Meaning:
// scrollTop = how far you are currently scrolled
// scrollHeight = total height of all messages
//
// By setting:
// scrollTop = scrollHeight
// we force the container to jump to the bottom
// so the latest message is always visible
//
// =====================================================

export default function ChatBI() {
  const [messages, setMessages] = useState([]);

  const [mode, setMode] = useState("category"); 
  const [subMode, setSubMode] = useState("");
  const [salesMode, setSalesMode] = useState(""); // NEW

  const [products, setProducts] = useState([]);
  const [coils, setCoils] = useState([]);

  const [selectedModel, setSelectedModel] = useState("");
  const [category, setCategory] = useState("");

  const [topN, setTopN] = useState(""); // NEW

  const chatRef = useRef(null);

  // INIT
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hi! What can I help you with today? Please select a category.",
        type: "text"
      }
    ]);
  }, []);

  useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [messages]);

  // LOAD VALVE BODY
  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // LOAD COILS
  const loadCoils = async () => {
    const res = await fetch("/api/coil");
    const data = await res.json();
    setCoils(data.independent || []);
  };

  // CATEGORY
const handleCategory = async (cat) => {
  setCategory(cat);

  if (cat === "inventory") {
    setMessages((m) => [
      ...m,
      { role: "user", content: "Inventory related question", type: "text" },
      { role: "assistant", content: "Choose inventory type.", type: "text" }
    ]);

    setMode("inventoryType");
  }

  if (cat === "sales") {
    setMessages((m) => [
      ...m,
      { role: "user", content: "Sales related question", type: "text" },
      { role: "assistant", content: "Choose analytics type.", type: "text" }
    ]);

    setMode("salesType");
  }
};

//SALES HANDLER
const handleSalesType = (type) => {
  setSalesMode(type);

  setMessages((m) => [
    ...m,
    {
      role: "user",
      content:
        type === "topProducts"
          ? "Top Selling Valve Bodies"
          : "Top Customer Companies",
      type: "text"
    },
    {
      role: "assistant",
      content: "Enter Top N (integer only).",
      type: "text"
    }
  ]);

  setMode("salesForm");
};

  // INVENTORY TYPE
  const handleInventoryType = async (type) => {
    setSubMode(type);

    if (type === "standard") {
      await loadProducts();

      setMessages((m) => [
        ...m,
        { role: "user", content: "Valve Body + Standard Coil", type: "text" },
        { role: "assistant", content: "Please select a valve body model.", type: "text" }
      ]);

      setMode("form");
    }

    if (type === "independent") {
      await loadCoils();

      setMessages((m) => [
        ...m,
        { role: "user", content: "Independent Coil", type: "text" },
        { role: "assistant", content: "Please select coil model.", type: "text" }
      ]);

      setMode("coilForm");
    }
  };

const submitQuery = async () => {
  //
  // ✅ SALES LOGIC
  //
  if (category === "sales") {
    if (!topN || isNaN(topN)) return;

    const res = await fetch("/api/chatbi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        type: salesMode,
        topN: Number(topN)
      })
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "user", content: `Top ${topN}`, type: "text" },
      {
        role: "assistant",
        content: data.answer,
        type: "chart"
      },
      {
        role: "assistant",
        content: "Next question — please select a category.",
        type: "text"
      }
    ]);

    // reset
    setTopN("");
    setMode("category");
    setCategory("");
    setSalesMode("");
    return;
  }

  //
  // ✅ INVENTORY LOGIC
  //
  if (category === "inventory") {
    if (!selectedModel) return;

    const res = await fetch("/api/chatbi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        type: subMode, // standard OR independent
        key: selectedModel
      })
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "user", content: selectedModel, type: "text" },
      {
        role: "assistant",
        content: data.answer,
        type: Array.isArray(data.answer) ? "table" : "text"
      },
      {
        role: "assistant",
        content: "Next question — please select a category.",
        type: "text"
      }
    ]);

    // reset
    setSelectedModel("");
    setMode("category");
    setCategory("");
    setSubMode("");
    return;
  }
};

  return (
    <div className="flex flex-col h-full relative overflow-hidden">

      {/* HEADER */}
      <div className="px-4 py-3 border-b bg-white/60 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-sky-600">AI ChatBI</h3>
      </div>

      {/* CHAT */}
      <div
        ref={chatRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth"
      >

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={m.role === "user" ? "text-right" : "text-left"}>
              <div
              className={`px-4 py-2 rounded-2xl inline-block break-words ${
                m.role === "user"
                  ? "bg-blue-500 text-white max-w-[60%] ml-auto"
                  : "bg-white border border-sky-100 max-w-[80%]"
              }`}
              >
                {m.type === "table" ? (
                  <TableView data={m.content} />
                ) : m.type === "chart" ? (
                  <ChartView data={m.content} />
                ) : (
                  m.content
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* CATEGORY */}
        {mode === "category" && (
          <div className="flex gap-3">
            <button
              onClick={() => handleCategory("inventory")}
              className="px-4 py-2 bg-sky-500 text-white rounded-xl"
            >
              库存查询
            </button>

            <button 
            onClick={() => handleCategory("sales")}
            className="px-4 py-2 bg-gray-300 rounded-xl">
              业绩查询
            </button>
          </div>
        )}

        {/* INVENTORY TYPE */}
        {mode === "inventoryType" && (
          <div className="flex gap-3">
            <button
              onClick={() => handleInventoryType("standard")}
              className="px-4 py-2 bg-sky-500 text-white rounded-xl"
            >
               主体+标配线圈
            </button>

            <button
              onClick={() => handleInventoryType("independent")}
              className="px-4 py-2 bg-gray-300 rounded-xl"
            >
              中性线圈
            </button>
          </div>
        )}

        {mode === "salesType" && (
        <div className="flex gap-3">
          <button
            onClick={() => handleSalesType("topProducts")}
            className="px-4 py-2 bg-sky-500 text-white rounded-xl"
          >
            最畅销的型号
          </button>

          <button
            onClick={() => handleSalesType("topCompanies")}
            className="px-4 py-2 bg-gray-300 rounded-xl"
          >
            客户购买量排行
          </button>
        </div>
        )}

        {mode === "salesForm" && (
  <div className="p-4 border rounded-xl bg-white space-y-3">
    <input
      type="number"
      placeholder="Enter Top N"
      className="w-full border p-2 rounded-lg"
      value={topN}
      onChange={(e) => setTopN(e.target.value)}
    />

    <button
      onClick={submitQuery}
      className="w-full bg-sky-500 text-white py-2 rounded-xl"
    >
      Run Analysis
    </button>
  </div>
        )}

        {/* STANDARD FORM */}
        {mode === "form" && (
          <div className="p-4 border rounded-xl bg-white space-y-3">
            <label className="text-sm font-medium">
              请选择型号 /Select Valve Body Model
            </label>

            {/*<select
              className="w-full border p-2 rounded-lg"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">-- select --</option>
              {products.map((p) => (
                <option key={p.id} value={p.model_number_active}>
                  {p.model_number_active}
                </option>
              ))}
            </select>*/}
            <SearchableSelect
            list={products}
            value={selectedModel}
            setValue={setSelectedModel}
            placeholder="-- select --"
            getLabel={(p) => p.model_number_active}
            getValue={(p) => p.model_number_active}
          />

            <button
              onClick={submitQuery}
              className="w-full bg-sky-500 text-white py-2 rounded-xl"
            >
              Query Stock
            </button>
          </div>
        )}

        {/* INDEPENDENT FORM */}
        {mode === "coilForm" && (
          <div className="p-4 border rounded-xl bg-white space-y-3">
            <label className="text-sm font-medium">
              Select Coil Model
            </label>

            {/*<select
              className="w-full border p-2 rounded-lg"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">-- select --</option>
              {coils.map((c) => (
                <option key={c.id} value={c.unique_key_active}>
                  {c.unique_key_active}
                </option>
              ))}
            </select>*/}
            <SearchableSelect
            list={coils}
            value={selectedModel}
            setValue={setSelectedModel}
            placeholder="-- select --"
            getLabel={(c) => c.unique_key_active}
            getValue={(c) => c.unique_key_active}
          />

            <button
              onClick={submitQuery}
              className="w-full bg-sky-500 text-white py-2 rounded-xl"
            >
              Query Stock
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

//
// ✅ TABLE COMPONENT
//
function TableView({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500">No data</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border rounded-xl overflow-hidden">
        <thead className="bg-sky-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left font-semibold text-sky-700"
              >
                {formatHeader(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="px-3 py-2">
                  {formatValue(col, row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartView({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-sm text-gray-500">No data</div>;
  }

  const chartWidth = Math.max(data.length * 70, 300);

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ width: chartWidth, height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
//
// ✅ FORMAT HELPERS
//
function formatHeader(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(key, val) {
  if (val === null || val === undefined) return "-";

  // stock highlight
  if (key === "stock") {
    return Number(val) > 0 ? (
      <span className="text-green-600 font-semibold">{val}</span>
    ) : (
      <span className="text-red-500 font-semibold">{val}</span>
    );
  }

  // number formatting
  if (!isNaN(val)) {
    return Number(val).toLocaleString();
  }

  return val;
}