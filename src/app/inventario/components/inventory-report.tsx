import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { InventoryMovement } from "@/types/inventory";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
  },
  cell: {
    width: "20%", // Ajustamos el ancho porque ahora hay más columnas
    fontSize: 12,
  },
});

interface InventoryReportProps {
  data: InventoryMovement[];
  title: string;
  date: string;
}

const InventoryReport = ({ data, title, date }: InventoryReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.header}>Fecha: {date}</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.cell}>Usuario</Text>
          <Text style={styles.cell}>Material</Text>
          <Text style={styles.cell}>Cantidad</Text>
          <Text style={styles.cell}>Tipo</Text>
          <Text style={styles.cell}>Fecha</Text>
        </View>
        {data.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.cell}>{item.user}</Text>
            <Text style={styles.cell}>{item.material_name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.type}</Text>
            <Text style={styles.cell}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default InventoryReport;
