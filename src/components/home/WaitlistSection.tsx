// components/home/WaitlistSection.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Gift, ArrowRight, Rocket } from "lucide-react";
import { WaitlistHeader } from "./waitlist/WaitlistHeader";
import { WaitlistBenefits } from "./waitlist/WaitlistBenefits";
import { WaitlistSuccess } from "./waitlist/WaitlistSuccess";
import { WaitlistFormContent } from "./waitlist/WaitlistFormContent";
import { WaitlistVisuals } from "./waitlist/WaitlistVisuals";
import { WaitlistForm } from "./waitlist/types";

export function WaitlistSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<WaitlistForm>({
    name: "",
    email: "",
    role: "job-seeker",
    company: "",
    interests: [],
    notifications: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interestId]
        : prev.interests.filter((id) => id !== interestId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after success
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setForm({
        name: "",
        email: "",
        role: "job-seeker",
        company: "",
        interests: [],
        notifications: true,
      });
    }, 2000);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-slate-50 via-orange-50/40 to-blue-50/30">
      <div className="container-width">
        <div className="w-full">
          {/* Section Header */}
          <WaitlistHeader />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left Side - Content */}
                  <div className="p-6 sm:p-8 lg:p-12 space-y-6 lg:space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FC5602] to-[#FF7B02] rounded-xl flex items-center justify-center">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            Join Our{" "}
                            <span className="gradient-text">Waitlist</span>
                          </h3>
                          <p className="text-gray-600">
                            Be first to experience the future
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        Get exclusive early access to our platform, special
                        launch bonuses, and be part of shaping the future of
                        competitive hiring.
                      </p>
                    </div>

                    {/* Benefits */}
                    <WaitlistBenefits />

                    {/* CTA Button */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="btn-primary w-full lg:w-auto text-lg px-8 py-4 group"
                        >
                          Join Waitlist Now
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] sm:w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
                        <DialogHeader className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FC5602] to-[#FF7B02] rounded-xl flex items-center justify-center">
                              <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <DialogTitle className="text-xl font-bold text-gray-900">
                                Join the Waitlist
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Be among the first to experience GigGeni
                              </DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>

                        {!isSubmitted ? (
                          <WaitlistFormContent
                            form={form}
                            setForm={setForm}
                            handleSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            handleInterestChange={handleInterestChange}
                          />
                        ) : (
                          <WaitlistSuccess />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Right Side - Visual */}
                  <WaitlistVisuals />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
