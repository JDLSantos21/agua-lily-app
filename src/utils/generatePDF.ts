import { FontInput, PDF, PDFImage, rgb, StandardFonts } from "@libpdf/core";

// Configuración de constantes
const PAGE_WIDTH = 612; // Letter
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const logoUrl = "/logo.png";

export async function createDeliveryForm(): Promise<Uint8Array> {
  // 1. Crear documento
  const pdf = PDF.create();

  const logoRes = await fetch(logoUrl);
  const logoBytes = await logoRes.arrayBuffer();
  const logo = pdf.embedPng(new Uint8Array(logoBytes));
  // 2. Definir las fuentes DIRECTAMENTE como strings
  // No usamos await ni embed, solo asignamos el nombre
  const fontRegular = StandardFonts.Helvetica;
  const fontBold = StandardFonts.HelveticaBold;

  // 3. Añadir página
  const page = pdf.addPage({ size: "letter" });

  // Colores
  const colorBlack = rgb(0, 0, 0);
  const colorBlue = rgb(0, 0, 0.6); // Para datos simulados

  // Cursor Y
  let yPos = PAGE_HEIGHT - MARGIN;

  // --- Helpers ---

  // Nota: 'font' ahora recibe un string
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
      font: font as FontInput, // Pasamos el string "Helvetica" directamente
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
    logo: PDFImage,
  ) => {
    page.drawImage(logo, {
      x,
      y,
      width,
      height,
    });
  };

  // --- CONTENIDO ---

  // HEADER
  // drawRect(MARGIN, yPos - 40, 40, 40); // Logo box
  // agregar logo
  drawImages(MARGIN + 65, yPos - 38, 50, 50, logo);

  drawText("AGUA & HIELO LILY, S.R.L.", MARGIN + 120, yPos, fontBold, 14);
  yPos -= 15;
  drawText("R.N.C: 101-85657-2", MARGIN + 160, yPos, fontRegular, 10);
  yPos -= 15;
  drawText("FORMULARIO DE ENTREGA", MARGIN + 150, yPos, fontBold, 10);

  // Fecha
  drawText("Fecha:", PAGE_WIDTH - MARGIN - 100, yPos, fontBold, 10);
  drawLine(PAGE_WIDTH - MARGIN - 60, yPos, PAGE_WIDTH - MARGIN, yPos);

  yPos -= 30;

  // SECCIÓN 1: DATOS GENERALES
  drawRect(MARGIN, yPos - 12, CONTENT_WIDTH, 16);
  drawText(
    "DATOS GENERALES DEL NEGOCIO / RESIDENCIAL",
    MARGIN + 110,
    yPos - 8,
    fontBold,
    9,
  );

  yPos -= 30;

  // Fila 1
  drawText("Categoría:", MARGIN, yPos, fontBold, 10);
  drawText(
    "Taller de Mecanica",
    MARGIN + 60,
    yPos + 1,
    fontRegular,
    10,
    colorBlue,
  );
  drawLine(MARGIN + 55, yPos, MARGIN + 250, yPos);

  yPos -= 20;

  // Fila 2
  drawText("Nombre:", MARGIN, yPos, fontBold, 10);
  drawText(
    "Multi Servicios y Repuestos",
    MARGIN + 50,
    yPos + 1,
    fontRegular,
    10,
    colorBlue,
  );
  drawLine(MARGIN + 45, yPos, MARGIN + 250, yPos);

  drawText("Teléfonos:", MARGIN + 270, yPos, fontBold, 10);
  drawText("849-620-2138", MARGIN + 330, yPos + 1, fontRegular, 10, colorBlue);
  drawLine(MARGIN + 325, yPos, PAGE_WIDTH - MARGIN, yPos);

  yPos -= 20;
  drawText("Ubicación:", MARGIN, yPos, fontBold, 10);

  yPos -= 20;
  drawText("Calle:", MARGIN, yPos, fontBold, 10);
  drawText(
    "Vicini Perdomo #35",
    MARGIN + 40,
    yPos + 1,
    fontRegular,
    10,
    colorBlue,
  );
  drawLine(MARGIN + 35, yPos, MARGIN + 300, yPos);

  drawText("Número:", MARGIN + 310, yPos, fontBold, 10);
  drawText("35", MARGIN + 360, yPos + 1, fontRegular, 10, colorBlue);
  drawLine(MARGIN + 355, yPos, MARGIN + 400, yPos);

  yPos -= 20;
  drawText("Urbanización/Barrio:", MARGIN, yPos, fontBold, 10);
  drawText(
    "Villa Consuelo",
    MARGIN + 110,
    yPos + 1,
    fontRegular,
    10,
    colorBlue,
  );
  drawLine(MARGIN + 105, yPos, MARGIN + 300, yPos);

  drawText("Sector:", MARGIN + 310, yPos, fontBold, 10);
  drawLine(MARGIN + 350, yPos, PAGE_WIDTH - MARGIN, yPos);

  yPos -= 20;
  drawText("Municipio:", MARGIN, yPos, fontBold, 10);
  drawLine(MARGIN + 55, yPos, MARGIN + 250, yPos);

  drawText("Referencia:", MARGIN + 260, yPos, fontBold, 10);
  drawLine(MARGIN + 320, yPos, PAGE_WIDTH - MARGIN, yPos);

  yPos -= 30;

  // SECCIÓN 2: DATOS QUIEN RECIBE
  drawRect(MARGIN, yPos - 12, CONTENT_WIDTH, 16);
  drawText(
    "DATOS GENERALES DE QUIEN RECIBE",
    MARGIN + 130,
    yPos - 8,
    fontBold,
    9,
  );

  yPos -= 30;
  drawText("Nombre de quién recibe:", MARGIN, yPos, fontBold, 10);
  // drawLine(MARGIN + 120, yPos, PAGE_WIDTH - MARGIN - 50, yPos);
  // drawText(
  //   "Zachary Beitre",
  //   MARGIN + 125,
  //   yPos + 1,
  //   fontRegular,
  //   12,
  //   colorBlue,
  // );
  drawLine(MARGIN + 120, yPos, PAGE_WIDTH - MARGIN - 50, yPos);

  yPos -= 20;
  drawText("Cédula/Pasaporte:", MARGIN, yPos, fontBold, 10);
  // drawText("402-4048918-3", MARGIN + 95, yPos + 1, fontRegular, 10, colorBlue);
  drawLine(MARGIN + 90, yPos, MARGIN + 250, yPos);

  yPos -= 20;
  drawText("Número de Contacto:", MARGIN, yPos, fontBold, 10);
  // drawText("829-502-4205", MARGIN + 105, yPos + 1, fontRegular, 10, colorBlue);
  drawLine(MARGIN + 100, yPos, MARGIN + 250, yPos);

  yPos -= 30;

  // SECCIÓN 3: TABLA
  drawRect(MARGIN, yPos - 12, CONTENT_WIDTH, 16);
  drawText("INSUMOS ENTREGADOS", MARGIN + 180, yPos - 8, fontBold, 9);

  yPos -= 12;

  const cols = [
    { name: "INSUMO", width: 60 },
    { name: "TIPO", width: 40 },
    { name: "CANTIDAD", width: 60 },
    { name: "COLOR", width: 60 },
    { name: "SERIAL EQUIPO", width: 100 },
    { name: "SERIAL COMPRESOR", width: 100 },
  ];

  const rowHeight = 20;

  const drawTableRow = (values: string[], isHeader = false) => {
    let x = MARGIN;
    values.forEach((val, i) => {
      const w =
        i === cols.length - 1 ? CONTENT_WIDTH - (x - MARGIN) : cols[i].width;
      drawRect(x, yPos, w, rowHeight);

      const textFont = isHeader ? fontBold : fontRegular;
      const textColor = isHeader
        ? colorBlack
        : val === "N/A" || val === ""
          ? colorBlack
          : colorBlue;

      drawText(val, x + 5, yPos + 6, textFont, 9, textColor);
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

  yPos -= rowHeight;
  drawTableRow(["Anaquel", "1", "50", "verde", "", "N/A"]);

  yPos -= rowHeight;
  drawTableRow(["Botellón", "N/A", "", "N/A", "N/A", "N/A"]);

  yPos -= rowHeight;
  drawTableRow(["Nevera", "", "", "", "", ""]);

  yPos -= 40;

  // CERTIFICACIÓN
  drawText(
    "YO Zachary Beitre CERTIFICO Y DOY FE DE QUE ME HA(N) SIDO ENTREGADO(S) EL",
    MARGIN,
    yPos,
    fontRegular,
    8,
  );
  drawText(
    "(Script sobrepuesto)",
    MARGIN + 15,
    yPos + 5,
    fontRegular,
    6,
    colorBlue,
  );

  yPos -= 12;
  drawText(
    "(LOS) INSUMOS MENCIONADOS ANTERIORMENTE EN PERFECTO ESTADO POR PARTE DE AGUA & HIELO",
    MARGIN,
    yPos,
    fontRegular,
    8,
  );
  yPos -= 12;
  drawText("LILY, S.R.L.", MARGIN, yPos, fontRegular, 8);

  yPos -= 50;

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
  drawLine(MARGIN + 40, yPos, MARGIN + 200, yPos);
  yPos -= 20;
  drawText("Cédula:", MARGIN, yPos, fontBold, 9);
  drawLine(MARGIN + 40, yPos, MARGIN + 200, yPos);
  yPos -= 30;
  drawLine(MARGIN + 40, yPos, MARGIN + 200, yPos);
  drawText("Firma", MARGIN + 100, yPos - 10, fontBold, 8);

  // Derecha
  let yRight = yPos + 80;
  drawText("Recibido por:", MARGIN + colWidth + 50, yRight, fontBold, 9);
  yRight -= 30;

  drawText("Nombre:", MARGIN + colWidth, yRight, fontBold, 9);
  drawText(
    "Zachary Beitre",
    MARGIN + colWidth + 45,
    yRight + 1,
    fontRegular,
    10,
    colorBlue,
  );
  drawLine(MARGIN + colWidth + 40, yRight, PAGE_WIDTH - MARGIN, yRight);

  yRight -= 20;
  drawText("Cédula:", MARGIN + colWidth, yRight, fontBold, 9);
  drawText(
    "402-4048918-3",
    MARGIN + colWidth + 40,
    yRight + 1,
    fontRegular,
    10,
    colorBlue,
  );
  drawLine(MARGIN + colWidth + 40, yRight, PAGE_WIDTH - MARGIN, yRight);

  yRight -= 30;
  drawLine(MARGIN + colWidth + 40, yRight, PAGE_WIDTH - MARGIN, yRight);
  drawText(
    "Zachary Beitre",
    MARGIN + colWidth + 50,
    yRight + 5,
    fontRegular,
    14,
    colorBlue,
  );
  drawText("Firma", MARGIN + colWidth + 100, yRight - 10, fontBold, 8);

  // Footer
  yPos -= 30;
  drawText(
    "Nota: Anexar fotocopia de la cédula de quien reciba y firme el formulario.",
    MARGIN,
    yPos,
    fontBold,
    8,
  );
  yPos -= 12;
  drawText("Original: Departamento de Servicio", MARGIN, yPos, fontBold, 8);
  yPos -= 12;
  drawText("Duplicado: Cliente", MARGIN, yPos, fontBold, 8);

  console.log("PDF generado.");
  return await pdf.save();
}

export const handlePreview = async () => {
  try {
    // 1. Generar los bytes
    const pdfBytes = await createDeliveryForm();

    // 2. Crear un Blob (Objeto binario en memoria)
    // Convertir Uint8Array a buffer regular
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    // 3. Crear una URL temporal
    const url = URL.createObjectURL(blob);

    // 4. Abrir en nueva ventana (o usar un iframe)
    window.open(url, "_blank");

    // Opcional: Liberar memoria después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
};

export const savePDFWithTauri = async () => {
  try {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeFile } = await import("@tauri-apps/plugin-fs");
    const { open: openPath } = await import("@tauri-apps/plugin-shell");

    // Generar PDF
    const pdfBytes = await createDeliveryForm();

    // Diálogo para guardar archivo
    const filePath = await save({
      defaultPath: "formulario-entrega.pdf",
      filters: [
        {
          name: "PDF",
          extensions: ["pdf"],
        },
      ],
    });

    if (!filePath) {
      console.log("Usuario canceló el guardado");
      return null;
    }

    // Guardar archivo
    await writeFile(filePath, new Uint8Array(pdfBytes));

    console.log(`PDF guardado en: ${filePath}`);

    // Preguntar si quiere abrir
    const shouldOpen = confirm("PDF guardado correctamente. ¿Desea abrirlo?");
    if (shouldOpen) {
      await openPath(filePath);
    }

    return filePath;
  } catch (error) {
    console.error("Error guardando PDF con Tauri:", error);
    throw error;
  }
};

export const previewPDFWithTauri = async () => {
  try {
    const { writeFile, mkdir } = await import("@tauri-apps/plugin-fs");
    const { appCacheDir } = await import("@tauri-apps/api/path");
    const { open: openPath } = await import("@tauri-apps/plugin-shell");

    // Generar PDF
    const pdfBytes = await createDeliveryForm();

    // Usar appCacheDir en lugar de temp (tiene permisos)
    const cacheDirPath = await appCacheDir();

    // Asegurar que el directorio existe
    await mkdir(cacheDirPath, { recursive: true });

    const tempFileName = `preview-${Date.now()}.pdf`;
    const fullPath = `${cacheDirPath}${cacheDirPath.endsWith("/") || cacheDirPath.endsWith("\\\\") ? "" : "/"}${tempFileName}`;

    // Guardar en cache de la app (ubicación permitida)
    await writeFile(fullPath, new Uint8Array(pdfBytes));

    // Abrir con el visor predeterminado
    await openPath(fullPath);

    console.log("PDF abierto para previsualización:", fullPath);
  } catch (error) {
    console.error("Error previsualizando PDF con Tauri:", error);
    throw error;
  }
};

export const printPDFWithTauri = async () => {
  try {
    const { writeFile, mkdir } = await import("@tauri-apps/plugin-fs");
    const { appCacheDir } = await import("@tauri-apps/api/path");
    const { Command } = await import("@tauri-apps/plugin-shell");

    // Generar PDF
    const pdfBytes = await createDeliveryForm();

    // Usar appCacheDir en lugar de temp (tiene permisos)
    const cacheDirPath = await appCacheDir();

    // Asegurar que el directorio existe
    await mkdir(cacheDirPath, { recursive: true });

    const tempFileName = `print-${Date.now()}.pdf`;
    const fullPath = `${cacheDirPath}${cacheDirPath.endsWith("/") || cacheDirPath.endsWith("\\\\") ? "" : "/"}${tempFileName}`;

    // Guardar en cache de la app (ubicación permitida)
    await writeFile(fullPath, new Uint8Array(pdfBytes));

    console.log("PDF guardado temporalmente en:", fullPath);

    // Detectar sistema operativo y abrir diálogo de impresión
    const platform = navigator.platform.toLowerCase();

    if (platform.includes("win")) {
      // Windows: usar comando para abrir con diálogo de impresión
      await Command.create("cmd", [
        "/c",
        "start",
        "/min",
        "",
        fullPath,
      ]).execute();
    } else if (platform.includes("mac")) {
      // macOS: usar lpr o abrir con Preview
      await Command.create("open", ["-a", "Preview", fullPath]).execute();
    } else {
      // Linux: usar lp o xdg-open
      try {
        await Command.create("lp", [fullPath]).execute();
      } catch {
        // Si lp no está disponible, abrir con visor predeterminado
        await Command.create("xdg-open", [fullPath]).execute();
      }
    }

    console.log("Comando de impresión ejecutado");
  } catch (error) {
    console.error("Error imprimiendo PDF con Tauri:", error);
    throw error;
  }
};
