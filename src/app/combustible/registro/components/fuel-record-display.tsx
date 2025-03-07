import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Fuel, Calendar, AlertCircle } from "lucide-react";
import moment from "moment";
import { LastRecord } from "@/types/fuel.types";

export default function FuelRecordDisplay({
  lastRecord,
}: {
  lastRecord: LastRecord | undefined;
}) {
  if (!lastRecord) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 flex items-center justify-center text-muted-foreground">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Seleccione un vehículo.</span>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-sm overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Último Registro
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Fecha</span>
              </div>
              <span className="font-medium">
                {moment(lastRecord.record_date).format("LL")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Gauge className="h-5 w-5" />
                <span className="text-sm">Kilometraje</span>
              </div>
              <span className="font-medium">{lastRecord.mileage} km</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Fuel className="h-5 w-5" />
                <span className="text-sm">Cantidad</span>
              </div>
              <span className="font-medium">{lastRecord.gallons} Galones</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
