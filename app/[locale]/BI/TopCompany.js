/* -----------------------------
   TOP COMPANY
----------------------------- */
export default function TopCompany() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-sky-600">
        Top Company
      </h2>
      <div className="mt-3 md:mt-4 space-y-2">
        {["Company A", "Company B", "Company C"].map((c) => (
          <div key={c} className="p-3 bg-white/70 border rounded-xl text-xs md:text-sm">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}