export interface InterviewQuestion {
  question: string;
  type: string;
}

export interface FeedbackRating {
  [key: string]: number;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  experience: number;
}

export interface FeedbackData {
  rating: FeedbackRating;
  summary: string;
  recommendation: boolean;
  recommendationMessage: string;
}

export interface CandidateFeedback {
  userName: string;
  userEmail: string;
  feedback: {
    feedback: FeedbackData;
  };
  recommend: boolean;
  created_at: string;
}

export interface Interview {
  _id?: string;
  interview_id: string;
  userEmail: string;
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string[];
  questionList: InterviewQuestion[];
  interviewFeedback: CandidateFeedback[];
  created_at: string;
}

export interface User {
  name: string;
  email: string;
  image?: string;
  picture?: string;
}

export interface InterviewFormData {
  jobPosition?: string;
  jobDescription?: string;
  duration?: string;
  type?: string[];
  resumeFile?: File;
}

export interface ConversationEntry {
  question: string;
  answer: string;
  followUp: boolean;
}
