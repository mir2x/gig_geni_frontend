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