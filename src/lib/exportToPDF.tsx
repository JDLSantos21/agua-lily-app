// lib/exportToPDF.ts
import { InventoryMovement } from "@/types/inventory";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { format } from "@formkit/tempo";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { open } from "@tauri-apps/plugin-shell";
import { FormatReportData } from "@/utils/FormatReportData";

// Definir estilos para el PDF
// Definir las props del componente InventoryReport
interface InventoryReportProps {
  data: InventoryMovement[];
  date: string;
}

// Definir estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  leftColumn: {
    width: "50%",
  },
  rightColumn: {
    width: "50%",
    alignItems: "flex-end",
  },
  headerGenericData: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  logoTitleContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    width: 75,
    height: 75,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A3C34",
    textAlign: "left",
  },
  infoText: {
    fontSize: 10,
    color: "#555",
    marginBottom: 4,
  },
  table: {
    border: "1 solid #E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderBottom: "1 solid #E0E0E0",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E0E0E0",
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 10,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  material: {
    width: "30%",
  },
  quantity: {
    width: "10%",
  },
  type: {
    textTransform: "capitalize",
    width: "15%",
  },
  time: {
    width: "15%",
  },
  user: {
    width: "30%",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#555",
  },
  totalsTable: {
    marginTop: 20,
    border: "1 solid #E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  totalsHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderBottom: "1 solid #E0E0E0",
    paddingVertical: 8,
  },
  totalsRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E0E0E0",
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  totalsCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  totalsCell: {
    fontSize: 10,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  totalsMaterial: {
    width: "50%",
  },
  totalsQuantity: {
    width: "50%",
  },
});

// Definir las props del componente InventoryReport
// Definir las props del componente InventoryReport
interface InventoryReportProps {
  data: InventoryMovement[];
  date: string;
  userName: string | null; // Nombre del usuario
  reportNumber: string; // Número de reporte
  reportType: "user" | "day"; // Tipo de reporte
}

export const InventoryReport: React.FC<InventoryReportProps> = ({
  data,
  date,
  userName,
  reportNumber,
  reportType,
}) => {
  // Definir cuántos registros por página
  const recordsPerPage = 20;
  const totalPages = Math.ceil(data.length / recordsPerPage);

  // Dividir los datos en páginas
  const pages = [];
  for (let i = 0; i < data.length; i += recordsPerPage) {
    pages.push(data.slice(i, i + recordsPerPage));
  }

  // Calcular los totales por material
  const totals: { [material: string]: number } = {};
  data.forEach((item) => {
    const material = item.material_name;
    const quantity = parseInt(item.quantity, 10) || 0; // Convertir a número
    if (totals[material]) {
      totals[material] += quantity;
    } else {
      totals[material] = quantity;
    }
  });

  // Convertir los totales a un array para mostrarlos en la tabla
  const totalsArray = Object.entries(totals).map(([material, quantity]) => ({
    material,
    quantity: quantity.toString(),
  }));

  // Obtener la fecha actual
  const currentDate = format(new Date(), { date: "long", time: "short" });

  return (
    <Document>
      {pages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Mostrar información solo en la primera página */}
          {pageIndex === 0 && (
            <View style={styles.headerContainer}>
              {/* Columna izquierda: Logo y título */}
              <View style={styles.leftColumn}>
                <View style={styles.logoTitleContainer}>
                  <View style={styles.logoContainer}>
                    <Image
                      style={styles.logo}
                      src="/logo.png" // Reemplaza con la URL o ruta de tu logo
                    />
                  </View>
                  <Text style={styles.title}>Reporte de Inventario</Text>
                </View>
              </View>
              {/* Columna derecha: Información */}
              <View style={styles.rightColumn}>
                <View style={styles.headerGenericData}>
                  <Text style={styles.infoText}>
                    Reporte No.: #{reportNumber}
                  </Text>
                  <Text style={styles.infoText}>{currentDate}</Text>
                </View>

                <Text style={styles.infoText}>
                  {format(date, { date: "long" })}
                </Text>
                <Text style={styles.infoText}>
                  {reportType === "user"
                    ? "Reporte por usuario"
                    : "Reporte Diario"}
                </Text>
                {reportType === "user" && userName && (
                  <Text style={styles.infoText}>{userName}</Text>
                )}
              </View>
            </View>
          )}

          {/* Tabla de datos */}
          <View style={styles.table}>
            {/* Encabezado de la tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, styles.material]}>
                Material
              </Text>
              <Text style={[styles.tableCellHeader, styles.quantity]}>
                Cantidad
              </Text>
              <Text style={[styles.tableCellHeader, styles.type]}>Tipo</Text>
              <Text style={[styles.tableCellHeader, styles.time]}>Hora</Text>
              <Text style={[styles.tableCellHeader, styles.user]}>Usuario</Text>
            </View>

            {/* Filas de datos */}
            {pageData.map((item) => {
              const formattedDate = format(new Date(item.created_at), {
                time: "short",
              });
              return (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.material]}>
                    {item.material_name}
                  </Text>
                  <Text style={[styles.tableCell, styles.quantity]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.type]}>
                    {item.type}
                  </Text>
                  <Text style={[styles.tableCell, styles.time]}>
                    {formattedDate}
                  </Text>
                  <Text style={[styles.tableCell, styles.user]}>
                    {item.user}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Mostrar los totales solo en la última página */}
          {pageIndex === totalPages - 1 && (
            <View style={styles.totalsTable}>
              <View style={styles.totalsHeader}>
                <Text style={[styles.totalsCellHeader, styles.totalsMaterial]}>
                  Material
                </Text>
                <Text style={[styles.totalsCellHeader, styles.totalsQuantity]}>
                  Total
                </Text>
              </View>
              {totalsArray.map((total, index) => (
                <View key={index} style={styles.totalsRow}>
                  <Text style={[styles.totalsCell, styles.totalsMaterial]}>
                    {total.material}
                  </Text>
                  <Text style={[styles.totalsCell, styles.totalsQuantity]}>
                    {total.quantity}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Número de página */}
          <Text style={styles.pageNumber} fixed>
            Página {pageIndex + 1} de {totalPages}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

// // Función para filtrar datos y preparar el título
// export const preparePDFData = (
//   inventoryRecords: InventoryMovement[] | null,
//   reportType?: "user" | "day",
//   selectedUser?: string,
//   selectedDate?: string
// ) => {
//   if (!inventoryRecords || inventoryRecords.length === 0) {
//     toast.error("No hay datos para exportar");
//     return { filteredData: null, title: "", dateStr: "", defaultFilename: "" };
//   }

//   let filteredData = inventoryRecords;
//   let title = "";

//   const dateStr = selectedDate || format(new Date(), "YYYY-MM-DD");

//   const defaultFilename = `INV_${
//     reportType === "user" ? selectedUser?.replace(/\s/g, "_") : "DIA"
//   }_${format(new Date(), "YYYYMMDD_HHmmss")}.pdf`;

//   return { filteredData, title, dateStr, defaultFilename };
// };

// Función para generar el PDF y guardarlo con Tauri
export const exportToPDF = async ({
  inventoryRecords,
  selectedUser,
  selectedDate,
}: {
  inventoryRecords: InventoryMovement[] | null;
  selectedUser: string | null;
  selectedDate: string;
}) => {
  const { records, date, fileName, type, userName, reportNumber } =
    FormatReportData(inventoryRecords, selectedUser, selectedDate);

  if (!records) return;

  try {
    // Generar el PDF como un blob
    const pdfDoc = pdf(
      <InventoryReport
        data={records}
        date={date}
        reportNumber={reportNumber}
        reportType={type}
        userName={userName}
      />
    );

    const blob = await pdfDoc.toBlob();

    // Abrir el diálogo de guardado con Tauri
    const filePath = await save({
      defaultPath: fileName,
      filters: [
        {
          name: "Archivo PDF",
          extensions: ["pdf"],
        },
      ],
    });

    if (!filePath) {
      toast.info("Exportación cancelada");
      return;
    }

    // Convertir el blob a un array buffer y guardarlo con Tauri
    const arrayBuffer = await blob.arrayBuffer();
    await writeFile(filePath, new Uint8Array(arrayBuffer));
    toast.success("Se ha exportado el reporte correctamente", {
      action: {
        label: "Abrir Reporte",
        onClick: () => {
          open(filePath);
        },
      },
      duration: 10000,
    });
    // toast.success(`Reporte exportado correctamente a ${filePath}`);
  } catch (error) {
    toast.error(
      "Error al generar o guardar el archivo: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
};
