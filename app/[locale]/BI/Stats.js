/* -----------------------------
   STATISTICS
----------------------------- */
export default function Stats() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-sky-600">
        Statistics
      </h2>
      <div className="mt-3 md:mt-4 grid gap-2">
        <div className="p-3 bg-white/70 border rounded-xl text-xs md:text-sm">
          Total Stock: 1200
        </div>
        <div className="p-3 bg-white/70 border rounded-xl text-xs md:text-sm">
          Outflow Today: 80
        </div>
        <div className="p-3 bg-white/70 border rounded-xl text-xs md:text-sm">
          Active SKUs: 45
        </div>
      </div>
    </div>
  );
}