export interface CompetitionFormData {
  title: string;
  description: string;
  category: string;
  skillsTested: string[];
  location: string;
  workType: string;
  experienceLevel: string;
  startDate: string;
  endDate: string;
  resultDate: string;
  prize: string;
  registrationFee: string;
  maxParticipants: string;
  projectBrief: string;
  evaluationCriteria: string[];
  termsAndConditions: string[];
  submissionFormats: string[];
  attachments: File[];
  fileLinks: { name: string; url: string }[];
  bannerImage: File | null;
  quizSettings: {
    passingScore: number;
    timeLimit: number;
    randomizeQuestions: boolean;
    showResults: boolean;
  };
}
