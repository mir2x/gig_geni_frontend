import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Rocket } from "lucide-react";

export function WaitlistVisuals() {
  return (
    <div className="relative bg-gradient-to-br from-[#FC5602]/10 to-[#FF7B02]/5 p-6 sm:p-8 lg:p-12 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
      <div className="relative">
        {/* Main Illustration */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200/50"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FC5602] to-[#FF7B02] rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Early Access</p>
                  <p className="text-sm text-gray-500">Premium Features</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-200"
              >
                VIP
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Waitlist Position</span>
                <span className="font-semibold text-[#FC5602]">#247</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "75%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="bg-gradient-to-r from-[#FC5602] to-[#FF7B02] h-2 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/30">
                <p className="text-sm sm:text-lg font-bold text-[#FC5602]">
                  2.5K+
                </p>
                <p className="text-xs text-gray-600 font-medium">Joined</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/30">
                <p className="text-sm sm:text-lg font-bold text-blue-600">
                  Soon
                </p>
                <p className="text-xs text-gray-600 font-medium">Launch</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#FC5602] rounded-2xl flex items-center justify-center shadow-lg"
        >
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 10, 0],
            x: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100"
        >
          <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-[#FC5602]" />
        </motion.div>
      </div>
    </div>
  );
}
