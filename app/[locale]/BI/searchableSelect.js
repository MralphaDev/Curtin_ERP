"use client";

import { useState, useEffect } from "react";

export default function SearchableSelect({
  list = [],
  value,
  setValue,
  placeholder = "Select...",
  getLabel,
  getValue
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // sync selected value → input display
  useEffect(() => {
    if (!value) return;

    const item = list.find((i) => getValue(i) === value);
    if (item) setQuery(getLabel(item));
  }, [value, list]);

  const filtered = list
    .filter((item) =>
      getLabel(item).toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 50);

  return (
    <div className="relative w-full">
      <input
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full border p-2 rounded-lg"
      />

      {open && (
        <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={getValue(item)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  const val = getValue(item);
                  setValue(val);
                  setQuery(getLabel(item));
                  setOpen(false);
                }}
              >
                {getLabel(item)}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}