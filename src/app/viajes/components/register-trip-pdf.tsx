import {
  Document,
  Page,
  Text,
  View,
  Image,
  pdf,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "@formkit/tempo";
import { toast } from "sonner";

interface Trip {
  id: number;
  vehicle_tag: string;
  concept: string;
  amount: number;
  hour: string;
  date: string; // Puedes cambiarlo a `Date` si lo conviertes al instanciarlo
  driver: string;
  user: string;
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 30,
    fontFamily: "Helvetica",
  },
  fontBold: {
    fontWeight: "bold",
  },
  section: {
    height: "300px",
    width: "100%",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 12,
    width: "100%",
    height: "30%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  sectionHeaderFirstColumn: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    width: "25%",
    height: "100%",
  },
  sectionHeaderSecondColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "25%",
    height: "100%",
  },
  sectionHeaderThirdColumn: {
    display: "flex",
    flexDirection: "column",
    textAlign: "right",
    width: "25%",
    height: "100%",
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A3C34",
    textAlign: "center",
  },
  sectionBody: {
    fontSize: 12,
    width: "100%",
    height: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionFooter: {
    width: "100%",
    height: "40%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionFooterColumn: {
    fontSize: 12,
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  separator: {
    width: "100%",
    height: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 21,
  },
});

const TripRegisterPDF = ({ trip }: { trip: Trip }) => {
  console.log("Este es el viaje: ", trip);

  if (!trip) {
    toast.error("Error al imprimir el viaje, No se encontró el viaje.");
  }

  const Section = ({ trip }: { trip: Trip }) => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderFirstColumn}>
            <Text style={{ marginBottom: 5, fontWeight: "bold", fontSize: 15 }}>
              {trip.vehicle_tag}
            </Text>
            <Text>{trip.driver}</Text>
            <Text>{trip.concept}</Text>
          </View>
          <View style={styles.sectionHeaderSecondColumn}>
            <Image style={styles.logo} src="/logo.png" />
            <Text style={styles.sectionHeaderTitle}>CONDUCE</Text>
          </View>
          <View style={styles.sectionHeaderThirdColumn}>
            <Text
              style={{
                color: "red",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              {trip.id}
            </Text>
            <View style={{ marginTop: 5 }}>
              <Text>{format(trip.date, "DD/MM/YYYY")}</Text>
              <Text>{format(trip.date, { time: "short" })}</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionBody}>
          <Text>MONTO</Text>
          <Text style={{ fontWeight: "bold" }}>RD$ ${trip.amount}</Text>
        </View>
        <View style={styles.sectionFooter}>
          <View style={styles.sectionFooterColumn}>
            <Text>FIRMA CAJERO</Text>
            <Text>__________________________</Text>
          </View>
          <View style={styles.sectionFooterColumn}>
            <Text>FIRMA CONDUCTOR</Text>
            <Text>__________________________</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Section trip={trip} />
        <View style={styles.separator}>
          <Text style={{ fontSize: 10, color: "#555" }}>
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            - - - - - - - - - - -
          </Text>
        </View>
        <Section trip={trip} />
      </Page>
    </Document>
  );
};

export const createTripPDF = async (data: any) => {
  const blob = await pdf(<TripRegisterPDF trip={data} />).toBlob();

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
