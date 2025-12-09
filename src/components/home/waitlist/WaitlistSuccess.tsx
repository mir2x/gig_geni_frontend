import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function WaitlistSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 mt-8"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">
          Welcome to the Waitlist!
        </h3>
        <p className="text-gray-600">
          Thank you for joining! We'll keep you updated on our progress and
          notify you when we launch.
        </p>
      </div>
    </motion.div>
  );
}
