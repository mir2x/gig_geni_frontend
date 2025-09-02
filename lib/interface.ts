export interface Competition {
  id: string;
  title: string;
  organizer: string;
  location?: string;
  rating?: number;
  categories: string[]; // e.g. ["IT", "Business"]
  prizes?: string;
  registrationFee?: string;
  startDate?: Date;
  endDate?: Date;
  resultDate?: Date;
  participantCount?: number;
  description?: string;
  skillsTested: string[];
  projectBrief?: string;
  termsAndConditions: string[];
  submissionFormats: string[];
  maxFileSize?: string;
  createdAt?: Date;
  updatedAt?: Date;
//   rounds: CompetitionRound[]; // <-- integrated journey
}

export interface LeaderboardParticipant {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  role: string;
  company?: string;
  totalPoints: number;
  competitionsParticipated: number;
  competitionsWon: number;
  achievements: Achievement[];
  competitionHistory: CompetitionHistory[];
  joinedDate: Date;
  lastActive: Date;
  categories: string[];
  skills: string[];
  rank?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CompetitionHistory {
  competitionId: string;
  competitionTitle: string;
  category: string;
  participatedDate: Date;
  finalRank: number;
  totalParticipants: number;
  pointsEarned: number;
  roundScores: RoundScore[];
  status: 'completed' | 'ongoing' | 'withdrawn';
}

export interface RoundScore {
  roundNumber: number;
  roundType: string;
  score: number;
  maxScore: number;
  evaluatorComments?: string;
  completedDate: Date;
}

export interface LeaderboardFilters {
  category?: string;
  dateRange: '30days' | '90days' | 'alltime';
  sortBy: 'points' | 'competitions';
  sortOrder: 'desc' | 'asc';
  page: number;
  limit: number;
}