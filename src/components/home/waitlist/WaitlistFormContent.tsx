import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Mail,
  Briefcase,
  ArrowRight,
  Bell,
} from "lucide-react";
import { WaitlistForm, interestOptions } from "./types";

interface WaitlistFormContentProps {
  form: WaitlistForm;
  setForm: (form: WaitlistForm) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  handleInterestChange: (interestId: string, checked: boolean) => void;
}

export function WaitlistFormContent({
  form,
  setForm,
  handleSubmit,
  isSubmitting,
  handleInterestChange,
}: WaitlistFormContentProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
      {/* Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <User className="w-4 h-4 mr-2 text-[#FC5602]" />
            Full Name
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-12 rounded-xl bg-white/80 backdrop-blur-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-[#FC5602]" />
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="h-12 rounded-xl bg-white/80 backdrop-blur-sm"
            required
          />
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">I am a:</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["job-seeker", "employer", "both"].map((role) => (
            <div
              key={role}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.role === role
                  ? "border-[#FC5602] bg-[#FC5602]/5"
                  : "border-gray-200 bg-white/60 hover:border-gray-300"
              }`}
              onClick={() => setForm({ ...form, role: role as any })}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    form.role === role ? "border-[#FC5602]" : "border-gray-300"
                  }`}
                >
                  {form.role === role && (
                    <div className="w-2 h-2 rounded-full bg-[#FC5602]" />
                  )}
                </div>
                <span className="font-medium capitalize">
                  {role === "job-seeker"
                    ? "Job Seeker"
                    : role === "employer"
                    ? "Employer"
                    : "Both"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company (if employer) */}
      {(form.role === "employer" || form.role === "both") && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-[#FC5602]" />
            Company Name
          </label>
          <Input
            type="text"
            placeholder="Enter your company name"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="h-12 rounded-xl bg-white/80 backdrop-blur-sm"
          />
        </div>
      )}

      {/* Interests */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">
          Areas of Interest:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {interestOptions.map((interest) => (
            <div
              key={interest.id}
              className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 border border-gray-200"
            >
              <Checkbox
                id={interest.id}
                checked={form.interests.includes(interest.id)}
                onCheckedChange={(checked) =>
                  handleInterestChange(interest.id, !!checked)
                }
                className="rounded"
              />
              <interest.icon className="w-4 h-4 text-[#FC5602]" />
              <label
                htmlFor={interest.id}
                className="text-sm font-medium cursor-pointer flex-1"
              >
                {interest.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="flex items-center space-x-3 p-4 rounded-xl bg-[#FC5602]/5 border border-[#FC5602]/20">
        <Checkbox
          id="notifications"
          checked={form.notifications}
          onCheckedChange={(checked) =>
            setForm({ ...form, notifications: !!checked })
          }
          className="rounded"
        />
        <Bell className="w-4 h-4 text-[#FC5602]" />
        <label
          htmlFor="notifications"
          className="text-sm text-gray-700 cursor-pointer flex-1"
        >
          Send me updates about new features and competitions
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary h-12 text-lg rounded-xl"
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
            />
            Joining Waitlist...
          </>
        ) : (
          <>
            Join Waitlist
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
