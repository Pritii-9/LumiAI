import { useInterviewList } from '@/hooks/useInterviewList';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, Video, CheckCircle2, Star, TrendingUp, Loader2 } from 'lucide-react';

const PIE_COLORS = ['#0f6cbd', '#22d3ee', '#818cf8', '#34d399', '#f59e0b'];

const KPI_CARDS = (stats: ReturnType<typeof useInterviewList>['stats']) => [
  {
    label: 'Total Interviews',
    value: stats.totalInterviews,
    icon: Video,
    color: 'from-[#0f6cbd] to-blue-400',
    shadow: 'shadow-blue-500/20',
  },
  {
    label: 'Completed',
    value: stats.completedInterviews,
    icon: CheckCircle2,
    color: 'from-emerald-500 to-teal-400',
    shadow: 'shadow-emerald-500/20',
  },
  {
    label: 'Candidates Interviewed',
    value: stats.totalCandidates,
    icon: Users,
    color: 'from-violet-500 to-purple-400',
    shadow: 'shadow-violet-500/20',
  },
  {
    label: 'Avg. Candidate Score',
    value: stats.avgScore > 0 ? `${stats.avgScore}/10` : '—',
    icon: Star,
    color: 'from-amber-500 to-orange-400',
    shadow: 'shadow-amber-500/20',
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function AnalyticsDashboard() {
  const { stats, loading } = useInterviewList();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#0f6cbd]" />
      </div>
    );
  }

  const kpiCards = KPI_CARDS(stats);

  const completionPieData = [
    { name: 'Completed', value: stats.completedInterviews },
    { name: 'Pending', value: stats.activeInterviews },
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f6cbd]/10">
          <TrendingUp className="h-5 w-5 text-[#0f6cbd]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analytics Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Your hiring pipeline at a glance</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map(({ label, value, icon: Icon, color, shadow }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm"
          >
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${color} opacity-10`} />
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} ${shadow} shadow-lg`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Monthly bar chart */}
        <div className="rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">Interview Activity (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.monthlyData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="created" name="Created" fill="#0f6cbd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion donut */}
        <div className="rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Completion Rate</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={completionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {completionPieData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#0f6cbd' : '#e2e8f0'} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [val, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-2">
              <p className="text-3xl font-bold text-[#0f6cbd]">{stats.completionRate}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Completion rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score distribution */}
      {stats.totalCandidates > 0 && (
        <div className="rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">Candidate Score Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={stats.scoreDistribution} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                {stats.scoreDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
