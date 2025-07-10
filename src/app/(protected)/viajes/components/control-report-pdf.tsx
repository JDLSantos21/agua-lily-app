import { Document, Page, Text, View, Image, pdf } from "@react-pdf/renderer";
import { format } from "@formkit/tempo";
import { Paginate } from "@/lib/dataPaginate";
import { ControlReportstyles as styles } from "../pdf-styles/controlReportPDF";

export const PDFReport = ({ data, date, userName }: any) => {
  // const currentDate = format(new Date(), { date: "short", time: "short" });

  const RECORDS_PER_PAGE = 24;
  const paginateData = Paginate(data, RECORDS_PER_PAGE);
  const totalPages = paginateData.length;

  return (
    <Document>
      {paginateData.map((pageData, pageIndex) => {
        return (
          <Page size="A4" style={styles.page} key={pageIndex}>
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
                    <Text style={styles.title}>CONTROL DE CAMIONES</Text>
                  </View>
                </View>
                {/* Columna derecha: Información */}
                <View style={styles.rightColumn}>
                  <Text style={styles.infoText}>
                    <Text style={styles.fontBold}>FECHA:</Text>{" "}
                    {format(date, "DD/MM/YYYY")}
                  </Text>
                  {userName && (
                    <Text
                      style={{ ...styles.infoText, textTransform: "uppercase" }}
                    >
                      <Text style={styles.fontBold}>CAJERO:</Text> {userName}
                    </Text>
                  )}
                </View>
              </View>
            )}

            <View style={styles.table}>
              {/* Encabezado de la tabla */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellHeader, styles.ficha]}>
                  FICHA
                </Text>
                <Text style={[styles.tableCellHeader, styles.conductor]}>
                  CONDUCTOR
                </Text>
                <Text style={[styles.tableCellHeader, styles.hora]}>HORA</Text>
                <Text style={[styles.tableCellHeader, styles.conduce]}>
                  No. DE CONDUCE
                </Text>
                <Text style={[styles.tableCellHeader, styles.amount]}>
                  VALOR
                </Text>
              </View>

              {/* Filas de datos */}
              {pageData.map((trip: any) => {
                return (
                  <View key={trip.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.ficha]}>
                      {trip.vehicle_tag}
                    </Text>
                    <Text style={[styles.tableCell, styles.conductor]}>
                      {trip.driver}
                    </Text>
                    <Text style={[styles.tableCell, styles.hora]}>
                      {trip.hour}
                    </Text>
                    <Text style={[styles.tableCell, styles.conduce]}>
                      {trip.id}
                    </Text>
                    <Text style={[styles.tableCell, styles.amount]}>
                      {trip.amount}
                    </Text>
                  </View>
                );
              })}
            </View>

            {totalPages > 1 && (
              <Text style={styles.pageNumber} fixed>
                Página {pageIndex + 1} de {totalPages}
              </Text>
            )}
          </Page>
        );
      })}
    </Document>
  );
};

export const createControlReportPDF = async (
  data: any,
  date: any,
  userName: string | null
) => {
  const blob = await pdf(
    <PDFReport data={data} date={date} userName={userName} />
  ).toBlob();

  const blobUrl = URL.createObjectURL(blob);

  // Crear un iframe oculto
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = blobUrl;

  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // // Limpieza opcional
    // setTimeout(() => {
    //   document.body.removeChild(iframe);
    //   URL.revokeObjectURL(blobUrl);
    // }, 1000);
  };
};
