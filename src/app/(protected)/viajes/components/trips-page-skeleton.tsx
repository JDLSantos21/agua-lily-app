import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function TripPageSkeleton() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {" "}
        {/* Header Skeleton */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <Skeleton className="h-10 w-80 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto mb-6" />
          <div className="flex items-center justify-center gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </motion.div>
        {/* Action Buttons Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-32 w-full rounded-2xl" />
            </motion.div>
          ))}
        </div>
        {/* Label Generator Skeleton */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-pink-100/60 rounded-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
            {/* Header */}
            <div className="p-8 border-b border-gray-100/50">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-14 flex-grow rounded-xl" />
                      <Skeleton className="h-14 w-32 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 space-y-6">
                  <Skeleton className="h-32 w-full rounded-2xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
