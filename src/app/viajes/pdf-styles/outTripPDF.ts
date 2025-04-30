import { StyleSheet } from "@react-pdf/renderer";

export const outTripPDF = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
    fontFamily: "Helvetica",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },

  logoTitle: {
    fontSize: 9,
    fontWeight: "ultrabold",
    color: "#311EDB",
  },
  logoSubtitle: {
    fontSize: 8,
    marginVertical: 2,
    color: "black",
    fontWeight: "medium",
  },
  companyInfoContainer: {
    width: "100%",
    fontSize: 8,
    color: "#827D7D",
  },
  title: {
    fontSize: 14,
    fontWeight: "ultrabold",
    textAlign: "center",
  },
  body: {
    width: "100%",
    marginTop: 10,
  },
  bodyHeader: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  tagText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  dateTextContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  dateText: {
    color: "black",
    fontWeight: "medium",
    fontSize: 8,
  },
  dataTextContentContainer: {
    width: "100%",
    height: 61,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  dataTextContent: {
    display: "flex",
    flexDirection: "column",
  },
  dataTextLabel: {
    color: "#827D7D",
    fontSize: 8,
    fontWeight: "medium",
  },
  dataTextValue: {
    textTransform: "uppercase",
    color: "black",
    fontSize: 10,
    fontWeight: "medium",
  },
  tripIdContainer: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  tripIdText: {
    marginTop: 2,
    color: "#EA4040",
    fontSize: 16,
    fontWeight: "ultrabold",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    marginVertical: 20,
  },

  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signature: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  signatureText: {
    fontSize: 10,
    fontWeight: "medium",
    textAlign: "center",
  },

  signatureLine: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "#B9B6B6",
    marginTop: 25,
  },

  footer: {
    fontSize: 8,
    textAlign: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
});
