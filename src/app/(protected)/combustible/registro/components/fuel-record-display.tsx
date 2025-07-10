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
          <Card className="w-full shadow-sm border">
            <CardContent className="p-6 flex items-center justify-center text-muted-foreground h-[280px]">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-amber-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No hay vehículo seleccionado
                  </h3>
                  <p className="text-sm text-gray-600">
                    Seleccione un vehículo para ver su último registro
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        // Estado cuando hay un vehículo con último registro
        <motion.div key="data" {...animationProps}>
          <Card className="w-full shadow-sm border">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {lastRecord.current_tag}
                </h3>
              </div>

              <div className="text-center mb-6">
                <h4 className="text-sm font-medium uppercase text-gray-500 tracking-wide">
                  Último Registro
                </h4>
              </div>

              <div className="space-y-4">
                <RecordItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Fecha"
                  value={format(lastRecord.record_date, { date: "long" })}
                  bgColor="bg-purple-100"
                  textColor="text-purple-600"
                />

                <RecordItem
                  icon={<Gauge className="h-5 w-5" />}
                  label="Kilometraje"
                  value={`${lastRecord.mileage} km`}
                  bgColor="bg-orange-100"
                  textColor="text-orange-600"
                />

                <RecordItem
                  icon={<Fuel className="h-5 w-5" />}
                  label="Cantidad"
                  value={`${lastRecord.gallons} Galones`}
                  bgColor="bg-green-100"
                  textColor="text-green-600"
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
  bgColor?: string;
  textColor?: string;
}

/**
 * Componente que renderiza un ítem individual de información del registro
 */
const RecordItem: FC<RecordItemProps> = ({
  icon,
  label,
  value,
  bgColor = "bg-gray-100",
  textColor = "text-gray-600",
}) => {
  return (
    <div className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100">
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          <div className={textColor}>{icon}</div>
        </div>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
};

export default FuelRecordDisplay;
