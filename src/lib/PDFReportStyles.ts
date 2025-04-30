import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
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
