// TripReceiptPDF.tsx
import React from "react";
import { Document, Page, Text, View, Image, pdf } from "@react-pdf/renderer";
import { format } from "@formkit/tempo";
import { outTripPDF as styles } from "@/app/viajes/pdf-styles/outTripPDF";

interface PendingTrip {
  id: number;
  vehicle_id: number;
  vehicle_tag: string;
  date: string;
  driver: string;
  user: string;
}

const OutTripPDF = ({ trip }: { trip: PendingTrip }) => {
  const { id, vehicle_tag, date, driver, user } = trip;

  // Add error handling for missing data
  const formattedDate = date ? format(date, "DD/MM/YYYY") : "N/A";
  const formattedTime = date ? format(date, "HH:mm A") : "N/A";

  return (
    <Document style={{ padding: 0, margin: 0 }}>
      <Page size="A6" style={styles.page}>
        {/* Encabezado con Logo y Datos de la Empresa */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="/logo.png" // URL del logo o ruta local
          />
          <Text style={styles.logoTitle}>Agua & Hielo Lily S.R.L</Text>
          <Text style={styles.logoSubtitle}>RNC 101-85657-2</Text>
          <View style={styles.companyInfoContainer}>
            <Text>Av. Hermanas Mirabal 1, Esq. Colonia de los Doctores</Text>
            <Text>Santo Domingo Norte, Rep. Dominicana</Text>
            <Text>Tel. 809-568-5757 | www.agualily.com</Text>
          </View>
        </View>

        {/* Título e ID */}
        <Text style={styles.title}>CONSTANCIA DE VIAJES</Text>

        {/* Detalles del Viaje */}
        <View style={styles.body}>
          <View style={styles.bodyHeader}>
            <Text style={styles.tagText}>{vehicle_tag || "Sin Ficha"}</Text>
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <Text style={styles.dateText}>{formattedTime}</Text>
            </View>
          </View>

          <View style={styles.dataTextContentContainer}>
            <View style={styles.dataTextContent}>
              <Text style={styles.dataTextLabel}>Conductor</Text>
              <Text style={styles.dataTextValue}>
                {driver || "No especificado"}
              </Text>
            </View>
            <View style={styles.dataTextContent}>
              <Text style={styles.dataTextLabel}>Cajero</Text>
              <Text style={styles.dataTextValue}>
                {user || "No especificado"}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* ID del Viaje */}
          <View style={styles.tripIdContainer}>
            <Text style={styles.title}>CONDUCE</Text>
            <Text style={styles.tripIdText}>#{id || "0000"}</Text>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Espacio para Firmas */}
        <View style={styles.signaturesContainer}>
          <View style={styles.signature}>
            <Text style={styles.signatureText}>Firma Conductor</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signature}>
            <Text style={styles.signatureText}>Firma Cajero</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>

        {/* Pie de Página */}
        {/* <Text style={styles.footer}>
          ATENCION Este documento es exclusivamente para uso interno de la
          empresa.
        </Text> */}
      </Page>
    </Document>
  );
};

export const CreateOutTripPDF = async (data: PendingTrip) => {
  const blob = await pdf(<OutTripPDF trip={data} />).toBlob();

  const blobUrl = URL.createObjectURL(blob);

  // Crear un iframe oculto
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = blobUrl;

  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  };
};
