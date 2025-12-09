export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  round1Score: number;
  round2Status: string;
  round3Rating: number;
  round3Notes: string;
  finalScore?: number;
  finalRank?: number;
  finalComments?: string;
  isWinner?: boolean;
  prizeCategory?: string;
  status: "pending" | "evaluated" | "winner" | "completed";
  submissionDate: string;
  totalPoints?: number;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
}

export const mockParticipants: Participant[] = [
  {
    id: "p1",
    name: "John Smith",
    email: "john@example.com",
    round1Score: 92,
    round2Status: "approved",
    round3Rating: 4.5,
    round3Notes: "Excellent technical skills and communication",
    finalScore: 88,
    finalRank: 1,
    isWinner: true,
    prizeCategory: "First Place",
    status: "winner",
    submissionDate: "2024-02-20T10:00:00Z",
    totalPoints: 450,
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    round1Score: 89,
    round2Status: "approved",
    round3Rating: 4.2,
    round3Notes: "Strong problem-solving abilities",
    finalScore: 85,
    finalRank: 2,
    isWinner: true,
    prizeCategory: "Second Place",
    status: "winner",
    submissionDate: "2024-02-20T11:00:00Z",
    totalPoints: 425,
  },
  {
    id: "p3",
    name: "Mike Chen",
    email: "mike@example.com",
    round1Score: 87,
    round2Status: "approved",
    round3Rating: 4.0,
    round3Notes: "Good technical foundation",
    finalScore: 82,
    finalRank: 3,
    isWinner: true,
    prizeCategory: "Third Place",
    status: "winner",
    submissionDate: "2024-02-20T12:00:00Z",
    totalPoints: 410,
  },
  {
    id: "p4",
    name: "Emily Davis",
    email: "emily@example.com",
    round1Score: 85,
    round2Status: "approved",
    round3Rating: 3.8,
    round3Notes: "Needs improvement in communication",
    status: "pending",
    submissionDate: "2024-02-20T13:00:00Z",
  },
];

export const evaluationCriteria: EvaluationCriteria[] = [
  {
    id: "technical",
    name: "Technical Skills",
    description: "Programming ability, problem-solving, code quality",
    maxPoints: 100,
    weight: 0.4,
  },
  {
    id: "communication",
    name: "Communication",
    description: "Clarity, presentation skills, articulation",
    maxPoints: 100,
    weight: 0.25,
  },
  {
    id: "creativity",
    name: "Creativity & Innovation",
    description: "Original thinking, innovative solutions",
    maxPoints: 100,
    weight: 0.2,
  },
  {
    id: "teamwork",
    name: "Teamwork & Collaboration",
    description: "Ability to work in teams, leadership potential",
    maxPoints: 100,
    weight: 0.15,
  },
];

export const prizeCategories = [
  {
    id: "first",
    name: "First Place",
    prize: "$5,000 + Internship",
    color: "text-yellow-600",
  },
  {
    id: "second",
    name: "Second Place",
    prize: "$3,000 + Mentorship",
    color: "text-gray-600",
  },
  {
    id: "third",
    name: "Third Place",
    prize: "$1,000 + Certificate",
    color: "text-orange-600",
  },
  {
    id: "special",
    name: "Special Recognition",
    prize: "Certificate + Swag",
    color: "text-purple-600",
  },
  {
    id: "participation",
    name: "Participation",
    prize: "Certificate",
    color: "text-blue-600",
  },
];
