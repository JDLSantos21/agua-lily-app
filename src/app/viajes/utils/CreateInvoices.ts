import { createInvoice, print } from "qikpos";
import { CompletedTrip, PendingTrip } from "../types/trips";
import { format } from "@formkit/tempo";

export async function createOutTripInvoice(pendingTrip: PendingTrip) {
  if (!pendingTrip) {
    throw new Error("Pending trip is required to create an invoice.");
  }
  const time = format(pendingTrip.date, "HH:mm A");
  const date = format(pendingTrip.date, "DD/MM/YYYY");

  const invoice = createInvoice()
    .codePage("WPC1252")
    .center()
    .image("/logo.png", 130)
    .feed(1)
    .textStyle(["Bold"])
    .text("Agua & Hielo Lily")
    .text("101-85657-2")
    .feed(1)
    .text("#CONDUCE#")
    .textStyle(["None"])
    .text(`${pendingTrip.vehicle_tag}                  ${date}`)
    .right()
    .text(time)
    .textStyle(["Bold"])
    .left()
    .text("Chofer:")
    .textStyle(["None"])
    .text(pendingTrip.driver.toUpperCase())
    .feed(1)
    .textStyle(["Bold"])
    .text("Cajero:")
    .textStyle(["None"])
    .text(pendingTrip.user.toUpperCase())
    .text("================================")
    .feed(1)
    .center()
    .text("CONDUCE")
    .textStyle(["Bold"])
    .text(`#${pendingTrip.id}`)
    .textStyle(["None"])
    .feed(1)
    .text("================================")
    .feed(1)
    .text("Firma Chofer        Firma Cajero")
    .feed(2)
    .text("_______________   ______________")
    .feed(2)
    .initialize();

  return await print(invoice, "http://localhost:5003");
}

export async function createCompletedTripInvoice(trip: CompletedTrip) {
  if (!trip) {
    throw new Error("Completed trip data is required.");
  }

  const departureTime = format(trip.date, "HH:mm A");
  const departureDate = format(trip.date, "DD/MM/YYYY");
  const paymentTime = format(trip.payment_date, "HH:mm A");
  const paymentDate = format(trip.payment_date, "DD/MM/YYYY");

  const invoice = createInvoice()
    .codePage("WPC1252")
    .center()
    .image("/logo.png", 130)
    .feed(1)
    .textStyle(["Bold"])
    .text("Agua & Hielo Lily")
    .textStyle(["FontB"])
    .text("101-85657-2")
    .textStyle(["Bold"])
    .feed(1)
    .text("#CIERRE DE VIAJE#")
    .feed(1)
    .textStyle(["None"])
    .text(`${trip.vehicle_tag}                  ${departureDate}`)
    .right()
    .text(departureTime)
    .left()
    .feed(1)
    .textStyle(["FontB"])
    .text("Conductor:")
    .textStyle(["Proportional"])
    .text(trip.driver.toUpperCase())
    .feed(1)
    .textStyle(["FontB"])
    .text("Cajero que Recibe:")
    .textStyle(["Proportional"])
    .text(trip.payment_user.toUpperCase())
    .feed(1)
    .textStyle(["FontB"])
    .text("Concepto:")
    .textStyle(["Proportional"])
    .text(trip.concept)
    .feed(1)
    .textStyle(["FontB"])
    .text("Monto Entregado:")
    .textStyle(["Proportional"])
    .text(`RD$ ${trip.amount.toFixed(2)}`)
    .feed(1)
    .textStyle(["FontB"])
    .text("Fecha y Hora de Entrega:")
    .textStyle(["Proportional"])
    .text(`${paymentDate} ${paymentTime}`)
    .feed(1)
    .text("================================")
    .feed(1)
    .center()
    .textStyle(["Bold"])
    .text(`CIERRE #${trip.id}`)
    .textStyle(["None", "Proportional"])
    .feed(1)
    .text("================================")
    .feed(1)
    .text("Firma Chofer        Firma Cajero")
    .feed(2)
    .text("_______________   ______________")
    .feed(2)
    .initialize();

  return await print(invoice, "http://localhost:5003");
}
