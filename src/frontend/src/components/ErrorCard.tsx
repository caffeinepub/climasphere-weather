import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 py-16 px-8 text-center"
      data-ocid="app.error_state"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Something went wrong
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          data-ocid="app.button"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </motion.div>
  );
}
