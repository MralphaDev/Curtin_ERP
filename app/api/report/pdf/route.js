import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

import { getValveBodyReport } from "@/lib/reports/buildManufacturerReport";
import { buildManufacturerReport } from "@/lib/reports/buildManufacturerReport";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "month";

    const rows = await getValveBodyReport(range);
    const report = buildManufacturerReport(rows);

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Load fonts
    const regularFontPath = path.join(process.cwd(), "public/fonts/NotoSansSC-Regular.ttf");
    const boldFontPath = path.join(process.cwd(), "public/fonts/NotoSansSC-Bold.ttf");
    
    const regularFontBytes = fs.readFileSync(regularFontPath);
    const boldFontBytes = fs.readFileSync(boldFontPath);
    
    const font = await pdfDoc.embedFont(regularFontBytes);
    const fontBold = await pdfDoc.embedFont(boldFontBytes);

    // ================= PROFESSIONAL COLOR PALETTE =================
    const COLORS = {
      // Primary brand colors
      navy: rgb(0.067, 0.094, 0.153),        // #111827 - Deep navy for headers
      slate: rgb(0.184, 0.212, 0.275),       // #2F3645 - Slate for text
      accent: rgb(0.047, 0.337, 0.533),      // #0C5686 - Professional blue accent
      accentLight: rgb(0.224, 0.506, 0.675), // #3981AC - Lighter accent
      
      // Backgrounds
      white: rgb(1, 1, 1),
      cream: rgb(0.992, 0.984, 0.973),       // #FDF9F8 - Warm white
      tableStripe: rgb(0.969, 0.976, 0.984), // #F7F9FB - Very light blue-gray
      headerBg: rgb(0.067, 0.094, 0.153),    // Navy header
      
      // Borders and lines
      border: rgb(0.878, 0.894, 0.914),      // #E0E4E9 - Subtle border
      divider: rgb(0.820, 0.843, 0.871),     // #D1D7DE - Divider lines
      
      // Status colors
      success: rgb(0.133, 0.545, 0.388),     // #228B63 - Green for positive
      muted: rgb(0.478, 0.522, 0.584),       // #7A8595 - Muted text
      
      // Text
      textPrimary: rgb(0.067, 0.094, 0.153), // Navy
      textSecondary: rgb(0.373, 0.408, 0.467), // #5F6877
      textLight: rgb(1, 1, 1),               // White
    };

    const PAGE_W = 595;
    const PAGE_H = 842;
    const MARGIN = 40;
    const CONTENT_W = PAGE_W - MARGIN * 2;

    let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;
    let pageNum = 1;

    // ================= HELPER FUNCTIONS =================
    
    // Truncate text to fit width
    const truncateText = (text, maxWidth, fontSize, usedFont) => {
      let str = String(text || "");
      while (usedFont.widthOfTextAtSize(str, fontSize) > maxWidth && str.length > 0) {
        str = str.slice(0, -1);
      }
      if (str.length < String(text || "").length && str.length > 3) {
        str = str.slice(0, -3) + "...";
      }
      return str;
    };

    // Draw page header with brand stripe
    const drawPageHeader = () => {
      // Top accent stripe
      page.drawRectangle({
        x: 0,
        y: PAGE_H - 8,
        width: PAGE_W,
        height: 8,
        color: COLORS.accent,
      });
      
      // Secondary thin line
      page.drawRectangle({
        x: 0,
        y: PAGE_H - 10,
        width: PAGE_W,
        height: 2,
        color: COLORS.navy,
      });
    };

    // Draw page footer
    const drawPageFooter = () => {
      const footerY = 30;
      
      // Footer line
      page.drawLine({
        start: { x: MARGIN, y: footerY + 15 },
        end: { x: PAGE_W - MARGIN, y: footerY + 15 },
        thickness: 0.5,
        color: COLORS.border,
      });
      
      // Company name
      page.drawText("VALVE BODY INVENTORY MANAGEMENT SYSTEM", {
        x: MARGIN,
        y: footerY,
        size: 7,
        font,
        color: COLORS.muted,
      });
      
      // Page number with styling
      const pageText = `Page ${pageNum}`;
      const pageTextWidth = font.widthOfTextAtSize(pageText, 8);
      page.drawText(pageText, {
        x: PAGE_W - MARGIN - pageTextWidth,
        y: footerY,
        size: 8,
        font: fontBold,
        color: COLORS.slate,
      });
      
      // Generated date
      const dateText = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const dateWidth = font.widthOfTextAtSize(dateText, 7);
      page.drawText(dateText, {
        x: (PAGE_W - dateWidth) / 2,
        y: footerY,
        size: 7,
        font,
        color: COLORS.muted,
      });
    };

    const newPage = () => {
      drawPageFooter();
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      pageNum++;
      y = PAGE_H - MARGIN - 20;
      drawPageHeader();
    };

    // ================= COVER PAGE =================
    
    // Full page navy header block
    page.drawRectangle({
      x: 0,
      y: PAGE_H - 280,
      width: PAGE_W,
      height: 280,
      color: COLORS.navy,
    });
    
    // Accent stripe at bottom of header
    page.drawRectangle({
      x: 0,
      y: PAGE_H - 284,
      width: PAGE_W,
      height: 4,
      color: COLORS.accent,
    });

    // Company logo placeholder (circle)
    /*const logoX = PAGE_W / 2;
    const logoY = PAGE_H - 80;
    page.drawCircle({
      x: logoX,
      y: logoY,
      size: 35,
      color: COLORS.accent,
    });
    page.drawCircle({
      x: logoX,
      y: logoY,
      size: 28,
      color: COLORS.navy,
    });
    
const text = "CURTIN AUTOMATION";
const size = 18;

const textWidth = fontBold.widthOfTextAtSize(text, size);

page.drawText(text, {
  x: (PAGE_W - textWidth) / 2, // 👈 perfectly centered
  y: logoY - 8,
  size,
  font: fontBold,
  color: COLORS.textLight,
});*/

    // Main title
    const title1 = "";
    const title2 = "INVENTORY REPORT";
    const title1Width = fontBold.widthOfTextAtSize(title1, 32);
    const title2Width = fontBold.widthOfTextAtSize(title2, 32);
    
    page.drawText(title1, {
      x: (PAGE_W - title1Width) / 2,
      y: PAGE_H,
      size: 32,
      font: fontBold,
      color: COLORS.textLight,
    });
    
    page.drawText(title2, {
      x: (PAGE_W - title2Width) / 2,
      y: PAGE_H - 150,
      size: 32,
      font: fontBold,
      color: COLORS.textLight,
    });

    // Subtitle
    const subtitle = "Curtin Automation Sales Performance Analysis";
    const subtitleWidth = font.widthOfTextAtSize(subtitle, 14);
    page.drawText(subtitle, {
      x: (PAGE_W - subtitleWidth) / 2,
      y: PAGE_H - 200,
      size: 14,
      font,
      color: COLORS.accentLight,
    });

    // Info cards section
    const cardY = PAGE_H - 380;
    const cardH = 70;
    const cardW = (CONTENT_W - 20) / 2;
    
    // Left card - Report Period
    page.drawRectangle({
      x: MARGIN,
      y: cardY,
      width: cardW,
      height: cardH,
      color: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 1,
    });
    
    // Card accent top
    page.drawRectangle({
      x: MARGIN,
      y: cardY + cardH - 4,
      width: cardW,
      height: 4,
      color: COLORS.accent,
    });
    
    page.drawText("REPORT PERIOD", {
      x: MARGIN + 15,
      y: cardY + cardH - 25,
      size: 8,
      font: fontBold,
      color: COLORS.muted,
    });
    
    const periodText = range.charAt(0).toUpperCase() + range.slice(1);
    page.drawText(periodText, {
      x: MARGIN + 15,
      y: cardY + 18,
      size: 20,
      font: fontBold,
      color: COLORS.navy,
    });

    // Right card - Generated Date
    page.drawRectangle({
      x: MARGIN + cardW + 20,
      y: cardY,
      width: cardW,
      height: cardH,
      color: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 1,
    });
    
    page.drawRectangle({
      x: MARGIN + cardW + 20,
      y: cardY + cardH - 4,
      width: cardW,
      height: 4,
      color: COLORS.success,
    });
    
    page.drawText("GENERATED", {
      x: MARGIN + cardW + 35,
      y: cardY + cardH - 25,
      size: 8,
      font: fontBold,
      color: COLORS.muted,
    });
    
    const genDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    page.drawText(genDate, {
      x: MARGIN + cardW + 35,
      y: cardY + 18,
      size: 14,
      font: fontBold,
      color: COLORS.navy,
    });

    // Summary stats row
    const statsY = cardY - 100;
    const totalProducts = report.reduce((acc, m) => acc + m.products.length, 0);
    const totalSales = report.reduce(
      (acc, m) => acc + m.products.reduce((a, p) => a + (p.total_sales || 0), 0),
      0
    );
    
    const stats = [
      { label: "MANUFACTURERS", value: report.length.toString() },
      { label: "PRODUCTS", value: totalProducts.toString() },
      { label: "TOTAL SALES", value: totalSales.toLocaleString() },
    ];
    
    const statW = CONTENT_W / 3;
    stats.forEach((stat, i) => {
      const statX = MARGIN + statW * i + statW / 2;
      
      // Value
      const valWidth = fontBold.widthOfTextAtSize(stat.value, 28);
      page.drawText(stat.value, {
        x: statX - valWidth / 2,
        y: statsY + 20,
        size: 28,
        font: fontBold,
        color: COLORS.accent,
      });
      
      // Label
      const labelWidth = font.widthOfTextAtSize(stat.label, 9);
      page.drawText(stat.label, {
        x: statX - labelWidth / 2,
        y: statsY,
        size: 9,
        font,
        color: COLORS.muted,
      });
      
      // Divider (except last)
      if (i < stats.length - 1) {
        page.drawLine({
          start: { x: MARGIN + statW * (i + 1), y: statsY - 5 },
          end: { x: MARGIN + statW * (i + 1), y: statsY + 55 },
          thickness: 1,
          color: COLORS.border,
        });
      }
    });

    // Footer on cover
    page.drawLine({
      start: { x: MARGIN, y: 60 },
      end: { x: PAGE_W - MARGIN, y: 60 },
      thickness: 0.5,
      color: COLORS.border,
    });
    
    page.drawText("CONFIDENTIAL - FOR INTERNAL USE ONLY", {
      x: MARGIN,
      y: 45,
      size: 8,
      font,
      color: COLORS.muted,
    });

    // ================= DATA PAGES =================
    
    const ROW_H = 24;
    const cols = [
      { title: "ID", w: 30 },
      { title: "Category", w: 75 },
      { title: "Model", w: 100 },
      { title: "Sales", w: 45 },
      { title: "Date", w: 65 },
      { title: "Companies", w: CONTENT_W - 30 - 75 - 100 - 45 - 65 },
    ];

    // Start new page for data
    newPage();

    // Section title
    page.drawText("DETAILED INVENTORY BREAKDOWN", {
      x: MARGIN,
      y,
      size: 16,
      font: fontBold,
      color: COLORS.navy,
    });
    y -= 8;
    
    // Underline
    page.drawRectangle({
      x: MARGIN,
      y,
      width: 180,
      height: 3,
      color: COLORS.accent,
    });
    y -= 30;

    // Draw table header
    const drawTableHeader = () => {
      if (y < 100) newPage();
      
      let x = MARGIN;
      
      // Header background
      page.drawRectangle({
        x: MARGIN,
        y: y - ROW_H,
        width: CONTENT_W,
        height: ROW_H,
        color: COLORS.navy,
      });

      cols.forEach((col, i) => {
        const headerText = truncateText(col.title, col.w - 10, 9, fontBold);
        page.drawText(headerText, {
          x: x + 8,
          y: y - 16,
          size: 9,
          font: fontBold,
          color: COLORS.textLight,
        });
        x += col.w;
      });

      y -= ROW_H;
    };

    // Draw data row
    const drawDataRow = (values, isShaded) => {
      if (y < 80) {
        newPage();
        drawTableHeader();
      }

      let x = MARGIN;

      // Row background
      if (isShaded) {
        page.drawRectangle({
          x: MARGIN,
          y: y - ROW_H,
          width: CONTENT_W,
          height: ROW_H,
          color: COLORS.tableStripe,
        });
      }

      // Bottom border
      page.drawLine({
        start: { x: MARGIN, y: y - ROW_H },
        end: { x: MARGIN + CONTENT_W, y: y - ROW_H },
        thickness: 0.5,
        color: COLORS.border,
      });

      values.forEach((val, i) => {
        const col = cols[i];
        const cellText = truncateText(val, col.w - 12, 8, font);
        
        // Special styling for Sales column (index 3)
        const textColor = i === 3 && Number(val) > 0 ? COLORS.success : COLORS.slate;
        const textFont = i === 3 ? fontBold : font;
        
        page.drawText(cellText, {
          x: x + 8,
          y: y - 16,
          size: 8,
          font: textFont,
          color: textColor,
        });
        x += col.w;
      });

      y -= ROW_H;
    };

    // ================= RENDER MANUFACTURERS =================
    
    for (const m of report) {
      // Check if we need a new page for manufacturer header
      if (y < 120) newPage();

      // Manufacturer section header
      page.drawRectangle({
        x: MARGIN,
        y: y - 28,
        width: CONTENT_W,
        height: 28,
        color: COLORS.cream,
        borderColor: COLORS.accent,
        borderWidth: 1,
      });
      
      // Left accent bar
      page.drawRectangle({
        x: MARGIN,
        y: y - 28,
        width: 4,
        height: 28,
        color: COLORS.accent,
      });

      page.drawText(m.manufacturer.toUpperCase(), {
        x: MARGIN + 15,
        y: y - 18,
        size: 11,
        font: fontBold,
        color: COLORS.navy,
      });

      // Product count badge
      const badgeText = `${m.products.length} Products`;
      const badgeWidth = font.widthOfTextAtSize(badgeText, 8) + 16;
      
      page.drawRectangle({
        x: PAGE_W - MARGIN - badgeWidth - 10,
        y: y - 22,
        width: badgeWidth,
        height: 16,
        color: COLORS.accent,
      });
      
      page.drawText(badgeText, {
        x: PAGE_W - MARGIN - badgeWidth - 2,
        y: y - 18,
        size: 8,
        font: fontBold,
        color: COLORS.textLight,
      });

      y -= 40;

      // Table header
      drawTableHeader();

      // Data rows
      let shade = false;
      for (const p of m.products) {
        // Time calculation (your original logic)
        const time =
          p.companies?.length > 0
            ? new Date(
                Math.min(
                  ...p.companies.flatMap((c) =>
                    c.dates.map((d) => new Date(d).getTime())
                  )
                )
              ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })
            : "-";

        const companies = p.companies
          .map((c) => `${c.company}(${c.qty})`)
          .join(", ");

        drawDataRow(
          [
            p.id,
            p.category,
            p.model_number,
            p.total_sales,
            time,
            companies,
          ],
          shade
        );

        shade = !shade;
      }

      y -= 25;
    }

    // Final page footer
    drawPageFooter();

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=valve-body-report-${range}.pdf`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}