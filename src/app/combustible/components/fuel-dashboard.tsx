import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { FuelChart } from "./chart";

const fuelRegisters = [
  {
    id: 1,
    ficha: 1,
    galones: 10,
    fecha: "2021-10-10",
  },
  {
    id: 2,
    ficha: 2,
    galones: 20,
    fecha: "2021-10-11",
  },
  {
    id: 3,
    ficha: 3,
    galones: 30,
    fecha: "2021-10-12",
  },
  {
    id: 4,
    ficha: 4,
    galones: 40,
    fecha: "2021-10-13",
  },
  {
    id: 5,
    ficha: 5,
    galones: 50,
    fecha: "2021-10-14",
  },
];

export const FuelDashboard = () => {
  const loading = false;
  return (
    <div className="flex">
      {loading ? (
        <div>cargando</div>
      ) : fuelRegisters.length === 0 ? (
        <h1>No hay registros de combustible</h1>
      ) : (
        <div className="relative w-full">
          <div className="w-1/2">
            <h1 className="text-xl font-semibold text-gray-800">Resumen</h1>
            <p className="text-sm text-gray-500">
              Registros de combustible más recientes.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Galones</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelRegisters.slice(0, 5).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>Ficha {item.ficha}</TableCell>
                    <TableCell>{item.galones}</TableCell>
                    <TableCell>{moment(item.fecha).format("LL")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-1/2 absolute bottom-0 right-0">
            <FuelChart />
          </div>
        </div>
      )}
    </div>
  );
};
