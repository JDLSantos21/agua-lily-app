import { StyleSheet } from "@react-pdf/renderer";

export const ControlReportstyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
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
    width: "40%",
    alignItems: "flex-end",
  },
  headerGenericData: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  logoTitleContainer: {
    width: "60%",
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
    // border: "1 solid #E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    // backgroundColor: "#F5F5F5",
    // borderBottom: "1 solid #E0E0E0",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E0E0E0",
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  tableCellHeader: {
    fontSize: 12,
    marginBottom: 4,
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
  fontBold: {
    fontWeight: "bold",
  },
  conductor: {
    width: "35%",
  },
  hora: {
    width: "15%",
  },
  conduce: {
    width: "25%",
  },
  amount: {
    width: "15%",
  },
  ficha: {
    width: "10%",
  },
});
