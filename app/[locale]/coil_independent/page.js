"use client";

import { useEffect, useState } from "react";
import { ITEM_TYPES } from "@/lib/constants/itemTypes";
import { Boxes, Plus ,Trash2} from "lucide-react";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import ManufacturerFilter from "../ManufacturerFilter";

export default function CoilIndependentPage({user}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const dict = getDictionary(locale);
  const [coils, setCoils] = useState([]);

  const [coilModel, setCoilModel] = useState("");
  const [coilError, setCoilError] = useState("");// coil model error for client-side validation

  // split voltage
  const [voltageValue, setVoltageValue] = useState("");
  const [voltageType, setVoltageType] = useState("VAC");

  const [manufacturer, setManufacturer] = useState("");

  const [previewImg, setPreviewImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    coil_idp_model: "",
    voltage: "",
    manufacturer: "",
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

    if (!res.ok) throw new Error(data?.error || "Upload failed");

    setForm((prev) => ({
      ...prev,
      image_url: data.url,
    }));
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    alert("Upload failed");
  } finally {
    setUploading(false);
  }
}

  async function loadCoils() {
    const res = await fetch("/api/coil");
    const data = await res.json();
    setCoils(data.independent);
  }

  const filteredCoils = manufacturerFilter
  ? coils.filter((c) => c.manufacturer === manufacturerFilter)
  : coils;

  useEffect(() => {
    loadCoils();
  }, []);

  function normalize(s) {
  return (s || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^\w\u4e00-\u9fa5]/g, "");
}


  async function submit(e) {
    e.preventDefault();

    // 🔥 CHANGED: combine before sending
    const voltage =
      voltageValue !== "" ? `${voltageValue}${voltageType}` : "";

    const body = {
      type: ITEM_TYPES.COIL_INDEPENDENT,
      data: {
        coil_idp_model: coilModel,
        voltage,
        manufacturer,
        image_url: form.image_url,
      },
    };

    if (coilError) {
  alert("Coil Model 重复，无法提交");
  return;
}

    const res = await fetch("/api/coil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (result.success) {
      setCoilModel("");
      setVoltageValue("");
      setVoltageType("VAC");
      setManufacturer("");
      setForm({
        coil_idp_model: "",
        voltage: "",
        manufacturer: "",
        image_url: "",
      });

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
<div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50 relative">

  {/* BACKGROUND */}
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
            {dict.coilIndependentTitle}
          </h1>

          <p className="text-xs md:text-sm text-slate-500">
            {dict.coilIndependentDesc}
          </p>
        </div>

      </div>

    </header>

    {/* ================= GRID ================= */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

      {/* ================= FORM ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* FORM HEADER */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">

            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                {dict.createCoilTitle}
              </h2>

              <p className="text-xs text-slate-500">
                {dict.createCoilDesc}
              </p>
            </div>

          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-4 md:space-y-5">

            <input
              className="
                w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
                focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition
              "
              placeholder="Coil Model"
              value={coilModel}
              onChange={(e) => {
                const value = e.target.value;

                setCoilModel(value);

                const duplicate = coils?.some(
                  (c) => normalize(c.unique_key_active) === normalize(value)
                );

                setCoilError(duplicate ? "检测到重复 Coil Model" : "");
              }}
            />
            {coilError && (
              <p className="text-red-500 text-xs ">
                {coilError}
              </p>
            )}

            {/* responsive row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

              <input
                className="
                  px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
                  focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition
                "
                inputMode="numeric"
                placeholder={dict.voltageValue}
                value={voltageValue}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" ||
                    e.key === "Delete" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === "Tab"
                  ) return;

                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setVoltageValue(e.target.value)}
              />

              <select
                className="
                  px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
                  focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition
                "
                value={voltageType}
                onChange={(e) => setVoltageType(e.target.value)}
              >
                <option value="VAC">VAC</option>
                <option value="VDC">VDC</option>
              </select>

            </div>

            <select
              className="
                w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm
                focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition
              "
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            >
              <option value="">{dict.manufacturer}</option>
              <option value="JAKSA">JAKSA</option>
              <option value="CEME">CEME</option>
              <option value="ROTORK">ROTORK</option>
              <option value="GOETVALVE">GOETVALVE</option>
              <option value="SATURN">SATURN</option>
            </select>

            {/* IMAGE UPLOAD */}
            <div className="space-y-3">

              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50 cursor-pointer transition">

                <span className="text-sm font-medium text-slate-600">
                  Upload Image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file);
                  }}
                />
              </label>

              {uploading && (
                <p className="text-xs text-sky-500">Uploading...</p>
              )}

              {form.image_url && (
                <img
                  src={form.image_url}
                  className="w-24 h-24 object-cover rounded-xl border cursor-pointer"
                  onClick={() => setPreviewImg(form.image_url)}
                />
              )}

            </div>

            <button
              className="
                w-full py-3 md:py-4 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-sky-500 to-blue-600 text-white
                hover:from-sky-400 hover:to-blue-500
                active:scale-[0.98] transition
                shadow-lg shadow-sky-500/30
              "
            >
              {dict.createInpCoilButton}
            </button>

          </form>

        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 rounded-3xl" />

        <div className="relative rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/50 p-5 md:p-8">

          {/* LIST HEADER */}
          <div className="flex items-center justify-between mb-6 md:mb-8">

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500">
                <Boxes className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 text-sm md:text-base">
                  {dict.coilIndependentTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {dict.coilIndependentDesc}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">

              {/* 🟢 STATUS DOT */}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

              <span className="font-medium">
                {coils.length} {dict.coilListCount}
              </span>

            </div>

          </div>

            <ManufacturerFilter
              value={manufacturerFilter}
              onChange={setManufacturerFilter}
              manufacturers={["JAKSA", "CEME", "ROTORK", "GOETVALVE", "SATURN"]}
            />

          {/* LIST */}
          <div className="space-y-4 max-h-[65vh] md:max-h-[70vh] overflow-y-auto pr-1 md:pr-2">

          {filteredCoils.map((c) => (
            <div
              key={c.id}
              className="
                group relative rounded-2xl border-2 border-slate-100 bg-white
                p-4 md:p-6
                hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50
                transition
              "
            >

              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">

                {/* LEFT SIDE (DOT + TITLE) */}
                <div className="flex items-start gap-2">

                  {/* 🟢 ACTIVE DOT (same as product.js) */}
                  <span className="mt-2 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

                  <div>
                    <h3 className="font-bold text-base md:text-lg text-slate-900 group-hover:text-sky-700">
                      {c.unique_key_active}
                    </h3>

                    <p className="text-xs md:text-sm text-slate-500">
                      {c.manufacturer}
                    </p>
                  </div>

                </div>

                {/* IMAGE */}
                {c.image_url && (
                  <img
                    src={c.image_url}
                    onClick={() => setPreviewImg(c.image_url)}
                    className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                  />
                )}

                {/* DELETE */}
                {user.role === "admin" && (
                  <button
                    onClick={() =>
                      deleteCoil(c.id, ITEM_TYPES.COIL_INDEPENDENT)
                    }
                    className="
                      p-2 rounded-lg text-slate-400
                    opacity-0 group-hover:opacity-100
                    hover:bg-red-50 hover:text-red-500
                    transition-all duration-200
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </button>)}

              </div>

              {/* SPECS GRID (same visual language as Product.js) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* ⚡ VOLTAGE */}
                <div className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 text-sm">
                  ⚡ {dict.voltageValue}: <b>{c.voltage}</b>
                </div>

                {/* 📦 STOCK */}
                <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm">
                  📦 {dict.stock}: <b>{c.stock}</b>
                </div>

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
        className="mt-3 w-full py-2 text-sm rounded-lg bg-slate-900 text-white"
      >
        Close
      </button>
    </div>
  </div>
)}
</div>
);
}