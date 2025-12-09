import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Rocket } from "lucide-react";

export function WaitlistHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6 mb-12"
    >
      <Badge
        variant="outline"
        className="bg-[#FC5602]/10 text-[#FC5602] border-[#FC5602]/20 hover:bg-[#FC5602]/20 transition-colors"
      >
        <Rocket className="w-3 h-3 mr-1" />
        🚀 Join the Revolution
      </Badge>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Be Part of the{" "}
        <span className="relative">
          <span className="gradient-text">Future</span>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-2 left-0 h-3 bg-[#FC5602]/20 -z-10"
          />
        </span>{" "}
        of Hiring
      </h2>
      <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
        Join thousands of forward-thinking professionals and companies who are
        revolutionizing the way talent meets opportunity through competitive
        challenges.
      </p>
    </motion.div>
  );
}
