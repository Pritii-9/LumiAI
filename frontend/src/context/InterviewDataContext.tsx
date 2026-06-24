import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Interview } from '@/types';

interface InterviewContextType {
  interviewInfo: {
    userName: string;
    userEmail: string;
    interviewData: Interview;
  } | null;
  setInterviewInfo: (info: { userName: string; userEmail: string; interviewData: Interview } | null) => void;
}

export const InterviewDataContext = createContext<InterviewContextType>({
  interviewInfo: null,
  setInterviewInfo: () => {},
});

export const InterviewDataProvider = ({ children }: { children: ReactNode }) => {
  const [interviewInfo, setInterviewInfo] = useState<InterviewContextType['interviewInfo']>(null);

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      {children}
    </InterviewDataContext.Provider>
  );
};

export const useInterviewData = () => useContext(InterviewDataContext);
