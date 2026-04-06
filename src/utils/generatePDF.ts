import { FontInput, PDF, PDFImage, rgb, StandardFonts } from "@libpdf/core";
import { Customer, Equipment } from "../types/customers.types";
import formatPhoneNumber from "../shared/utils/formatNumber";

// Configuración de constantes
// A4 size in points: 595.28 x 841.89
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const logoUrl = "/logo.png";

export async function createDeliveryForm(
  customer: Customer,
  equipment: Equipment[],
): Promise<Uint8Array> {
  const pdf = PDF.create();

  // Load logo
  let logo: PDFImage | undefined;
  try {
    const logoRes = await fetch(logoUrl);
    if (logoRes.ok) {
      const logoBytes = await logoRes.arrayBuffer();
      logo = pdf.embedPng(new Uint8Array(logoBytes));
    }
  } catch (e) {
    console.warn("Could not load logo", e);
  }

  const fontRegular = StandardFonts.Helvetica;
  const fontBold = StandardFonts.HelveticaBold;

  const page = pdf.addPage({ size: "a4" });

  const colorBlack = rgb(0, 0, 0);

  let yPos = PAGE_HEIGHT - MARGIN;

  // --- Helpers ---

  const drawText = (
    text: string,
    x: number,
    y: number,
    font: string,
    size: number,
    color = colorBlack,
  ) => {
    page.drawText(text, {
      x,
      y,
      font: font as FontInput,
      size,
      color,
    });
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness: 1,
      color: colorBlack,
    });
  };

  const drawRect = (x: number, y: number, width: number, height: number) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderColor: colorBlack,
      borderWidth: 1,
    });
  };

  const drawImages = (
    x: number,
    y: number,
    width: number,
    height: number,
    img: PDFImage,
  ) => {
    page.drawImage(img, {
      x,
      y,
      width,
      height,
    });
  };

  // Improved approximation for text width
  const measureTextWidth = (text: string, size: number, font: string) => {
    // Bold is wider. 0.65 factor for bold, 0.5 for regular is a better heuristic.
    const factor = font.includes("Bold") ? 0.65 : 0.5;
    return text.length * (size * factor);
  };

  const centerTextX = (text: string, size: number, font: string) => {
    const width = measureTextWidth(text, size, font);
    return (PAGE_WIDTH - width) / 2;
  };

  // --- CONTENIDO ---

  // Header text centered

  if (logo) {
    drawImages((PAGE_WIDTH - 50) / 2, yPos - 40, 50, 50, logo);
  }

  // Move text down to avoid overlap with logo
  yPos -= 60;

  const title1 = "AGUA & HIELO LILY, S.R.L.";
  // Manual offset +15 to correct visual centering heuristic for this specific large bold text
  drawText(title1, centerTextX(title1, 14, fontBold) + 15, yPos, fontBold, 14);

  yPos -= 15;
  const title2 = "R.N.C: 101-85657-2";
  drawText(title2, centerTextX(title2, 10, fontRegular), yPos, fontRegular, 10);

  yPos -= 15;
  const title3 = "FORMULARIO DE ENTREGA";
  drawText(title3, centerTextX(title3, 10, fontBold), yPos, fontBold, 10);

  // Fecha Actual
  const today = new Date();
  const dateStr = today.toLocaleDateString("es-DO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  drawText("Fecha:", PAGE_WIDTH - MARGIN - 100, yPos, fontBold, 10);
  drawText(
    dateStr,
    PAGE_WIDTH - MARGIN - 60,
    yPos,
    fontRegular,
    10,
    colorBlack,
  );
  drawLine(PAGE_WIDTH - MARGIN - 65, yPos - 2, PAGE_WIDTH - MARGIN, yPos - 2);

  yPos -= 25;

  // SECCIÓN 1: DATOS GENERALES
  drawRect(MARGIN, yPos - 12, CONTENT_WIDTH, 16);
  const sec1 = "DATOS GENERALES DEL NEGOCIO / RESIDENCIAL";
  drawText(
    sec1,
    (PAGE_WIDTH - measureTextWidth(sec1, 9, fontBold)) / 2,
    yPos - 8,
    fontBold,
    9,
  );

  yPos -= 30;

  // const category = customer.is_business ? "Negocio" : "Residencial";
  const name = customer.business_name || customer.name;
  const phone = customer.contact_phone
    ? formatPhoneNumber(customer.contact_phone)
    : "";
  const address = customer.address || "";
  const reference = customer.location_reference || "";

  // Fila 1
  drawText("Categoría:", MARGIN, yPos, fontBold, 10);
  // drawText(
  //   category.toUpperCase(),
  //   MARGIN + 60,
  //   yPos + 1,
  //   fontRegular,
  //   10,
  //   colorBlack,
  // );
  drawLine(MARGIN + 55, yPos - 2, MARGIN + 250, yPos - 2);

  yPos -= 20;

  // Fila 2
  drawText("Nombre:", MARGIN, yPos, fontBold, 10);
  drawText(
    name.toUpperCase(),
    MARGIN + 50,
    yPos + 1,
    fontRegular,
    10,
    colorBlack,
  );
  drawLine(MARGIN + 45, yPos - 2, MARGIN + 250, yPos - 2);

  drawText("Teléfonos:", MARGIN + 270, yPos, fontBold, 10);
  drawText(phone, MARGIN + 330, yPos + 1, fontRegular, 10, colorBlack);
  drawLine(MARGIN + 325, yPos - 2, PAGE_WIDTH - MARGIN, yPos - 2);

  yPos -= 20;
  drawText("Ubicación:", MARGIN, yPos, fontBold, 10);

  yPos -= 20;
  drawText("Calle:", MARGIN, yPos, fontBold, 10);

  // Truncate address if simple string to avoid overflow, or wrap (simple approach for now)
  const displayAddress =
    address.length > 50 ? address.substring(0, 47) + "..." : address;
  drawText(
    displayAddress.toUpperCase(),
    MARGIN + 40,
    yPos + 1,
    fontRegular,
    10,
    colorBlack,
  );
  drawLine(MARGIN + 35, yPos - 2, MARGIN + 300, yPos - 2);

  drawText("Número:", MARGIN + 310, yPos, fontBold, 10);
  drawLine(MARGIN + 355, yPos - 2, MARGIN + 400, yPos - 2);

  yPos -= 20;
  drawText("Urbanización/Barrio:", MARGIN, yPos, fontBold, 10);
  drawLine(MARGIN + 105, yPos - 2, MARGIN + 300, yPos - 2);

  drawText("Sector:", MARGIN + 310, yPos, fontBold, 10);
  drawLine(MARGIN + 350, yPos - 2, PAGE_WIDTH - MARGIN, yPos - 2);

  yPos -= 20;
  drawText("Municipio:", MARGIN, yPos, fontBold, 10);
  drawLine(MARGIN + 55, yPos - 2, MARGIN + 250, yPos - 2);

  drawText("Referencia:", MARGIN + 260, yPos, fontBold, 10);
  const displayRef =
    reference.length > 30 ? reference.substring(0, 27) + "..." : reference;
  drawText(
    displayRef.toUpperCase(),
    MARGIN + 320,
    yPos + 1,
    fontRegular,
    10,
    colorBlack,
  );
  drawLine(MARGIN + 320, yPos - 2, PAGE_WIDTH - MARGIN, yPos - 2);

  yPos -= 30;

  // SECCIÓN 2: DATOS QUIEN RECIBE (Empty)
  drawRect(MARGIN, yPos - 12, CONTENT_WIDTH, 16);
  const sec2 = "DATOS GENERALES DE QUIEN RECIBE";
  drawText(
    sec2,
    (PAGE_WIDTH - measureTextWidth(sec2, 9, fontBold)) / 2,
    yPos - 8,
    fontBold,
    9,
  );

  yPos -= 30;
  drawText("Nombre de quién recibe:", MARGIN, yPos, fontBold, 10);
  drawLine(MARGIN + 120, yPos - 2, PAGE_WIDTH - MARGIN - 50, yPos - 2);

  yPos -= 20;
  drawText("Cédula/Pasaporte:", MARGIN, yPos, fontBold, 10);
  drawLine(MARGIN + 90, yPos - 2, MARGIN + 250, yPos - 2);

  yPos -= 20;
  drawText("Número de Contacto:", MARGIN, yPos, fontBold, 10);
  drawLine(MARGIN + 100, yPos - 2, MARGIN + 250, yPos - 2);

  yPos -= 30;

  // SECCIÓN 3: TABLA DE EQUIPOS
  drawRect(MARGIN, yPos - 12, CONTENT_WIDTH, 16);
  const sec3 = "INSUMOS ENTREGADOS";
  drawText(
    sec3,
    (PAGE_WIDTH - measureTextWidth(sec3, 9, fontBold)) / 2,
    yPos - 8,
    fontBold,
    9,
  );

  yPos -= 12;

  const cols = [
    { name: "INSUMO", width: 80 },
    { name: "TIPO", width: 60 },
    { name: "CANTIDAD", width: 65 }, // Increased width to avoid text overlap
    { name: "COLOR", width: 50 },
    { name: "SERIAL EQUIPO", width: 120 },
    { name: "SERIAL COMPRESOR", width: 100 },
  ];

  const rowHeight = 20;

  const drawTableRow = (values: string[], isHeader = false) => {
    let x = MARGIN;
    values.forEach((val, i) => {
      let w = cols[i]?.width || 60;
      if (i === values.length - 1) {
        w = CONTENT_WIDTH + MARGIN - x;
      }

      drawRect(x, yPos, w, rowHeight);

      const textFont = isHeader ? fontBold : fontRegular;
      let displayVal = val;
      if (displayVal.length > 20 && !isHeader)
        displayVal = displayVal.substring(0, 18) + "..";

      // Ensure uppercase for values
      if (!isHeader) {
        displayVal = displayVal.toUpperCase();
      }

      page.drawText(displayVal, {
        x: x + 5,
        y: yPos + 6,
        font: textFont as FontInput,
        size: 9,
        color: colorBlack,
      });

      x += w;
    });
  };

  yPos -= rowHeight;
  drawTableRow(
    [
      "INSUMO",
      "TIPO",
      "CANTIDAD",
      "COLOR",
      "SERIAL EQUIPO",
      "SERIAL COMPRESOR",
    ],
    true,
  );

  equipment.forEach((item) => {
    yPos -= rowHeight;
    drawTableRow([
      item.type || "",
      item.description || "",
      "1",
      "",
      item.serial_number || "",
      "N/A",
    ]);
  });

  if (equipment.length < 3) {
    for (let i = 0; i < 3 - equipment.length; i++) {
      yPos -= rowHeight;
      drawTableRow(["", "", "", "", "", ""]);
    }
  }

  yPos -= 40;

  // CERTIFICACIÓN
  const startCertText1 =
    "YO ____________________________________________________________________ CERTIFICO Y DOY FE";
  const startCertText2 =
    "DE QUE ME HA(N) SIDO ENTREGADO(S) EL (LOS) INSUMOS MENCIONADOS ANTERIORMENTE EN";
  const startCertText3 =
    "PERFECTO ESTADO POR PARTE DE AGUA & HIELO LILY, S.R.L.";

  drawText(startCertText1, MARGIN, yPos, fontRegular, 8);
  yPos -= 12;
  drawText(startCertText2, MARGIN, yPos, fontRegular, 8);
  yPos -= 12;
  drawText(startCertText3, MARGIN, yPos, fontRegular, 8);

  yPos -= 60;

  // FIRMAS
  const colWidth = CONTENT_WIDTH / 2;

  // Izquierda
  drawText(
    "Entregado por (Agua & Hielo Lily, S.R.L):",
    MARGIN,
    yPos,
    fontBold,
    9,
  );
  yPos -= 30;
  drawText("Nombre:", MARGIN, yPos, fontBold, 9);
  drawLine(MARGIN + 40, yPos - 2, MARGIN + 200, yPos - 2);
  yPos -= 20;
  drawText("Cédula:", MARGIN, yPos, fontBold, 9);
  drawLine(MARGIN + 40, yPos - 2, MARGIN + 200, yPos - 2);
  yPos -= 30;
  drawLine(MARGIN + 40, yPos - 2, MARGIN + 200, yPos - 2);
  drawText("Firma", MARGIN + 100, yPos - 10, fontBold, 8);

  // Derecha
  let yRight = yPos + 80;
  drawText("Recibido por:", MARGIN + colWidth + 50, yRight, fontBold, 9);
  yRight -= 30;

  drawText("Nombre:", MARGIN + colWidth, yRight, fontBold, 9);
  drawLine(MARGIN + colWidth + 40, yRight - 2, PAGE_WIDTH - MARGIN, yRight - 2);

  yRight -= 20;
  drawText("Cédula:", MARGIN + colWidth, yRight, fontBold, 9);
  drawLine(MARGIN + colWidth + 40, yRight - 2, PAGE_WIDTH - MARGIN, yRight - 2);

  yRight -= 30;

  const lineStart = MARGIN + colWidth + 40;
  const lineEnd = PAGE_WIDTH - MARGIN;
  const lineCenter = lineStart + (lineEnd - lineStart) / 2;

  drawLine(lineStart, yRight - 2, lineEnd, yRight - 2);

  const firmaText = "Firma";
  drawText(firmaText, lineCenter - 15, yRight - 10, fontBold, 8);

  // Footer
  yPos -= 40;
  drawText(
    "Nota: Anexar fotocopia de la cédula de quien reciba y firme el formulario.",
    MARGIN,
    yPos,
    fontBold,
    8,
  );
  yPos -= 12;
  drawText(
    "Original: Departamento de Despacho & Distribución",
    MARGIN,
    yPos,
    fontBold,
    8,
  );
  yPos -= 12;
  drawText("Duplicado: Cliente", MARGIN, yPos, fontBold, 8);

  console.log("PDF generado.");
  return await pdf.save();
}

export const handlePreview = async (
  customer: Customer,
  equipment: Equipment[],
) => {
  try {
    const pdfBytes = await createDeliveryForm(customer, equipment);
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
};

export const savePDFWithTauri = async (
  customer: Customer,
  equipment: Equipment[],
) => {
  try {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeFile } = await import("@tauri-apps/plugin-fs");
    const { open: openPath } = await import("@tauri-apps/plugin-shell");

    const pdfBytes = await createDeliveryForm(customer, equipment);

    const filePath = await save({
      defaultPath: "formulario-entrega.pdf",
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });

    if (!filePath) return null;

    await writeFile(filePath, new Uint8Array(pdfBytes));

    const shouldOpen = window.confirm(
      "PDF guardado correctamente. ¿Desea abrirlo?",
    );
    if (shouldOpen) {
      await openPath(filePath);
    }

    return filePath;
  } catch (error) {
    console.error("Error guardando PDF con Tauri:", error);
    throw error;
  }
};

export const printPDFWithTauri = async (
  customer: Customer,
  equipment: Equipment[],
) => {
  try {
    const { writeFile, mkdir } = await import("@tauri-apps/plugin-fs");
    const { appCacheDir } = await import("@tauri-apps/api/path");
    const { Command } = await import("@tauri-apps/plugin-shell");

    const pdfBytes = await createDeliveryForm(customer, equipment);
    const cacheDirPath = await appCacheDir();
    await mkdir(cacheDirPath, { recursive: true });

    const tempFileName = `print-${Date.now()}.pdf`;
    const fullPath = `${cacheDirPath}${cacheDirPath.endsWith("/") || cacheDirPath.endsWith("\\\\") ? "" : "/"}${tempFileName}`;

    await writeFile(fullPath, new Uint8Array(pdfBytes));
    console.log("PDF guardado temporalmente en:", fullPath);

    const platform = navigator.platform.toLowerCase();

    if (platform.includes("win")) {
      await Command.create("cmd", [
        "/c",
        "start",
        "/min",
        "",
        fullPath,
      ]).execute();
    } else if (platform.includes("mac")) {
      await Command.create("open", ["-a", "Preview", fullPath]).execute();
    } else {
      try {
        await Command.create("lp", [fullPath]).execute();
      } catch {
        await Command.create("xdg-open", [fullPath]).execute();
      }
    }
  } catch (error) {
    console.error("Error imprimiendo PDF con Tauri:", error);
    throw error;
  }
};

export const previewPDFWithTauri = async (
  customer: Customer,
  equipment: Equipment[],
) => {
  try {
    const { writeFile, mkdir } = await import("@tauri-apps/plugin-fs");
    const { appCacheDir } = await import("@tauri-apps/api/path");
    const { open: openPath } = await import("@tauri-apps/plugin-shell");

    const pdfBytes = await createDeliveryForm(customer, equipment);
    const cacheDirPath = await appCacheDir();
    await mkdir(cacheDirPath, { recursive: true });

    const tempFileName = `preview-${Date.now()}.pdf`;
    const fullPath = `${cacheDirPath}${cacheDirPath.endsWith("/") || cacheDirPath.endsWith("\\\\") ? "" : "/"}${tempFileName}`;

    await writeFile(fullPath, new Uint8Array(pdfBytes));
    await openPath(fullPath);
  } catch (error) {
    console.error("Error previsualizando PDF con Tauri:", error);
    throw error;
  }
};
