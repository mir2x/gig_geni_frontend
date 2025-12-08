import { Mail, Bell, Smartphone, Monitor } from "lucide-react";

export interface Notification {
  id: string;
  type: "email" | "in_app" | "sms" | "push";
  category:
    | "round_transition"
    | "reminder"
    | "announcement"
    | "result"
    | "schedule"
    | "system";
  title: string;
  message: string;
  recipients: string[];
  recipientType: "all" | "active" | "round_specific" | "custom";
  targetRound?: number;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  priority: "low" | "medium" | "high" | "urgent";
  template?: string;
  variables?: Record<string, any>;
  deliveryStats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
  autoTrigger?: {
    enabled: boolean;
    condition: string;
    delay?: number;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  isDefault: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "email",
    category: "round_transition",
    title: "Round 2 Unlocked - Video Pitch",
    message:
      "Congratulations! You have successfully passed Round 1. Round 2 (Video Pitch) is now available.",
    recipients: ["john@example.com", "sarah@example.com"],
    recipientType: "round_specific",
    targetRound: 2,
    status: "sent",
    sentAt: "2024-02-12T10:00:00Z",
    createdAt: "2024-02-12T09:30:00Z",
    createdBy: "admin@company.com",
    priority: "high",
    deliveryStats: {
      sent: 2,
      delivered: 2,
      opened: 2,
      clicked: 1,
      failed: 0,
    },
  },
  {
    id: "n2",
    type: "in_app",
    category: "reminder",
    title: "Quiz Deadline Reminder",
    message: "Reminder: You have 2 days left to complete the screening quiz.",
    recipients: ["mike@example.com", "emily@example.com"],
    recipientType: "round_specific",
    targetRound: 1,
    status: "sent",
    sentAt: "2024-02-10T14:00:00Z",
    createdAt: "2024-02-10T13:45:00Z",
    createdBy: "admin@company.com",
    priority: "medium",
    deliveryStats: {
      sent: 2,
      delivered: 2,
      opened: 1,
      clicked: 0,
      failed: 0,
    },
  },
  {
    id: "n3",
    type: "email",
    category: "schedule",
    title: "Interview Scheduled",
    message:
      "Your live interview has been scheduled for February 25, 2024 at 10:00 AM.",
    recipients: ["sarah@example.com"],
    recipientType: "custom",
    targetRound: 3,
    status: "scheduled",
    scheduledAt: "2024-02-20T09:00:00Z",
    createdAt: "2024-02-18T16:00:00Z",
    createdBy: "admin@company.com",
    priority: "high",
  },
];

export const mockTemplates: NotificationTemplate[] = [
  {
    id: "t1",
    name: "Round Transition",
    category: "round_transition",
    subject: "Round {{round_number}} Unlocked - {{round_name}}",
    content:
      "Congratulations {{participant_name}}! You have successfully passed Round {{previous_round}}. Round {{round_number}} ({{round_name}}) is now available. Please log in to continue your journey.",
    variables: [
      "participant_name",
      "round_number",
      "round_name",
      "previous_round",
    ],
    isDefault: true,
  },
  {
    id: "t2",
    name: "Quiz Reminder",
    category: "reminder",
    subject: "Quiz Deadline Reminder - {{days_left}} Days Left",
    content:
      "Hi {{participant_name}}, this is a friendly reminder that you have {{days_left}} days left to complete the screening quiz for {{competition_name}}.",
    variables: ["participant_name", "days_left", "competition_name"],
    isDefault: true,
  },
  {
    id: "t3",
    name: "Interview Scheduled",
    category: "schedule",
    subject: "Interview Scheduled - {{interview_date}}",
    content:
      "Dear {{participant_name}}, your live interview has been scheduled for {{interview_date}} at {{interview_time}}. Zoom link: {{zoom_link}}",
    variables: [
      "participant_name",
      "interview_date",
      "interview_time",
      "zoom_link",
    ],
    isDefault: true,
  },
  {
    id: "t4",
    name: "Competition Results",
    category: "result",
    subject: "Competition Results - {{competition_name}}",
    content:
      "Dear {{participant_name}}, the results for {{competition_name}} are now available. {{result_message}}",
    variables: ["participant_name", "competition_name", "result_message"],
    isDefault: true,
  },
];

export const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export const typeIcons = {
  email: Mail,
  in_app: Bell,
  sms: Smartphone,
  push: Monitor,
};
