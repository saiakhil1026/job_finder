import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { CandidateForm } from './components/CandidateForm';
import { McpPipelineInspector } from './components/McpPipelineInspector';
import { CustomScanModal } from './components/CustomScanModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { SalaryTrendChart } from './components/SalaryTrendChart';
import {
  INITIAL_USER_PROFILE,
  INITIAL_JOBS,
  INITIAL_TRACES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SCOUT_CONFIG,
} from './initialData';
import { UserProfile, JobOpportunity, McpAgentTrace, NotificationItem, ScoutConfig, JobStatus } from './types';
import {
  Search,
  Filter,
  Bot,
  Zap,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Bookmark,
  Send,
  Sliders,
  Globe,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  // Persistence state in localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ai_scout_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [jobs, setJobs] = useState<JobOpportunity[]>(() => {
    const saved = localStorage.getItem('ai_scout_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [traces, setTraces] = useState<McpAgentTrace[]>(() => {
    const saved = localStorage.getItem('ai_scout_traces');
    return saved ? JSON.parse(saved) : INITIAL_TRACES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ai_scout_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [scoutConfig, setScoutConfig] = useState<ScoutConfig>(() => {
    const saved = localStorage.getItem('ai_scout_config');
    return saved ? JSON.parse(saved) : INITIAL_SCOUT_CONFIG;
  });

  // Navigation & UI controls
  const [activeTab, setActiveTab] = useState<'dashboard' | 'criteria' | 'pipeline' | 'saved' | 'custom'>('dashboard');
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScouting, setIsScouting] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [customSearchPrompt, setCustomSearchPrompt] = useState('');

  // Persist edits to localStorage
  useEffect(() => {
    localStorage.setItem('ai_scout_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ai_scout_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ai_scout_traces', JSON.stringify(traces));
  }, [traces]);

  useEffect(() => {
    localStorage.setItem('ai_scout_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ai_scout_config', JSON.stringify(scoutConfig));
  }, [scoutConfig]);

  // Run Scout Agent API call
  const handleRunScout = async () => {
    setIsScouting(true);
    try {
      const res = await fetch('/api/scout/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          searchPrompt: customSearchPrompt,
          customPortals: scoutConfig.enabledSources,
        }),
      });

      const data = await res.json();

      if (data.jobs && data.jobs.length > 0) {
        // Merge jobs avoiding duplicate IDs
        setJobs((prev) => {
          const existingIds = new Set(prev.map((j) => j.id));
          const newJobs = data.jobs.filter((j: JobOpportunity) => !existingIds.has(j.id));
          return [...newJobs, ...prev];
        });
      }

      if (data.traces) {
        setTraces((prev) => [...data.traces, ...prev]);
      }

      if (data.notifications) {
        setNotifications((prev) => [...data.notifications, ...prev]);
      }

      setScoutConfig((prev) => ({
        ...prev,
        lastScanTimestamp: new Date().toISOString(),
        totalJobsScouted: prev.totalJobsScouted + (data.jobs?.length || 0),
      }));

      setActiveTab('dashboard');
    } catch (err) {
      console.error('Error running Scout Agent:', err);
    } finally {
      setIsScouting(false);
    }
  };

  const handleUpdateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Filter jobs list
  const filteredJobs = jobs.filter((job) => {
    // Tab filtering (Saved & Applied view)
    if (activeTab === 'saved' && job.status !== 'SAVED' && job.status !== 'APPLIED') {
      return false;
    }

    // Search query filter
    const matchesQuery =
      !searchQuery.trim() ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Priority filter
    const matchesPriority = priorityFilter === 'ALL' || job.priorityLevel === priorityFilter;

    // Source filter
    const matchesSource = sourceFilter === 'ALL' || job.portalSource === sourceFilter;

    return matchesQuery && matchesPriority && matchesSource;
  });

  // Calculate high-level stats
  const avgMatchScore = Math.round(
    jobs.reduce((acc, j) => acc + (j.matchBreakdown?.overallScore || 0), 0) / (jobs.length || 1)
  );
  const highMatchesCount = jobs.filter((j) => j.priorityLevel === 'HIGH_MATCH').length;
  const appliedCount = jobs.filter((j) => j.status === 'APPLIED').length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F0F0F0] flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onRunScout={handleRunScout}
        isScouting={isScouting}
        scoutConfig={scoutConfig}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* DASHBOARD OR SAVED JOBS VIEW */}
        {(activeTab === 'dashboard' || activeTab === 'saved') && (
          <div className="space-y-8">
            {/* Top Engineering Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#888]">
                    {activeTab === 'saved' ? 'Saved & Applied' : 'Active Roles'}
                  </span>
                  <div className="text-2xl font-mono font-bold text-white mt-1">
                    {filteredJobs.length} <span className="text-xs text-[#666] font-normal">Positions</span>
                  </div>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] border border-[#333] text-white rounded-sm">
                  <Bot className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#888]">Avg Match Score</span>
                  <div className="text-2xl font-mono font-bold text-[#00FF41] mt-1">
                    {avgMatchScore}%
                  </div>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] border border-[#333] text-[#00FF41] rounded-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#888]">High Priority</span>
                  <div className="text-2xl font-mono font-bold text-white mt-1">
                    {highMatchesCount} <span className="text-xs text-[#00FF41] font-mono">Top Align</span>
                  </div>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] border border-[#333] text-white rounded-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#888]">Applications</span>
                  <div className="text-2xl font-mono font-bold text-white mt-1">
                    {appliedCount} <span className="text-xs text-[#666] font-normal">Tracked</span>
                  </div>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] border border-[#333] text-[#AAA] rounded-sm">
                  <Send className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Salary Trend & Compensation Intelligence Chart */}
            <SalaryTrendChart jobs={jobs} userProfile={userProfile} />

            {/* Scout Trigger Search Bar & Prompt Box */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
                  <span className="text-xs font-mono uppercase tracking-widest text-white">
                    Agent Web Scout Prompt &amp; Filters
                  </span>
                </div>
                <span className="text-[10px] text-[#00FF41] font-mono uppercase">
                  Primary Sources: LinkedIn &amp; Naukri
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#666] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search roles, skills (e.g. MCP, PyTorch, LLM)..."
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm pl-10 pr-4 py-2.5 text-xs text-[#DDD] focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-3 py-2.5 text-xs text-[#DDD] focus:outline-none focus:border-white font-mono"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="HIGH_MATCH">High Match</option>
                    <option value="STRATEGIC">Strategic</option>
                    <option value="POTENTIAL">Potential</option>
                    <option value="GAP_WARNING">Gap Warnings</option>
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-3 py-2.5 text-xs text-[#DDD] focus:outline-none focus:border-white font-mono"
                  >
                    <option value="ALL">All Sources</option>
                    <option value="LinkedIn">LinkedIn (1st Preference)</option>
                    <option value="Naukri">Naukri (1st Preference)</option>
                    <option value="Company Career Portal">Company Portals</option>
                    <option value="YC WorkAtAStartups">YC WorkAtAStartups</option>
                    <option value="Glassdoor">Glassdoor</option>
                    <option value="Indeed">Indeed</option>
                  </select>
                </div>
              </div>

              {/* Custom Prompt Trigger input */}
              <div className="flex items-center space-x-2 pt-2 border-t border-[#2A2A2A]">
                <input
                  type="text"
                  value={customSearchPrompt}
                  onChange={(e) => setCustomSearchPrompt(e.target.value)}
                  placeholder="Ask Scout Agent: e.g. 'Find high-paying staff AI roles at AI startups in SF or Remote...'"
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-xs text-[#DDD] focus:outline-none focus:border-white font-mono"
                />
                <button
                  onClick={handleRunScout}
                  disabled={isScouting}
                  className="px-4 py-2 bg-white hover:bg-[#E0E0E0] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScouting ? 'animate-spin' : ''}`} />
                  <span>{isScouting ? 'Scouting...' : 'Run Web Scout'}</span>
                </button>
              </div>
            </div>

            {/* Jobs Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] border border-[#2A2A2A] rounded-sm space-y-3 font-mono">
                <AlertCircle className="w-8 h-8 text-[#666] mx-auto" />
                <h3 className="text-sm font-serif text-white">No positions match active filters</h3>
                <p className="text-xs text-[#888] max-w-md mx-auto">
                  Clear search filters or trigger &ldquo;Run Web Scout&rdquo; to query active LinkedIn and job portal feeds.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setPriorityFilter('ALL');
                    setSourceFilter('ALL');
                  }}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-wider rounded-sm border border-[#333] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    userProfile={userProfile}
                    onSelect={(j) => setSelectedJob(j)}
                    onUpdateStatus={handleUpdateJobStatus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESUME & CRITERIA TAB */}
        {activeTab === 'criteria' && (
          <CandidateForm
            userProfile={userProfile}
            onSaveProfile={(updated) => setUserProfile(updated)}
            onRunScoutAfterSave={handleRunScout}
          />
        )}

        {/* MCP PIPELINE INSPECTOR TAB */}
        {activeTab === 'pipeline' && <McpPipelineInspector traces={traces} />}

        {/* EVALUATE CUSTOM LINK / TEXT TAB */}
        {activeTab === 'custom' && (
          <CustomScanModal
            userProfile={userProfile}
            onJobEvaluated={(newJob) => {
              setJobs((prev) => [newJob, ...prev]);
              setSelectedJob(newJob);
            }}
          />
        )}
      </main>

      {/* Selected Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          userProfile={userProfile}
          onClose={() => setSelectedJob(null)}
          onUpdateStatus={handleUpdateJobStatus}
        />
      )}

      {/* Notification Drawer */}
      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectJob={(jobId) => {
          const match = jobs.find((j) => j.id === jobId);
          if (match) setSelectedJob(match);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-6 text-center text-xs font-mono text-[#666]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-white" />
            <span className="font-mono uppercase text-[#AAA] text-[11px]">AI Job Scout &amp; MCP Agent Auto-Match Engine</span>
          </div>
          <p className="text-[#666] text-[10px] uppercase">
            Powered by Gemini &amp; MCP Pipeline
          </p>
        </div>
      </footer>
    </div>
  );
}
