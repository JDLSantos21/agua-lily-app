import { motion } from "framer-motion";
export default function TripInfoCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="h-36 p-4 flex flex-col justify-center border border-gray-300 rounded-sm shadow-md my-5 animate-pulse"
    >
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    </motion.div>
  );
}
