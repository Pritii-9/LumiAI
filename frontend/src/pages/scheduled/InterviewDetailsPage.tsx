import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import type { Interview } from '@/types';
import { getAverageRating, formatUtcDate } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle, Star, Download } from 'lucide-react';
import api from '@/lib/api';
import PageHeader from '@/components/PageHeader';

export default function InterviewDetailsPage() {
  const { interview_id } = useParams<{ interview_id: string }>();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.email && interview_id) fetchDetails();
  }, [user?.email, interview_id]);

  const fetchDetails = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.get<Interview>(`/api/interviews/${interview_id}`);
      setInterviewDetail(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load interview details.');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!interviewDetail) return;
    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const element = reportRef.current;
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position -= pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`LumiAI_Report_${interviewDetail.jobPosition.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="mt-5 flex justify-center p-10"><Loader2 className="h-10 w-10 animate-spin text-[#0f6cbd]" /></div>;
  if (error) return <div className="mt-5 p-5 text-center text-red-500">{error}</div>;
  if (!interviewDetail) return <div className="mt-5 p-5 text-center page-subtitle">Interview not found.</div>;

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title={interviewDetail.jobPosition}
        subtitle={`${interviewDetail.duration} · Created ${formatUtcDate(interviewDetail.created_at)}`}
        backTo="/scheduled-interview"
        backLabel="Back to Interviews"
      >
        <button
          onClick={exportPDF}
          disabled={exporting || !interviewDetail.interviewFeedback?.length}
          className="flex items-center gap-2 rounded-xl bg-[#0f6cbd] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f6cbd]/90 disabled:opacity-50 transition shadow-md shadow-blue-500/20"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </PageHeader>

      {/* Screen wrapper & Report container */}
      <div ref={reportRef} className="rounded-[28px] card p-6 space-y-6">
        {/* Report brand header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0f6cbd]">LumiAI · Interview Report</p>
            <h2 className="mt-1 text-xl font-bold page-title">{interviewDetail.jobPosition}</h2>
            <p className="text-sm page-subtitle">{interviewDetail.duration} · {formatUtcDate(interviewDetail.created_at)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f6cbd] text-lg font-black text-white shadow-lg">L</div>
        </div>

          {/* Candidate Feedback */}
          {interviewDetail.interviewFeedback?.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 card-muted p-8 text-center page-subtitle">
              No candidates have completed this interview yet.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {interviewDetail.interviewFeedback.map((fb, idx) => {
                const avg = getAverageRating(fb.feedback?.feedback?.rating || {});
                const rec = fb.feedback?.feedback?.recommendation;
                return (
                  <div key={idx} className="rounded-[24px] card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f6cbd]/10 text-sm font-bold text-[#0f6cbd]">
                          {fb.userName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold page-title">{fb.userName}</p>
                          <p className="text-xs page-subtitle">{fb.userEmail}</p>
                        </div>
                      </div>
                      {rec ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Recommended
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-500/10 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                          <XCircle className="h-3 w-3" /> Not Recommended
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold page-title">{avg}/10</span>
                      <span className="text-xs page-subtitle">avg score</span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {Object.entries(fb.feedback?.feedback?.rating || {}).map(([key, val]) => (
                        <div key={key}>
                          <div className="flex justify-between text-xs page-subtitle mb-1">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="font-medium">{val}/10</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-1.5 rounded-full bg-[#0f6cbd] transition-all duration-700" style={{ width: `${(Number(val) / 10) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm label leading-relaxed">{fb.feedback?.feedback?.summary}</p>
                    {fb.feedback?.feedback?.recommendationMessage && (
                      <p className="mt-2 rounded-xl card-muted p-3 text-xs italic page-subtitle">
                        "{fb.feedback.feedback.recommendationMessage}"
                      </p>
                    )}
                    <p className="mt-3 text-xs page-subtitle">Completed {formatUtcDate(fb.created_at)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
  );
}
