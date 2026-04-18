"use client";

import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import ProductsPage from "@/app/[locale]/products/page";
import NewInventory from "../inventory/page";
import CoilStandardPage from "../coil_standard/page"
import CoilIndependentPage from "../coil_independent/page"

export default function Dashboard() {
  // 🌍 get full path like "/en/dashboard"
  const pathname = usePathname();

  // 🧠 extract locale (en / zh)
  const locale = pathname.split("/")[1];

  // 📦 load correct language dictionary
  const dict = getDictionary(locale);

  return (
    <div className="p-6">

      {/* 📊 translated title */}
      <h1>{dict.dashboard}</h1>
      <ProductsPage />
      <CoilStandardPage />
      <CoilIndependentPage />
      <NewInventory />


    </div>
  );
}