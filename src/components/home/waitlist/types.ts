import {
  Zap,
  Sparkles,
  Users,
  Briefcase,
} from "lucide-react";

export interface WaitlistForm {
  name: string;
  email: string;
  role: "job-seeker" | "employer" | "both";
  company?: string;
  interests: string[];
  notifications: boolean;
}

export const waitlistBenefits = [
  "Early access to exclusive competitions",
  "Priority support and onboarding",
  "Special launch bonuses and rewards",
  "Beta testing opportunities",
  "Direct feedback channel to our team",
];

export const interestOptions = [
  { id: "tech", label: "Technology & Development", icon: Zap },
  { id: "design", label: "Design & Creative", icon: Sparkles },
  { id: "marketing", label: "Marketing & Sales", icon: Users },
  { id: "business", label: "Business & Strategy", icon: Briefcase },
];
