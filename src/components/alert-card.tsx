"use client";

import { motion } from "framer-motion";

export default function AlertCard({
  className,
  title,
  description,
  icon,
}: {
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-muted-foreground select-none text-lg border p-2 w-96 mx-auto ${className}`}
    >
      <div className="flex items-center justify-center text-blue-400 space-x-2 text-sm">
        {icon}
        <p>{title}</p>
      </div>
      <div className="text-center text-sm py-2 text-gray-600">
        {description}
      </div>
    </motion.div>
  );
}
