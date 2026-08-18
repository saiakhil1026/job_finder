import React, { useState } from 'react';
import {
  PlusCircle,
  Link2,
  FileText,
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, JobOpportunity } from '../types';

interface CustomScanModalProps {
  userProfile: UserProfile;
  onJobEvaluated: (job: JobOpportunity) => void;
}

export const CustomScanModal: React.FC<CustomScanModalProps> = ({
  userProfile,
  onJobEvaluated,
}) => {
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [evaluatedResult, setEvaluatedResult] = useState<JobOpportunity | null>(null);

  const handleEvaluate = async () => {
    if (!jobUrl.trim() && !jobText.trim()) {
      setErrorMsg('Please enter a job URL or paste job description text.');
      return;
    }

    setErrorMsg('');
    setIsEvaluating(true);
    setEvaluatedResult(null);

    try {
      const res = await fetch('/api/jobs/evaluate-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          jobUrl: jobUrl.trim(),
          jobText: jobText.trim(),
        }),
      });

      const data = await res.json();
      if (data.job) {
        setEvaluatedResult(data.job);
        onJobEvaluated(data.job);
      } else {
        setErrorMsg(data.error || 'Failed to evaluate job posting.');
      }
    } catch (err: any) {
      console.error('Error evaluating job:', err);
      setErrorMsg(err.message || 'Error communicating with evaluation server.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans text-[#F0F0F0]">
      {/* Banner */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 relative overflow-hidden space-y-2">
        <span className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold bg-[#1A1A1A] text-[#00FF41] border border-[#333] rounded-sm inline-flex items-center space-x-1.5">
          <Bot className="w-3.5 h-3.5" />
          <span>ON-DEMAND JOB EVALUATOR</span>
        </span>
        <h1 className="text-2xl font-serif font-medium text-white">Evaluate Custom Job Link or Description</h1>
        <p className="text-xs text-[#AAAAAA] max-w-2xl leading-relaxed">
          Found a specific job posting on LinkedIn or a company portal? Paste the URL or text below. The <strong className="text-white font-mono uppercase text-[11px]">CandidateMatchEvaluator</strong> agent will extract requirements and cross-reference your profile.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-6">
        {/* Job URL Input */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#888] flex items-center space-x-1">
            <Link2 className="w-3.5 h-3.5 text-white" />
            <span>Job Opportunity URL (LinkedIn / Careers Portal)</span>
          </label>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://www.linkedin.com/jobs/view/..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-[#DDD] focus:outline-none focus:border-white font-mono"
          />
        </div>

        {/* Job Text Description Input */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#888] flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-[#00FF41]" />
            <span>Or Paste Raw Job Description Text</span>
          </label>
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste complete job post, requirements, tech stack, and responsibilities..."
            rows={8}
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm p-4 text-xs text-[#DDD] focus:outline-none focus:border-white font-mono"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#1A0000] border border-[#FF3333] text-[#FF8888] text-xs font-mono rounded-sm">
            {errorMsg}
          </div>
        )}

        {/* Evaluate Button */}
        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full py-3.5 bg-white hover:bg-[#E0E0E0] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
          <span>{isEvaluating ? 'Cross-Referencing Qualifications...' : 'Evaluate Job Match Score'}</span>
        </button>

        {/* Evaluated Result Preview */}
        {evaluatedResult && (
          <div className="p-5 bg-[#0A0A0A] rounded-sm border border-[#00FF41] space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold bg-[#1A1A1A] text-[#00FF41] border border-[#333] rounded-sm flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Evaluation Complete</span>
              </span>
              <span className="text-2xl font-mono font-bold text-white">
                {evaluatedResult.matchBreakdown?.overallScore}% Match
              </span>
            </div>

            <div>
              <h3 className="text-base font-serif text-white">{evaluatedResult.title}</h3>
              <p className="text-xs font-mono text-[#888] uppercase">{evaluatedResult.company} • {evaluatedResult.location}</p>
            </div>

            <p className="text-xs text-[#AAA] bg-[#141414] p-3 rounded-sm border border-[#2A2A2A] font-sans">
              <strong className="text-white font-mono uppercase text-[10px] block mb-1">Match Rationale:</strong> {evaluatedResult.matchRationale}
            </p>

            <div className="flex justify-end">
              <span className="text-xs font-mono uppercase text-[#00FF41] flex items-center space-x-1">
                <span>Added to main feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

