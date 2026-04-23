/* -----------------------------
   TOP PRODUCT
----------------------------- */
export default function TopProduct() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-sky-600">
        Top Products
      </h2>
      <div className="mt-3 md:mt-4 space-y-2">
        {["Product A", "Product B", "Product C"].map((p) => (
          <div key={p} className="p-3 bg-white/70 border rounded-xl text-xs md:text-sm">
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}