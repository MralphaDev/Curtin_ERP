"use client";

export default function ManufacturerFilter({
  value,
  onChange,
  manufacturers,
}) {
  const btn = (active) =>
    `px-2.5 py-1 rounded-full text-[11px] border transition ${
      active
        ? "bg-sky-500 text-white border-sky-500"
        : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"
    }`;

  return (
    <div className="flex gap-1.5 flex-wrap mb-3">
      <button onClick={() => onChange("")} className={btn(value === "")}>
        All
      </button>

      {manufacturers.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={btn(value === m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}