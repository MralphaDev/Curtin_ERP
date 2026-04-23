"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Plus, Package, Trash2, Loader2, Thermometer, Gauge, Circle, Link2, Boxes } from "lucide-react";
import ManufacturerFilter from "../ManufacturerFilter";
export default function ProductsPage({ user }) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const dict = getDictionary(locale);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImg, setPreviewImg] = useState(null);

  const [modelError, setModelError] = useState("");//model number error only for client-side validation, server will still validate and return error if duplicate or invalid data is sent
  const [uploading, setUploading] = useState(false); // for img uploading state
  const [form, setForm] = useState({
    model_number: "",
    category: "",
    manufacturer: "",
    inner_diameter_mm: "",
    temp_min_c: "",
    temp_max_c: "",
    pressure_min_bar: "",
    pressure_max_bar: "",
    connection: "",
    image_url: "",
  });
  const [manufacturerFilter, setManufacturerFilter] = useState("");

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    setUploading(true);

    const res = await fetch("https://gsvi.cc/api-inv/upload.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Upload failed");
    }

    if (data.url) {
      update("image_url", data.url);
    } else {
      throw new Error("No URL returned");
    }

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    alert("Upload failed (check console)");
  } finally {
    setUploading(false);
  }
}

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();

    data.sort((a, b) => b.id - a.id);

    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
  e.preventDefault();

  // ✅ 统一清洗：trim + 防止 undefined/null
  const cleanedForm = Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  );

  // 🚨 关键：提交前再次校验（最终防线）
  const duplicate = products.some(
    (p) =>
      normalize(p.model_number_active) ===
      normalize(cleanedForm.model_number)
  );

  if (duplicate) {
    alert("型号已存在，禁止提交");
    return;
  }

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanedForm),
  });

  const result = await res.json();

  if (result.success) {
    setForm({
      model_number: "",
      category: "",
      manufacturer: "",
      inner_diameter_mm: "",
      temp_min_c: "",
      temp_max_c: "",
      pressure_min_bar: "",
      pressure_max_bar: "",
      connection: "",
      image_url: "",
    });
    load();
  } else {
    alert(result.message);
  }
}

  async function remove(id) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    load();
  }

function normalize(s) {
  return (s || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^\w\u4e00-\u9fa5]/g, "");
}

const isDuplicateModelNumber = (value, products) => {
  const n = normalize(value);

  return products.some(
    (p) => normalize(p.model_number_active) === n
  );
};

const MANUFACTURERS = [
  "JAKSA",
  "CEME",
  "ROTORK",
  "GOETVALVE",
  "SATURN",
];

const CATEGORIES = [
  "通用电磁阀",
  "气动角座阀",
  "单向阀",
  "液氮过滤器",
  "安全阀",
  "离心泵",
  "电磁泵",
  "压力传感器",
  "压力开关",
  "压力表",
  "温度表",
  "水用电磁阀",
  "二位三通电磁阀",
  "高压电磁阀",
  "真空电磁阀",
  "常开电磁阀",
  "防爆电磁阀",
  "低温电磁阀",
  "高温电磁阀",
  "液位开关",
  "流量开关",
  "膜片",
];

const fields = [
  ["model_number", dict.modelNumber, "text"],
  ["category", dict.category, "select", CATEGORIES],
  ["manufacturer", dict.manufacturerBody, "select", MANUFACTURERS],
  ["inner_diameter_mm", dict.innerDiameter, "int"],
  ["temp_min_c", dict.tempMin, "int"],
  ["temp_max_c", dict.tempMax, "int"],
  ["pressure_min_bar", dict.pressureMin, "int"],
  ["pressure_max_bar", dict.pressureMax, "int"],
  ["connection", dict.connectionType, "text"],
  ["image_url", "", "image"],
];

const filteredProducts = manufacturerFilter
  ? products.filter((p) => p.manufacturer === manufacturerFilter)
  : products;

  return (
<div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50 relative">

  {/* Background FX */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-[500px] md:w-[600px] h-[500px] md:h-[600px] bg-sky-100/60 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
  </div>

  <div className="relative w-full px-4 sm:px-6 lg:px-16 py-8 md:py-10">

    {/* ================= HEADER ================= */}
    <header className="mb-8 md:mb-10">
      <div className="flex items-start md:items-center gap-4">

        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25">
          <Boxes className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {dict.bodyTitle}
          </h1>

          <p className="text-slate-500 text-xs md:text-sm">
            {dict.bodyDesc}
          </p>
        </div>

      </div>
    </header>

    {/* ================= MAIN GRID ================= */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

      {/* ================= FORM ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* Form Header */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                {dict.createBodyTitle}
              </h2>

              <p className="text-xs text-slate-500">
                {dict.createBodyDesc}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-4 md:space-y-5">

            {/* responsive fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

              {fields.map(([key, label, type, options]) => (
                <div key={key} className="relative">

                  {/* SELECT */}
                  {type === "image" ? (
                  <div className="space-y-3">

                    {/* custom upload button */}
                    <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50 cursor-pointer transition">

                      <span className="text-sm font-medium text-slate-600">
                        Upload Image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file);
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* uploading state */}
                    {uploading && (
                      <div className="text-xs text-sky-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                        Uploading image...
                      </div>
                    )}


                  </div>) : type === "select" ? (
                    <select
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="
                        peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-slate-200 bg-white
                        text-sm text-slate-900 outline-none
                        focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10
                        transition
                      "
                    >
                      <option value="" disabled hidden />
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    ) : (
                    /* INPUT */
                    <input
                      type={type === "int" ? "text" : "text"}
                      inputMode={type === "int" ? "numeric" : undefined}
                      value={form[key]}
                      onKeyDown={(e) => {
                        if (type !== "int") return;

                        // allow control keys
                        if (
                          e.key === "Backspace" ||
                          e.key === "Delete" ||
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowRight" ||
                          e.key === "Tab"
                        ) return;

                        // block everything except digits
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        update(key, value);

                        if (key === "model_number") {
                          const duplicate = isDuplicateModelNumber(value, products);
                          setModelError(duplicate ? "检测到重复型号" : "");
                        }
                      }}
                      placeholder=" "
                      className="
                        peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-slate-200 bg-white
                        text-sm text-slate-900 placeholder-transparent outline-none
                        focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10
                        transition
                      "
                    />
                  )}

                  

                  {/* ⭐ 这里放错误提示 */}
                  {key === "model_number" && modelError && (
                    <p className="text-red-500 text-xs mt-1">
                      {modelError}
                    </p>
                  )}

                  {/* LABEL */}
                  <label className="
                    absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                    peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case
                    peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px]
                    peer-focus:text-sky-600 transition-all pointer-events-none
                  ">
                    {label}
                  </label>

                </div>
              ))}

            </div>

              {/* preview */}
             {form.image_url && (
                      <div className="relative group w-fit">
                        <img
                          src={form.image_url}
                          className="w-28 h-28 object-cover rounded-xl border shadow-sm"
                        />

                        {/* hover overlay */}
                        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                          <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition">
                            Uploaded
                          </span>
                        </div>
                      </div>
              )}

            <button
              type="submit"
              className="
                w-full py-3 md:py-4 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-sky-500 to-blue-600 text-white
                hover:from-sky-400 hover:to-blue-500
                active:scale-[0.98] transition
                shadow-lg shadow-sky-500/30
              "
            >
              {dict.createProduct}
            </button>


          </form>

        </div>
      </div>



      {/* ================= LIST ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* List Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              <div>
               <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                {dict.productListTitle}
              </h2>

              <p className="text-xs text-slate-500">
                {dict.productListDesc}
              </p>
              </div>

            </div>

            <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-100 border border-slate-200">

              {loading ? (
                <Loader2 className="w-3.5 h-3.5 text-sky-500 animate-spin" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            <span className="text-xs font-medium text-slate-600">
              {loading ? dict.loading : `${products.length} ${dict.items}`}
            </span>

            </div>

          </div>

          <ManufacturerFilter
          value={manufacturerFilter}
          onChange={setManufacturerFilter}
          manufacturers={MANUFACTURERS}
        />

          {/* LIST */}
          <div className="space-y-4 max-h-[65vh] md:max-h-[70vh] overflow-y-auto pr-1 md:pr-2">

            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 md:p-6 animate-pulse" />
                ))
              : filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="
                      group relative rounded-2xl border-2 border-slate-100 bg-white
                      p-4 md:p-6
                      hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50
                      transition
                    "
                  >

                   {/* top row: image + header + delete */}
                    <div className="flex items-start justify-between mb-4">
                    {p.image_url && (
                      <div className="mb-4">
                        <img
                          src={p.image_url}
                          alt={p.model_number_active}
                          onClick={() => setPreviewImg(p.image_url)}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition"
                        />
                      </div>
                    )}

                     {/* header */}

                      <div>
                        <h3 className="font-bold text-base md:text-lg text-slate-900 group-hover:text-sky-700">
                          {p.model_number_active}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500">
                          {p.manufacturer} | {p.category}
                        </p>
                      </div>

                  

                      {user.role === "admin" && (
                        <button className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                          <Trash2 onClick={() => remove(p.id)} className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                    {/* mobile-friendly stack instead of strict grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 text-sm flex items-center gap-2">
                      ⚪
                      <span>
                        {dict.diameter}: <b>{p.inner_diameter_mm}</b> mm
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm truncate flex items-center gap-2">
                      🔗
                      <span>{p.connection}</span>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 text-sm flex items-center gap-2">
                      🌡️
                      <span>
                        {dict.temp}: {p.temp_min_c} → {p.temp_max_c} °C
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 text-sm flex items-center gap-2">
                      ⏱️
                      <span>
                        {dict.pressure}: {p.pressure_min_bar} → {p.pressure_max_bar} bar
                      </span>
                    </div>

                    </div>

                    {/* stock */}
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                        ● Stock: {p.stock}
                      </span>
                    </div>

                  </div>
                ))}

          </div>
          
          
          

        </div>
      </div>

    </div>
  </div>

{previewImg && (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
    onClick={() => setPreviewImg(null)}
  >
    <div
      className="bg-white p-3 rounded-xl shadow-2xl max-w-md w-[90%]"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={previewImg}
        className="w-full max-h-[60vh] object-contain rounded-lg"
      />

      <button
        onClick={() => setPreviewImg(null)}
        className="mt-3 w-full py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
      >
        Close
      </button>
    </div>
  </div>
)}
</div>
  );
}
