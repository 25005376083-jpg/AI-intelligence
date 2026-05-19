import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Map, 
  Mic2, 
  Trophy, 
  Rocket, 
  ChevronRight, 
  Github, 
  LayoutDashboard,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from './lib/utils';
import { CAREER_GOALS } from './constants';
import { CareerGoal, ResumeAnalysis, RoadmapData, InterviewQuestions } from './types';

// --- Sub-components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6", className)}>
    {children}
  </div>
);

// --- Views ---

const LandingView = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 max-w-4xl mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
        <Rocket className="w-4 h-4" />
        <span>Hackathon Ready AI Mentor</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
        Scale Your Career with <br />
        <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">AI Intelligence</span>
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Your personal career companion. Improve your resume, master interviews, 
        and follow personalized roadmaps to reach your tech goals.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap items-center justify-center gap-4"
    >
      <button 
        onClick={onStart}
        className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-xl shadow-white/10"
      >
        Get Started Free <ChevronRight className="w-5 h-5" />
      </button>
      <a 
        href="https://github.com" 
        target="_blank" 
        className="px-8 py-4 bg-slate-900 text-white border border-slate-800 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
      >
        <Github className="w-5 h-5" /> Star on GitHub
      </a>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12">
      {[
        { icon: FileText, title: "Resume Analysis", desc: "Get real-time ATS scores and skill gaps." },
        { icon: Map, title: "Career Roadmaps", desc: "Step-by-step paths for any tech role." },
        { icon: Mic2, title: "Mock Interviews", desc: "Practice with AI-generated scenarios." }
      ].map((feature, i) => (
        <Card key={i} className="text-left group hover:border-blue-500/50 transition-colors">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <feature.icon className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white">{feature.title}</h3>
          <p className="text-slate-400 text-sm">{feature.desc}</p>
        </Card>
      ))}
    </div>
  </div>
);

const ResumeView = () => {
  const [text, setText] = useState('');
  const [role, setRole] = useState<CareerGoal>(CAREER_GOALS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text, targetRole: role })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Resume Analyzer</h2>
          <p className="text-slate-400">Optimize your resume for the machines & humans.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="space-y-4 h-fit">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Target Career Path</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as CareerGoal)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CAREER_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Paste Your Resume Content</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-80 bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm resize-none"
              placeholder="Experience... Education... Skills..."
            />
          </div>
          <button 
            disabled={loading || !text}
            onClick={analyze}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
            {loading ? "Analyzing..." : "Analyze with AI"}
          </button>
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500"
              >
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Complete the form to see analysis.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <Card className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <svg className="w-32 h-32">
                      <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                      <circle 
                        className="text-blue-500 transition-all duration-1000" 
                        strokeWidth="8" 
                        strokeDasharray={364}
                        strokeDashoffset={364 - (364 * result.atsScore) / 100}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="58" cx="64" cy="64" 
                        transform="rotate(-90 64 64)"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold text-white">{result.atsScore}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Overall ATS Score</h3>
                  <p className="text-slate-400 text-sm">Based on standard industry algorithms.</p>
                </Card>

                <Card>
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" /> Key Strengths
                  </h4>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {s}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" /> Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {result.missingSkills.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h4 className="font-bold text-white mb-2">Professional Summary Optimization</h4>
                  <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-4 py-2">
                    "{result.professionalSummary}"
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RoadmapView = () => {
  const [goal, setGoal] = useState<CareerGoal>(CAREER_GOALS[0]);
  const [currentSkills, setCurrentSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoadmapData | null>(null);

  const generate = async () => {
  setLoading(true);
  try {
    // Yeh direct aapke naye Vercel api folder par request bhejega
    const res = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetGoal: goal,
        currentSkills: currentSkills.split(',').map(s => s.trim()).filter(Boolean)
      })
    });
    const resData = await res.json();
    setData(resData);
  } catch (e) {
    console.error(e);
    alert("Roadmap generate karne mein koi masala hua.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-bold text-white">Personalized Career Roadmap</h2>
        <p className="text-slate-400">Your AI-generated path to tech mastery.</p>
      </div>

      <Card className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Target Role</label>
          <select 
            value={goal}
            onChange={(e) => setGoal(e.target.value as CareerGoal)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {CAREER_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="md:col-span-5">
          <label className="block text-sm font-medium text-slate-400 mb-2">Current Skills (Optional, comma separated)</label>
          <input 
            type="text"
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Python, React, Git..."
          />
        </div>
        <div className="md:col-span-3">
          <button 
            disabled={loading}
            onClick={generate}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              {data.roadmap.map((step, idx) => (
                <div key={idx} className="relative pl-10 group">
                  {idx !== data.roadmap.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-slate-800 group-hover:bg-blue-600 transition-colors" />
                  )}
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center z-10 group-hover:border-blue-500 transition-colors">
                    <span className="text-white font-bold">{idx + 1}</span>
                  </div>
                  <Card>
                    <h3 className="text-xl font-bold text-white mb-1">{step.phase}</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.topics.map((t, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-xs border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Suggested Projects</h3>
              {data.projects.map((p, i) => (
                <Card key={i} className="relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Trophy className="w-12 h-12 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InterviewView = () => {
  const [role, setRole] = useState<CareerGoal>(CAREER_GOALS[0]);
  const [level, setLevel] = useState('Entry-level');
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState<'setup' | 'practice'>('setup');

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, level })
      });
      const data = await res.json();
      setQuestions(data);
      setMode('practice');
      setCurrentIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const allQuestions = questions ? [...questions.technical, ...questions.behavioral] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-bold text-white">Mock Interview Hall</h2>
        <p className="text-slate-400">Simulate high-stakes interviews with AI-generated scenarios.</p>
      </div>

      {mode === 'setup' ? (
        <Card className="max-w-xl mx-auto space-y-6 text-center py-12">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic2 className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-slate-400">Prepare for common and technical questions tailored to your target role.</p>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Target Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as CareerGoal)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4"
              >
                {CAREER_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Experience Level</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4"
              >
                <option value="Entry-level">Entry-level / University Student</option>
                <option value="Junior">Junior (1-2 years)</option>
                <option value="Mid-level">Mid-level (3-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
            </div>
          </div>
          <button 
            disabled={loading}
            onClick={startSession}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            {loading ? "Generating Session..." : "Start Practice Session"}
          </button>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold">
                Q {currentIdx + 1} of {allQuestions.length}
              </div>
              <span className="text-slate-400 text-sm">{role} · {level}</span>
            </div>
            <button onClick={() => setMode('setup')} className="text-slate-500 hover:text-white transition-colors text-sm">
              End Session
            </button>
          </div>

          <Card className="min-h-[300px] flex flex-col items-center justify-center text-center space-y-8 py-16">
            <motion.h3 
              key={currentIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white max-w-2xl px-4"
            >
              "{allQuestions[currentIdx]}"
            </motion.h3>
            <div className="space-y-4">
              <p className="text-slate-500 text-sm max-w-md">Think about your answer. In a real app, you could record audio here for AI evaluation.</p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-6 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-20"
                >
                  Previous
                </button>
                <button 
                  onClick={() => {
                    if (currentIdx < allQuestions.length - 1) {
                      setCurrentIdx(prev => prev + 1);
                    } else {
                      setMode('setup');
                    }
                  }}
                  className="px-8 py-2 bg-white text-slate-950 font-bold rounded-lg hover:bg-blue-400 transition-colors"
                >
                  {currentIdx === allQuestions.length - 1 ? "Finish Session" : "Next Question"}
                </button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">Expert Tip</h4>
              <p className="text-slate-400 text-sm">Focus on the STAR method (Situation, Task, Action, Result) for behavioral questions.</p>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">Self Evaluation</h4>
              <p className="text-slate-400 text-sm">Did you cover the technical complexity? Mention specific tools and methodologies.</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'resume' | 'roadmap' | 'interview'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Sidebar Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-xl"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Navigation Sidebar */}
        {view !== 'landing' && (
          <aside className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 transition-transform duration-300 lg:translate-x-0 lg:static self-stretch min-h-screen",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl leading-none">Career Mentor</h1>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest tracking-widest">v1.0 Hackathon</span>
              </div>
            </div>

            <nav className="flex-1 space-y-2 pt-4">
              <SidebarItem 
                icon={FileText} label="Resume Analysis" 
                active={view === 'resume'} onClick={() => { setView('resume'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={Map} label="Career Roadmap" 
                active={view === 'roadmap'} onClick={() => { setView('roadmap'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={Mic2} label="Mock Interview" 
                active={view === 'interview'} onClick={() => { setView('interview'); setIsSidebarOpen(false); }} 
              />
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-800">
              <Card className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-white">Pro Tip</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Analyze 3 resumes to unlock "Cover Letter Generator" mode.
                </p>
              </Card>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 w-full min-h-screen transition-all duration-300",
          view !== 'landing' ? "lg:pl-0" : ""
        )}>
          {/* Top Bar for Dashboard views */}
          {view !== 'landing' && (
            <header className="sticky top-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-30 px-8 flex items-center justify-between hidden lg:flex">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium capitalize">{view}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Mentor Score: 650</span>
              </div>
            </header>
          )}

          <div className={cn(
            "p-6 md:p-12",
            view === 'landing' ? "mt-0" : "max-w-7xl mx-auto"
          )}>
            <AnimatePresence mode="wait">
              {view === 'landing' && (
                <motion.div 
                  key="landing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <LandingView onStart={() => setView('resume')} />
                </motion.div>
              )}
              {view === 'resume' && (
                <motion.div 
                  key="resume"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ResumeView />
                </motion.div>
              )}
              {view === 'roadmap' && (
                <motion.div 
                  key="roadmap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RoadmapView />
                </motion.div>
              )}
              {view === 'interview' && (
                <motion.div 
                  key="interview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <InterviewView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer (Simplified) */}
      {view === 'landing' && (
        <footer className="py-8 text-center border-t border-slate-900 mt-20">
          <p className="text-slate-500 text-sm">© 2026 AI Career & Resume Mentor. Built for Hackathons.</p>
        </footer>
      )}
    </div>
  );
}
