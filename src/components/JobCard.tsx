import React from 'react';
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bookmark,
  Send,
  ChevronRight,
  Globe,
  FileText,
} from 'lucide-react';
import { JobOpportunity, MatchPriority, JobStatus, UserProfile } from '../types';
import { generateSuitabilityPdfReport } from '../utils/pdfGenerator';
import { getCleanApplyUrl } from '../utils/urlHelper';
import { INITIAL_USER_PROFILE } from '../initialData';

interface JobCardProps {
  job: JobOpportunity;
  userProfile?: UserProfile;
  onSelect: (job: JobOpportunity) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, userProfile, onSelect, onUpdateStatus }) => {
  const getPriorityBadge = (priority: MatchPriority) => {
    switch (priority) {
      case 'HIGH_MATCH':
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF4D00] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] inline-block animate-pulse"></span>
            <span>DIRECT MATCH</span>
          </span>
        );
      case 'STRATEGIC':
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00FF41]">
            STRATEGIC
          </span>
        );
      case 'POTENTIAL':
        return (
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#888]">
            POTENTIAL
          </span>
        );
      case 'GAP_WARNING':
        return (
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF8800]">
            SKILL GAP
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'APPLIED':
        return <span className="text-[9px] font-mono uppercase tracking-wider text-[#00FF41] bg-[#003311] px-2 py-0.5 border border-[#006622] rounded-sm">APPLIED</span>;
      case 'SAVED':
        return <span className="text-[9px] font-mono uppercase tracking-wider text-white bg-[#222] px-2 py-0.5 border border-[#444] rounded-sm">SAVED</span>;
      case 'ARCHIVED':
        return <span className="text-[9px] font-mono uppercase tracking-wider text-[#666] bg-[#111] px-2 py-0.5 border border-[#222] rounded-sm">ARCHIVED</span>;
      default:
        return null;
    }
  };

  const getPortalBadge = (source: string) => {
    const isLinkedIn = /linkedin/i.test(source);
    const isNaukri = /naukri/i.test(source);

    if (isLinkedIn) {
      return (
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0A66C2] bg-[#0A66C2]/10 border border-[#0A66C2]/40 px-2 py-0.5 rounded-sm flex items-center space-x-1">
          <Globe className="w-3 h-3 text-[#0A66C2]" />
          <span>LinkedIn</span>
        </span>
      );
    }

    if (isNaukri) {
      return (
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3366FF] bg-[#3366FF]/10 border border-[#3366FF]/40 px-2 py-0.5 rounded-sm flex items-center space-x-1">
          <Globe className="w-3 h-3 text-[#3366FF]" />
          <span>Naukri</span>
        </span>
      );
    }

    return (
      <span className="text-[10px] font-mono text-[#AAA] uppercase tracking-wider flex items-center space-x-1">
        <Globe className="w-3 h-3 text-[#888]" />
        <span>{source}</span>
      </span>
    );
  };

  const overallScore = job.matchBreakdown?.overallScore || 85;

  const applyUrl = getCleanApplyUrl(job);

  return (
    <div
      id={`job-card-${job.id}`}
      className="bg-[#141414] border border-[#2A2A2A] hover:border-[#444] rounded-sm p-6 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden"
    >
      {/* Editorial Left Accent Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-opacity ${
        job.priorityLevel === 'HIGH_MATCH' ? 'bg-[#FF4D00]' : 'bg-white opacity-40 group-hover:opacity-100'
      }`}></div>

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-3 flex-wrap gap-y-1">
              {getPriorityBadge(job.priorityLevel)}
              {getPortalBadge(job.portalSource)}
              <span className="text-[10px] font-mono text-[#555]">{job.postedDate}</span>
              {getStatusBadge(job.status)}
            </div>

            <h3 className="text-xl font-serif font-medium tracking-tight text-[#F0F0F0] group-hover:text-white transition-colors line-clamp-1 pt-1">
              {job.title}
            </h3>
            <p className="text-xs text-[#888] font-mono uppercase tracking-wider">
              {job.company} • {job.location} {job.isRemote ? '(Remote)' : ''}
            </p>
          </div>

          {/* Large Monospace Score */}
          <div className="text-right shrink-0">
            <div className={`text-3xl font-mono font-bold leading-none tracking-tighter ${
              overallScore >= 90 ? 'text-white' : overallScore >= 80 ? 'text-[#00FF41]' : 'text-[#888]'
            }`}>
              {overallScore}%
            </div>
            <div className="text-[9px] uppercase font-mono text-[#555] tracking-widest mt-1">
              ALIGNMENT
            </div>
          </div>
        </div>

        {/* Compensation & Type Meta */}
        {job.salaryRange && (
          <div className="mb-3 text-xs font-mono text-[#00FF41] flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-[#00FF41]" />
            <span>{job.salaryRange}</span>
            <span className="text-[#555] ml-2">• {job.employmentType}</span>
          </div>
        )}

        {/* Agent Rationale */}
        <p className="text-xs text-[#AAAAAA] leading-relaxed mb-4 bg-[#0A0A0A] p-3 rounded-sm border-l-2 border-[#FFFFFF] font-sans">
          <strong className="text-white font-mono uppercase text-[10px] block mb-1 tracking-wider">Agent Reasoning:</strong>
          {job.matchRationale}
        </p>

        {/* Skill Match vs Gap Chips */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider w-20 shrink-0">Stack Match:</span>
            <div className="flex flex-wrap gap-1 flex-1">
              {(job.matchingSkills || []).slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#333] text-[#CCC] rounded-sm"
                >
                  {skill}
                </span>
              ))}
              {(job.matchingSkills || []).length > 4 && (
                <span className="text-[9px] font-mono text-[#666] self-center">
                  +{(job.matchingSkills || []).length - 4}
                </span>
              )}
            </div>
          </div>

          {(job.missingSkills || []).length > 0 && (
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider w-20 shrink-0">Gaps:</span>
              <div className="flex flex-wrap gap-1 flex-1">
                {(job.missingSkills || []).slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#333] text-[#FF8800] rounded-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onUpdateStatus(job.id, job.status === 'SAVED' ? 'NEW' : 'SAVED')}
            className={`p-2 rounded-sm text-xs font-mono uppercase border transition-colors flex items-center space-x-1 ${
              job.status === 'SAVED'
                ? 'bg-white text-black border-white'
                : 'bg-[#1A1A1A] text-[#888] hover:text-white border-[#333]'
            }`}
            title="Save for Later"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateStatus(job.id, job.status === 'APPLIED' ? 'NEW' : 'APPLIED')}
            className={`p-2 rounded-sm text-xs font-mono uppercase border transition-colors flex items-center space-x-1 ${
              job.status === 'APPLIED'
                ? 'bg-[#00FF41] text-black border-[#00FF41]'
                : 'bg-[#1A1A1A] text-[#888] hover:text-white border-[#333]'
            }`}
            title="Mark as Applied"
          >
            <Send className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => generateSuitabilityPdfReport(job, userProfile || INITIAL_USER_PROFILE)}
            id={`btn-pdf-job-${job.id}`}
            className="p-2 bg-[#1E293B] hover:bg-[#334155] text-[#38BDF8] rounded-sm border border-[#0284C7]/40 text-xs transition-colors"
            title="Download Application Suitability Report PDF"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`btn-apply-job-${job.id}`}
            className="px-2.5 py-1.5 bg-[#0A66C2]/15 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white rounded-sm border border-[#0A66C2]/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 transition-all"
            title={`Apply on ${job.portalSource || 'LinkedIn/Naukri'} in India`}
          >
            <span>Apply ({job.portalSource || 'LinkedIn'})</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <button
          id={`btn-inspect-job-${job.id}`}
          onClick={() => onSelect(job)}
          className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-white hover:text-black text-white font-mono uppercase text-[10px] tracking-wider border border-[#333] rounded-sm flex items-center space-x-1.5 transition-all"
        >
          <Sparkles className="w-3 h-3 text-[#00FF41]" />
          <span>Deep Evaluation</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

