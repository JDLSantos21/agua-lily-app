import { motion } from "framer-motion";

export default function TripInfoCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="p-2 border border-gray-300 rounded-md shadow-sm animate-pulse"
    >
      <div className="flex justify-between mb-1">
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="space-y-1">
        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    </motion.div>
  );
}
