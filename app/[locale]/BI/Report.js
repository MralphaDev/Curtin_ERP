"use client";

import { useEffect, useState } from "react";

export default function Report() {
  const [tab, setTab] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = ["month", "season", "year"];

  useEffect(() => {
    load();
  }, [tab]);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/report?range=${tab}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const downloadPDF = async () => {
    const res = await fetch(`/api/report/pdf?range=${tab}`);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}-report.pdf`;
    a.click();
  };

  return (
    <div className="p-4">

      <h2 className="text-lg font-bold text-sky-600">
        Inventory Report
      </h2>

      {/* tabs */}
      <div className="flex gap-2 mt-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 text-xs border rounded ${
              tab === t ? "bg-sky-500 text-white" : ""
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <button
        onClick={downloadPDF}
        className="mt-3 px-3 py-1 bg-black text-white text-xs rounded"
      >
        Download PDF
      </button>

      {/* TABLE */}
      <div className="mt-6 space-y-8">

        {data.map((m, i) => (
          <div key={i} className="border rounded p-3">

            <h3 className="font-bold mb-2">
              Manufacturer: {m.manufacturer}
            </h3>

            <table className="w-full text-xs border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-1">ID</th>
                  <th className="border p-1">Category</th>
                  <th className="border p-1">Model</th>
                  <th className="border p-1">Sales</th>
                  <th className="border p-1">Companies</th>
                </tr>
              </thead>

              <tbody>
                {m.products.map((p) => (
                  <tr key={p.id}>
                    <td className="border p-1">{p.id}</td>
                    <td className="border p-1">{p.category}</td>
                    <td className="border p-1">{p.model_number}</td>
                    <td className="border p-1">{p.total_sales}</td>
                    <td className="border p-1">
                      {p.companies.map((c, idx) => (
                        <div key={idx} className="mb-1">
                          <b>{c.company}</b> ({c.qty})<br />
                          <span className="text-[10px] text-gray-500">
                            {c.dates
                              .map((d) =>
                                new Date(d).toLocaleDateString()
                              )
                              .join(", ")}
                          </span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        ))}

      </div>
    </div>
  );
}