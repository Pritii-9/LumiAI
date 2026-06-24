import { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { AlertCircle, Loader2, Mic, MicOff, Phone, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { extractJsonPayload } from '@/lib/utils';
import type { ConversationEntry } from '@/types';
import axios from 'axios';

export default function InterviewStartPage() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const { interview_id } = useParams<{ interview_id: string }>();
  const navigate = useNavigate();

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [callDuration, setCallDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [micAvailable, setMicAvailable] = useState(true);
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [callError, setCallError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');
  const [conversationEntries, setConversationEntries] = useState<ConversationEntry[]>([]);
  const [followUpActive, setFollowUpActive] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');

  const questionList = interviewInfo?.interviewData?.questionList || [];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setBrowserSupported(false); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { setIsListening(true); setCallError(''); };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results).map((r) => r[0]?.transcript || '').join(' ').trim();
      setCurrentTranscript(transcript);
      const latest = event.results[event.results.length - 1];
      if (latest?.isFinal && transcript) submitAnswer(transcript);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (event.error === 'not-allowed') { setMicAvailable(false); setCallError('Microphone permission denied. Use typed answers.'); return; }
      if (event.error !== 'aborted') setCallError('Speech recognition failed. Try again or type your response.');
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => { recognition.stop(); recognitionRef.current = null; };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':');
  };

  const speakText = (text: string, onDone?: () => void) => {
    if (!text) { onDone?.(); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US'; utter.rate = 1;
    utter.onstart = () => setInterviewerSpeaking(true);
    utter.onend = () => { setInterviewerSpeaking(false); onDone?.(); };
    utter.onerror = () => { setInterviewerSpeaking(false); onDone?.(); };
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    if (!recognitionRef.current) { setCallError('Speech recognition not available.'); return; }
    setCurrentTranscript('');
    try { recognitionRef.current.start(); } catch {}
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const isUnableAnswer = (text: string) =>
    /\b(?:unable|cannot|can't|dont\s+know|don't\s+know|not\s+sure|no\s+idea|stuck|unsure)\b/i.test(text);

  const askQuestion = (index: number, customQuestion?: string) => {
    const question = customQuestion || questionList[index]?.question;
    if (!question) { finishInterview(); return; }
    setCurrentQuestionIndex(index);
    setFollowUpActive(Boolean(customQuestion));
    setFollowUpQuestion(customQuestion || '');
    setCurrentTranscript(''); setManualAnswer('');
    speakText(question, () => { if (browserSupported && micAvailable) startListening(); });
  };

  const startInterview = () => {
    if (!questionList.length) { setCallError('No questions found.'); return; }
    setInterviewStarted(true); setInterviewComplete(false); setCallError('');
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    const intro = `Hi ${interviewInfo?.userName || 'there'}, welcome to your ${interviewInfo?.interviewData?.jobPosition} interview.`;
    speakText(intro, () => askQuestion(0));
  };

  const submitAnswer = (answerText: string) => {
    const trimmed = answerText?.trim();
    if (!trimmed) return;
    stopListening();

    const question = followUpActive ? followUpQuestion : questionList[currentQuestionIndex]?.question || 'Question';
    setConversationEntries((prev) => [...prev, { question, answer: trimmed, followUp: followUpActive }]);

    if (followUpActive) {
      setFollowUpActive(false); setFollowUpQuestion('');
      const next = currentQuestionIndex + 1;
      if (next >= questionList.length) { finishInterview(); return; }
      setTimeout(() => askQuestion(next), 500);
      return;
    }

    if (isUnableAnswer(trimmed)) {
      const followUpText = `Thanks for your honesty. Can you describe one step you'd take to improve? Based on: "${question}"`;
      setFollowUpActive(true); setFollowUpQuestion(followUpText);
      setCurrentTranscript(''); setManualAnswer('');
      speakText(followUpText, () => { if (browserSupported && micAvailable) startListening(); });
      return;
    }

    const next = currentQuestionIndex + 1;
    if (next >= questionList.length) { finishInterview(); return; }
    setTimeout(() => askQuestion(next), 500);
  };

  const finishInterview = () => {
    stopListening(); window.speechSynthesis.cancel();
    setInterviewerSpeaking(false); setInterviewComplete(true);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    generateFeedback();
  };

  const stopInterview = () => {
    stopListening(); window.speechSynthesis.cancel();
    setInterviewStarted(false); setInterviewComplete(false);
    setCurrentQuestionIndex(-1); setCurrentTranscript(''); setManualAnswer('');
    setConversationEntries([]); setCallDuration(0);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    navigate(`/interview/${interview_id}`, { replace: true });
  };

  const generateFeedback = async () => {
    setLoading(true);
    try {
      const conversation = JSON.stringify(conversationEntries);
      const result = await axios.post('/api/ai/generate-feedback', { conversation });
      const feedbackJson = extractJsonPayload(result.data.content);

      await axios.post('/api/feedback', {
        interview_id,
        userName: interviewInfo?.userName,
        userEmail: interviewInfo?.userEmail,
        feedback: feedbackJson,
        recommend: feedbackJson?.feedback?.recommendation || false,
      });

      navigate(`/interview/${interview_id}/completed`, { replace: true });
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Failed to generate feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!interviewInfo) {
    return <div className="flex h-screen items-center justify-center text-xl">Loading interview details...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="flex flex-col gap-3 text-xl font-bold text-slate-900 sm:flex-row sm:items-center sm:justify-between">
        AI Interview Session
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base shadow-sm">
          <Timer className="h-4 w-4" /> {formatTime(callDuration)}
        </span>
      </h2>

      {callError && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div><p className="font-semibold">Voice note</p><p className="mt-1 text-sm">{callError}</p></div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* AI Interviewer */}
        <div className="flex h-[360px] flex-col items-center justify-center gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative">
            {interviewerSpeaking && <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#0f6cbd] text-2xl font-black text-white">AI</div>
          </div>
          <h2 className="font-semibold">AI Recruiter</h2>
          <p className="text-center text-sm text-slate-500">
            {followUpActive ? followUpQuestion : currentQuestionIndex >= 0 ? questionList[currentQuestionIndex]?.question : 'Your interview will begin when you press start.'}
          </p>
          {followUpActive && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Follow-up question</span>}
        </div>

        {/* Candidate */}
        <div className="flex h-[360px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {isListening && <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f6cbd] text-2xl font-bold text-white">
                {interviewInfo?.userName?.[0]}
              </div>
            </div>
            <h2 className="font-semibold">{interviewInfo?.userName}</h2>
            <p className="text-center text-sm text-slate-500">
              {isListening ? 'Listening to your answer...' : browserSupported && micAvailable ? 'Ready for your response.' : 'Use the text box below.'}
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Captured answer</p>
              <p className="mt-2 min-h-12 text-sm text-slate-600">{currentTranscript || 'Your answer will appear here.'}</p>
            </div>
            <textarea
              value={manualAnswer}
              onChange={(e) => setManualAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(manualAnswer); } }}
              className="min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
              placeholder="Type your answer here..."
            />
            <p className="text-xs text-slate-400">Press Enter to submit typed answer.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        {!interviewStarted ? (
          <button onClick={startInterview} className="flex items-center gap-2 rounded-full bg-[#0f6cbd] px-6 py-3 text-white hover:bg-[#0f6cbd]/90 transition">
            <Mic className="h-4 w-4" /> Start Interview
          </button>
        ) : (
          <>
            <button onClick={startListening} disabled={isListening || interviewerSpeaking || !browserSupported || !micAvailable || interviewComplete}
              className="flex items-center gap-2 rounded-full bg-slate-700 px-6 py-3 text-white disabled:opacity-50">
              <Mic className="h-4 w-4" /> Listen
            </button>
            <button onClick={stopListening} disabled={!isListening}
              className="flex items-center gap-2 rounded-full bg-slate-200 px-6 py-3 text-slate-800 disabled:opacity-50">
              <MicOff className="h-4 w-4" /> Stop
            </button>
            <button onClick={() => submitAnswer(manualAnswer)} disabled={!manualAnswer.trim() || interviewerSpeaking || interviewComplete}
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white disabled:opacity-50">
              Submit Answer
            </button>
          </>
        )}
        <button onClick={stopInterview} disabled={loading}
          className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-white hover:bg-red-600 transition">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
          End Interview
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-slate-400">
        {loading ? 'Generating feedback...' : interviewerSpeaking ? 'AI interviewer is speaking...' : isListening ? 'Listening...' : interviewStarted ? 'Interview in progress...' : 'Ready to begin.'}
      </p>
    </div>
  );
}
