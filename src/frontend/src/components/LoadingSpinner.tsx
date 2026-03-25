import { AnimatePresence, motion } from "motion/react";

interface LoadingSpinnerProps {
  show: boolean;
}

export function LoadingSpinner({ show }: LoadingSpinnerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/80 backdrop-blur-sm"
          data-ocid="app.loading_state"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <p className="text-white/80 text-sm font-medium tracking-wide">
              Fetching weather data…
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
