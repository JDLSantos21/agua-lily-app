import { motion } from "framer-motion";

export default function TripInfoCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/60 to-gray-200/60 rounded-2xl"></div>
      <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 shadow-lg">
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-12 animate-pulse"></div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
