import { motion } from "framer-motion";

const SkeletonLoader = () => {
  return (
    <div className="mb-10">
      {/* Header with pagination */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-4 w-40 bg-gray-700 rounded-full animate-pulse" />
        <div className="flex space-x-3">
          <div className="h-10 px-8 bg-gray-700 rounded-md animate-pulse" />
          <div className="h-10 px-5 bg-gray-700 rounded-md animate-pulse" />
          <div className="h-10 px-5 bg-gray-700 rounded-md animate-pulse" />
          <div className="h-10 px-5 bg-gray-700 rounded-md animate-pulse" />
          <div className="h-10 px-5 bg-gray-700 rounded-md animate-pulse" />
          <div className="h-10 px-8 bg-gray-700 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Questions list */}
      <div className="grid gap-4">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-48 bg-gray-700 rounded-full animate-pulse" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="h-2 w-24 bg-gray-700 rounded-full animate-pulse" />
              <div className="h-2 w-16 bg-gray-700 rounded-full animate-pulse" />
              <div className="flex flex-wrap gap-2 ml-auto">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-16 bg-gray-700 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
