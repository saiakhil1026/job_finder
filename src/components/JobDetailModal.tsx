import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Send,
  MessageSquare,
  HelpCircle,
  Award,
  ExternalLink,
  ChevronRight,
  Bot,
  FileText,
} from 'lucide-react';
import { JobOpportunity, UserProfile } from '../types';
import { generateSuitabilityPdfReport } from '../utils/pdfGenerator';
import { getCleanApplyUrl } from '../utils/urlHelper';

interface JobDetailModalProps {
  job: JobOpportunity;
  userProfile: UserProfile;
  onClose: () => void;
  onUpdateStatus: (jobId: string, status: any) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  userProfile,
  onClose,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'cover_letter' | 'interview_prep'>('analysis');

  // Cover Letter state
  const [coverLetterData, setCoverLetterData] = useState<{ coverLetter?: string; linkedinDm?: string } | null>(null);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [copiedDm, setCopiedDm] = useState(false);

  // Interview Prep state
  const [interviewPrep, setInterviewPrep] = useState<any[] | null>(null);
  const [isGeneratingPrep, setIsGeneratingPrep] = useState(false);

  const generateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      const res = await fetch('/api/generate/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, job }),
      });
      const data = await res.json();
      setCoverLetterData(data);
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const generateInterviewPrep = async () => {
    setIsGeneratingPrep(true);
    try {
      const res = await fetch('/api/generate/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, job }),
      });
      const data = await res.json();
      setInterviewPrep(data.prepQuestions || []);
    } catch (err) {
      console.error('Failed to generate interview prep:', err);
    } finally {
      setIsGeneratingPrep(false);
    }
  };

  const handleCopy = (text: string, type: 'cover' | 'dm') => {
    navigator.clipboard.writeText(text);
    if (type === 'cover') {
      setCopiedCover(true);
      setTimeout(() => setCopiedCover(false), 2000);
    } else {
      setCopiedDm(true);
      setTimeout(() => setCopiedDm(false), 2000);
    }
  };

  const mb = job.matchBreakdown || {
    techStackScore: 85,
    experienceScore: 85,
    roleScopeScore: 85,
    locationScore: 85,
    overallScore: 85,
  };

  const applyUrl = getCleanApplyUrl(job);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#141414] border border-[#2A2A2A] rounded-sm shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col font-sans text-[#F0F0F0]">
        {/* Modal Header */}
        <div className="p-6 bg-[#0A0A0A] border-b border-[#2A2A2A] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-widest text-[#888] mb-1">
              <Bot className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>AI CROSS-REFERENCE EVALUATION ENGINE</span>
              <span className="text-[#444]">•</span>
              <span className="text-[#AAA]">{job.portalSource}</span>
            </div>
            <h2 className="text-2xl font-serif text-white">{job.title}</h2>
            <div className="flex items-center space-x-4 text-xs font-mono uppercase text-[#888] mt-1">
              <div className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-[#666]" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#666]" />
                <span>{job.location}</span>
              </div>
              {job.salaryRange && (
                <div className="flex items-center space-x-1 text-[#00FF41]">
                  <span className="font-bold text-xs bg-[#00FF41]/10 px-1 rounded border border-[#00FF41]/30">₹</span>
                  <span>{job.salaryRange}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#888] hover:text-white rounded-sm hover:bg-[#1A1A1A] transition-colors border border-transparent hover:border-[#333]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center px-6 bg-[#0A0A0A] border-b border-[#2A2A2A] text-xs font-mono">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 px-4 border-b-2 uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'analysis'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Match Rationale</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cover_letter');
              if (!coverLetterData && !isGeneratingCoverLetter) generateCoverLetter();
            }}
            className={`py-3 px-4 border-b-2 uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'cover_letter'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>AI Pitch &amp; Cover Letter</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('interview_prep');
              if (!interviewPrep && !isGeneratingPrep) generateInterviewPrep();
            }}
            className={`py-3 px-4 border-b-2 uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'interview_prep'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interview Coach</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: MATCH BREAKDOWN & RATIONALE */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Overall Match Radar Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 bg-[#0A0A0A] rounded-sm border border-[#333]">
                <div className="md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#2A2A2A] pb-4 md:pb-0 md:pr-4">
                  <span className="text-4xl font-mono font-bold text-white tracking-tighter">
                    {mb.overallScore}%
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#888] mt-1">
                    Neural Score
                  </span>
                </div>

                <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#666] uppercase text-[9px] block mb-1">Tech Stack</span>
                    <div className="w-full bg-[#1A1A1A] h-1.5 rounded-none overflow-hidden mb-1">
                      <div className="bg-[#00FF41] h-full" style={{ width: `${mb.techStackScore}%` }}></div>
                    </div>
                    <span className="font-bold text-white text-xs">{mb.techStackScore}%</span>
                  </div>

                  <div>
                    <span className="text-[#666] uppercase text-[9px] block mb-1 font-mono">Experience</span>
                    <div className="w-full bg-[#1A1A1A] h-1.5 rounded-none overflow-hidden mb-1">
                      <div className="bg-white h-full" style={{ width: `${mb.experienceScore}%` }}></div>
                    </div>
                    <span className="font-bold text-white text-xs">{mb.experienceScore}%</span>
                  </div>

                  <div>
                    <span className="text-[#666] uppercase text-[9px] block mb-1">Role Scope</span>
                    <div className="w-full bg-[#1A1A1A] h-1.5 rounded-none overflow-hidden mb-1">
                      <div className="bg-[#AAA] h-full" style={{ width: `${mb.roleScopeScore}%` }}></div>
                    </div>
                    <span className="font-bold text-white text-xs">{mb.roleScopeScore}%</span>
                  </div>

                  <div>
                    <span className="text-[#666] uppercase text-[9px] block mb-1">Location</span>
                    <div className="w-full bg-[#1A1A1A] h-1.5 rounded-none overflow-hidden mb-1">
                      <div className="bg-[#FF8800] h-full" style={{ width: `${mb.locationScore}%` }}></div>
                    </div>
                    <span className="font-bold text-white text-xs">{mb.locationScore}%</span>
                  </div>
                </div>
              </div>

              {/* Rationale Box */}
              <div className="p-4 bg-[#0A0A0A] border-l-2 border-white rounded-sm space-y-1">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>Agent Cross-Reference Rationale</span>
                </h4>
                <p className="text-xs text-[#AAAAAA] leading-relaxed font-sans">{job.matchRationale}</p>
              </div>

              {/* Matching Skills vs Skill Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333]">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#00FF41] flex items-center space-x-2 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matching Strengths</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(job.matchingSkills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#333] text-[#CCC] rounded-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333]">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#FF8800] flex items-center space-x-2 mb-3">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Target Learning Gaps</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(job.missingSkills || []).length > 0 ? (
                      (job.missingSkills || []).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#333] text-[#FF8800] rounded-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#666] font-mono italic">No critical skill gaps identified.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Custom Resume Bullets */}
              {job.customBullets && job.customBullets.length > 0 && (
                <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333] space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white">
                    Recommended Resume Bullet Customizations:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-[#AAAAAA] space-y-1.5 font-sans">
                    {job.customBullets.map((b, i) => (
                      <li key={i} className="leading-relaxed">
                        &ldquo;{b}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Job Requirements & Description */}
              <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333] space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white">Role Description &amp; Requirements</h4>
                <p className="text-xs text-[#AAAAAA] whitespace-pre-line leading-relaxed font-sans">{job.description}</p>
                {job.requirements && job.requirements.length > 0 && (
                  <div className="pt-2 border-t border-[#2A2A2A]">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#888] block mb-1.5">Key Requirements:</span>
                    <ul className="list-disc list-inside text-xs text-[#AAAAAA] space-y-1 font-sans">
                      {job.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AI COVER LETTER & RECRUITER PITCH */}
          {activeTab === 'cover_letter' && (
            <div className="space-y-6">
              {isGeneratingCoverLetter ? (
                <div className="p-12 text-center text-[#888] space-y-3 font-mono">
                  <Bot className="w-6 h-6 text-white animate-bounce mx-auto" />
                  <p className="text-xs uppercase tracking-wider">Generating Cover Letter &amp; Recruiter Pitch...</p>
                </div>
              ) : coverLetterData ? (
                <div className="space-y-6">
                  {/* LinkedIn DM Pitch */}
                  <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-white">
                        1. LinkedIn Direct Message (Short Pitch)
                      </h4>
                      <button
                        onClick={() => handleCopy(coverLetterData.linkedinDm || '', 'dm')}
                        className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#1A1A1A] hover:bg-white hover:text-black text-white rounded-sm border border-[#333] flex items-center space-x-1"
                      >
                        {copiedDm ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDm ? 'Copied' : 'Copy Pitch'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-[#141414] rounded-sm text-xs font-mono text-[#CCC] whitespace-pre-wrap leading-relaxed border border-[#2A2A2A]">
                      {coverLetterData.linkedinDm}
                    </div>
                  </div>

                  {/* Full Cover Letter */}
                  <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[#00FF41]">
                        2. Formal Application Cover Letter
                      </h4>
                      <button
                        onClick={() => handleCopy(coverLetterData.coverLetter || '', 'cover')}
                        className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#1A1A1A] hover:bg-white hover:text-black text-white rounded-sm border border-[#333] flex items-center space-x-1"
                      >
                        {copiedCover ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCover ? 'Copied' : 'Copy Letter'}</span>
                      </button>
                    </div>
                    <div className="p-4 bg-[#141414] rounded-sm text-xs font-sans text-[#DDD] whitespace-pre-wrap leading-relaxed border border-[#2A2A2A]">
                      {coverLetterData.coverLetter}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <button
                    onClick={generateCoverLetter}
                    className="px-5 py-2.5 bg-white hover:bg-[#E0E0E0] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm"
                  >
                    Generate Application Pitch
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTERVIEW PREP COACH */}
          {activeTab === 'interview_prep' && (
            <div className="space-y-6">
              {isGeneratingPrep ? (
                <div className="p-12 text-center text-[#888] space-y-3 font-mono">
                  <Bot className="w-6 h-6 text-white animate-bounce mx-auto" />
                  <p className="text-xs uppercase tracking-wider">
                    Simulating interview scenarios for {job.company}...
                  </p>
                </div>
              ) : interviewPrep && interviewPrep.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-xs font-mono text-[#888] uppercase tracking-wider">
                    Targeted preparation cards based on {job.company}&apos;s stack:
                  </div>

                  {interviewPrep.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333] space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold bg-[#1A1A1A] text-white border border-[#333] rounded-sm">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#666]">Q#{idx + 1}</span>
                      </div>
                      <h4 className="text-xs font-serif font-medium text-white">{item.question}</h4>

                      <div className="text-xs text-[#AAA] bg-[#141414] p-3 rounded-sm border border-[#2A2A2A] font-sans">
                        <span className="font-mono text-[10px] uppercase text-[#00FF41] block mb-1 tracking-wider">Key Talking Points:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[#CCC]">
                          {(item.keyTalkingPoints || []).map((tp: string, i: number) => (
                            <li key={i}>{tp}</li>
                          ))}
                        </ul>
                      </div>

                      {item.recommendedStarResponse && (
                        <p className="text-xs text-[#888] italic bg-[#141414] p-2.5 rounded-sm border border-[#2A2A2A] font-sans">
                          <strong className="text-white not-italic font-mono uppercase text-[10px] block mb-0.5">STAR Framework Guide:</strong> &ldquo;
                          {item.recommendedStarResponse}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <button
                    onClick={generateInterviewPrep}
                    className="px-5 py-2.5 bg-white hover:bg-[#E0E0E0] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm"
                  >
                    Generate Technical Interview Coach
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0A0A0A] border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateStatus(job.id, 'SAVED')}
              className="px-3.5 py-1.5 text-xs font-mono uppercase bg-[#1A1A1A] hover:bg-white hover:text-black text-white rounded-sm border border-[#333] transition-colors"
            >
              Save Job
            </button>
            <button
              onClick={() => onUpdateStatus(job.id, 'APPLIED')}
              className="px-3.5 py-1.5 text-xs font-mono uppercase bg-[#00FF41] text-black hover:bg-[#00CC33] rounded-sm transition-colors font-bold"
            >
              Mark Applied
            </button>
            <button
              onClick={() => generateSuitabilityPdfReport(job, userProfile)}
              id={`modal-btn-download-pdf-${job.id}`}
              className="px-3.5 py-1.5 text-xs font-mono uppercase bg-[#1E293B] hover:bg-[#334155] text-[#38BDF8] rounded-sm border border-[#0284C7]/40 flex items-center space-x-1.5 transition-colors font-bold shadow-sm"
              title="Generate and Download Application Suitability Report PDF"
            >
              <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Suitability PDF</span>
            </button>
          </div>

          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`modal-btn-apply-${job.id}`}
            className="px-4 py-2 bg-[#0A66C2] hover:bg-[#084e96] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-sm flex items-center space-x-2 transition-colors shadow-md"
          >
            <span>Apply on {job.portalSource || 'LinkedIn'} (India)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

