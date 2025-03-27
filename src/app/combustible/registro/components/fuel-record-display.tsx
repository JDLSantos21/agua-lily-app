"use client";
import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Fuel, Calendar, AlertCircle, Tag } from "lucide-react";
import { LastRecord } from "@/types/fuel.types";
import { format } from "@formkit/tempo";

interface FuelRecordDisplayProps {
  lastRecord: LastRecord | undefined;
}

const animationProps = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 },
};

/**
 * Componente que muestra el último registro de combustible para el vehículo seleccionado
 */
const FuelRecordDisplay: FC<FuelRecordDisplayProps> = ({ lastRecord }) => {
  return (
    <AnimatePresence mode="wait">
      {!lastRecord ? (
        // Estado cuando no hay vehículo seleccionado
        <motion.div key="empty" {...animationProps}>
          <Card className="w-full shadow-sm">
            <CardContent className="p-6 flex items-center justify-center text-muted-foreground h-[250px]">
              <div className="flex flex-col items-center space-y-2">
                <AlertCircle className="h-8 w-8 mb-2 text-amber-500" />
                <span className="text-center text-gray-600/90">
                  Seleccione un vehículo para ver su último registro
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        // Estado cuando hay un vehículo con último registro
        <motion.div key="data" {...animationProps}>
          <Card className="w-full shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Tag className="h-5 w-5 mr-2 text-primary/80" />
                <h3 className="text-lg text-gray-700 font-bold text-center">
                  {lastRecord.current_tag}
                </h3>
              </div>

              <h4 className="text-md font-medium uppercase text-gray-700 mb-4 text-center">
                Último Registro
              </h4>

              <div className="space-y-4">
                <RecordItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Fecha"
                  value={format(lastRecord.record_date, { date: "long" })}
                />

                <RecordItem
                  icon={<Gauge className="h-5 w-5" />}
                  label="Kilometraje"
                  value={`${lastRecord.mileage} km`}
                />

                <RecordItem
                  icon={<Fuel className="h-5 w-5" />}
                  label="Cantidad"
                  value={`${lastRecord.gallons} Galones`}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface RecordItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

/**
 * Componente que renderiza un ítem individual de información del registro
 */
const RecordItem: FC<RecordItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-md transition-colors">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="text-primary/70 group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <span>{value}</span>
    </div>
  );
};

export default FuelRecordDisplay;
