import { motion } from "framer-motion";
import { CheckCircle, Check } from "lucide-react";
import { waitlistBenefits } from "./types";

export function WaitlistBenefits() {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">What you'll get:</h4>
      <div className="space-y-3">
        {waitlistBenefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.1,
            }}
            className="flex items-center space-x-3"
          >
            <div className="w-5 h-5 rounded-full bg-[#FC5602]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-[#FC5602]" />
            </div>
            <span className="text-gray-700 font-medium">{benefit}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
