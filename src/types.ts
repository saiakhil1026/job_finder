export interface ParsedResume {
  candidateName: string;
  headline: string;
  yearsOfExperience: number;
  primarySkills: string[];
  secondarySkills: string[];
  pastRoles: {
    title: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];
  education: string[];
  certifications?: string[];
  summary: string;
}

export interface UserProfile {
  resumeText: string;
  resumeFileName?: string;
  parsedResume: ParsedResume;
  targetTitles: string[];
  keyTechnologies: string[];
  preferredLocations: string[];
  preferredPortals?: string[];
  remotePreference: 'REMOTE_ONLY' | 'HYBRID' | 'ON_SITE' | 'ANY';
  minSalaryUsd: number;
  targetCompanies: string[];
  excludedKeywords: string[];
  careerLevel: 'MID' | 'SENIOR' | 'STAFF_PRINCIPAL' | 'LEAD_DIRECTOR';
}

export interface MatchBreakdown {
  techStackScore: number;      // 0 - 100
  experienceScore: number;     // 0 - 100
  roleScopeScore: number;      // 0 - 100
  locationScore: number;       // 0 - 100
  overallScore: number;        // 0 - 100
}

export type MatchPriority = 'HIGH_MATCH' | 'STRATEGIC' | 'POTENTIAL' | 'GAP_WARNING';
export type JobStatus = 'NEW' | 'REVIEWED' | 'SAVED' | 'APPLIED' | 'ARCHIVED';

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  employmentType: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  techStack: string[];
  postedDate: string;
  portalSource: 'LinkedIn' | 'Naukri' | 'Indeed' | 'YC WorkAtAStartups' | 'Company Career Portal' | 'Glassdoor' | 'GitHub Jobs' | string;
  url: string;
  matchBreakdown: MatchBreakdown;
  priorityLevel: MatchPriority;
  matchingSkills: string[];
  missingSkills: string[];
  matchRationale: string;
  customBullets: string[];
  status: JobStatus;
  detectedAt: string;
  groundingSources?: { title: string; url: string }[];
}

export interface McpAgentTrace {
  id: string;
  timestamp: string;
  agentName: 'ResumeAnalyzerAgent' | 'MCPWebScoutAgent' | 'CandidateMatchEvaluator' | 'NotificationAlertAgent';
  action: string;
  mcpToolsUsed: string[];
  inputPayload: any;
  outputSummary: any;
  latencyMs: number;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED';
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  jobId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  priorityLevel: MatchPriority;
  message: string;
  isRead: boolean;
}

export interface ScoutConfig {
  autoScanEnabled: boolean;
  scanIntervalMinutes: number;
  minMatchScoreThreshold: number;
  enabledSources: string[];
  lastScanTimestamp?: string;
  totalJobsScouted: number;
}
