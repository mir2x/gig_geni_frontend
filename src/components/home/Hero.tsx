// components/home/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Users,
  Target,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import RecentWinnerCarousel from "./RecentWinner";
import { winnersData } from "@/lib/mock-data";
import { HomeResponse } from "@/types";

interface HeroProps {
  homeData?: HomeResponse;
}

const BANNER_IMAGE_PATH = "/images/hero-banner-new.jpg";
const MOBILE_BANNER_IMAGE_PATH = "/images/hero-banner-new.jpg";
const BANNER_LINK_URL = "/competitions/68fc0272b956bef70b3c6fc8";

export function Hero({ homeData }: HeroProps) {
  const stats = [
    {
      label: "Active Competitions",
      value: homeData ? `${homeData.activeCompetitions}` : "–",
      icon: Target,
    },
    {
      label: "Job Seekers",
      value: homeData ? `${homeData.activeTalent + 7000}` : "–",
      icon: Users,
    },
    {
      label: "Completed Competitions",
      value: homeData ? `${homeData.completedCompetitions + 15}` : "–",
      icon: Trophy,
    },
    {
      label: "Active Hirer",
      value: homeData ? `${homeData.activeHirer + 60}` : "–",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="w-full bg-gray-900 shadow-xl mt-4 mb-8">
        <Link href={BANNER_LINK_URL} className="block w-full">
          <div className="relative w-full">
            <Image
              src={MOBILE_BANNER_IMAGE_PATH}
              alt="Promotional Banner"
              width={1000}
              height={1800}
              priority
              className="object-cover w-full h-auto block sm:hidden"
            />

            <Image
              src={BANNER_IMAGE_PATH}
              alt="Promotional Banner"
              width={1920}
              height={720}
              priority
              className="object-cover w-full h-auto hidden sm:block"
            />
          </div>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-orange-50/40 to-blue-50/30">
        {/* Animated blobs - already responsive */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 2, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-2 lg:left-10 w-12 h-12 lg:w-24 lg:h-24 bg-gradient-to-br from-[#FC5602]/20 to-[#FF7B02]/10 rounded-full blur-xl"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -4, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-40 right-2 lg:right-20 w-16 h-16 lg:w-36 lg:h-36 bg-gradient-to-br from-blue-500/15 to-purple-500/10 rounded-full blur-xl"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 4, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-20 left-2 lg:left-20 w-16 h-16 lg:w-28 lg:h-28 bg-gradient-to-br from-green-500/15 to-[#FC5602]/10 rounded-full blur-xl"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            x: [0, -2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 right-2 lg:right-10 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-lg"
          style={{ willChange: "transform" }}
        />

        {/* RESPONSIVE: Adjusted bottom padding for mobile */}
        <div className="container pb-16 md:pb-20 relative">
          {/* RESPONSIVE: Grid is already responsive (stacks on mobile, lg:grid-cols-2) */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Badge
                  variant="outline"
                  // RESPONSIVE: Adjusted text size
                  className="bg-[#FC5602]/10 text-[#FC5602] border-[#FC5602]/20 
             hover:bg-[#FC5602]/20 transition-colors 
             px-4 py-2 text-base md:text-lg rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  🚀 The Future of Hiring is Here
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-4"
              >
                {/* RESPONSIVE: Text size is already responsive */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Where{" "}
                  <span className="relative">
                    <span className="gradient-text">Talent</span>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute bottom-1 md:bottom-2 left-0 h-2 md:h-3 bg-[#FC5602]/20 -z-10"
                    />
                  </span>{" "}
                  Meets{" "}
                  <span className="relative">
                    <span className="gradient-text">Opportunity</span>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                      className="absolute bottom-1 md:bottom-2 left-0 h-2 md:h-3 bg-[#FC5602]/20 -z-10"
                    />
                  </span>
                </h1>

                {/* RESPONSIVE: Adjusted text size */}
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Experience the most engaging and fair hiring process through
                  competitive challenges.
                  <span className="block mt-2 font-semibold text-[#FC5602]">
                    Prove your skills. Get hired. Win amazing prizes.
                  </span>
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                // RESPONSIVE: Already stacks on mobile (flex-col) and goes to row on sm+
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/competitions">
                  <Button
                    size="lg"
                    // RESPONSIVE: Adjusted text size, padding, and width
                    className="btn-primary group w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border border-orange-500 hover:text-orange-500"
                  >
                    Join Competition
                    <Trophy className="ml-2 text-orange-600 h-5 w-5 group-hover:rotate-12 transition-transform duration-300 " />
                  </Button>
                </Link>

                <Link href="/competitions/create">
                  <Button
                    size="lg"
                    variant="outline"
                    // RESPONSIVE: Adjusted text size, padding, and width
                    className="btn-outline w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-3 md:py-4 group"
                  >
                    Post Competition
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>

              {/* Watch Demo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <button className="flex items-center space-x-3 text-gray-600 hover:text-[#FC5602] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[#FC5602]/10 flex items-center justify-center group-hover:bg-[#FC5602]/20 transition-colors">
                    <Play className="w-5 h-5 text-[#FC5602] ml-0.5" />
                  </div>
                  {/* RESPONSIVE: Adjusted text size */}
                  <span className="text-base md:text-lg font-medium">
                    Watch how it works
                  </span>
                </button>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Hero Card */}
              <div className="relative">
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
                  // RESPONSIVE: Adjusted padding for mobile
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-8 border border-gray-200/50 ring-1 ring-gray-100/50"
                >
                  <RecentWinnerCarousel winners={winnersData} interval={4000} />
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
                  // RESPONSIVE: Adjusted size and position for mobile
                  className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 bg-[#FC5602] rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
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
                  // RESPONSIVE: Adjusted size and position for mobile
                  className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100"
                >
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-[#FC5602]" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 md:mt-20"
          >
            {/* RESPONSIVE: Adjusted padding for mobile */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-4 sm:p-6 md:p-8">
              {/* RESPONSIVE: Already responsive (2 cols on mobile, 4 on md+) */}
              {/* RESPONSIVE: Adjusted gap for mobile */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    className="text-center space-y-3"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FC5602]/10 rounded-xl">
                      <stat.icon className="w-6 h-6 text-[#FC5602]" />
                    </div>
                    <div>
                      {/* RESPONSIVE: Adjusted text size */}
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
