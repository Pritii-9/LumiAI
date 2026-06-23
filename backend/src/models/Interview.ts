import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback {
  userName: string;
  userEmail: string;
  feedback: {
    rating: {
      technicalSkills: number;
      communication: number;
      problemSolving: number;
      experience: number;
    };
    summary: string;
    recommendation: boolean;
    recommendationMessage: string;
  };
  recommend: boolean;
  created_at: string;
}

export interface IInterview extends Document {
  interview_id: string;
  userEmail: string;
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string[];
  questionList: Array<{ question: string; type: string }>;
  interviewFeedback: IFeedback[];
  created_at: string;
}

const FeedbackSchema = new Schema<IFeedback>({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  feedback: {
    rating: {
      technicalSkills: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
    },
    summary: { type: String, default: '' },
    recommendation: { type: Boolean, default: false },
    recommendationMessage: { type: String, default: '' },
  },
  recommend: { type: Boolean, default: false },
  created_at: { type: String, default: () => new Date().toISOString() },
});

const InterviewSchema = new Schema<IInterview>({
  interview_id: { type: String, required: true, unique: true, index: true },
  userEmail: { type: String, required: true, index: true },
  jobPosition: { type: String, required: true },
  jobDescription: { type: String, required: true },
  duration: { type: String, required: true },
  type: [{ type: String }],
  questionList: [
    {
      question: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  interviewFeedback: [FeedbackSchema],
  created_at: { type: String, default: () => new Date().toISOString() },
});

const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
export default Interview;
