import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Briefcase,
  Code2,
  MapPin,
  DollarSign,
  Building,
  Filter,
  UserCheck,
  Bot,
} from 'lucide-react';
import { UserProfile, ParsedResume } from '../types';

interface CandidateFormProps {
  userProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onRunScoutAfterSave: () => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({
  userProfile,
  onSaveProfile,
  onRunScoutAfterSave,
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rawText, setRawText] = useState(userProfile.resumeText || '');

  // Form inputs temporary state
  const [newTitle, setNewTitle] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCompany, setNewCompany] = useState('');

  // Process file upload (PDF, DOCX, DOC, TXT, RTF, etc.)
  const processFile = async (file: File) => {
    setIsParsing(true);
    setParseSuccess(false);
    setParseError(null);

    try {
      const reader = new FileReader();

      reader.onerror = () => {
        setParseError('Failed to read file from disk.');
        setIsParsing(false);
      };

      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/resume/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64: base64,
              fileName: file.name,
              mimeType: file.type,
            }),
          });

          const data = await res.json();

          if (!res.ok || data.error) {
            setParseError(data.error || 'Server returned an error parsing resume.');
            setIsParsing(false);
            return;
          }

          if (data.parsedResume) {
            const updatedRawText = data.extractedRawText || rawText;
            if (data.extractedRawText) {
              setRawText(data.extractedRawText);
            }

            const updatedProfile: UserProfile = {
              ...profile,
              resumeFileName: file.name,
              resumeText: updatedRawText,
              parsedResume: data.parsedResume,
              keyTechnologies: Array.from(
                new Set([...profile.keyTechnologies, ...(data.parsedResume.primarySkills || [])])
              ),
            };

            setProfile(updatedProfile);
            onSaveProfile(updatedProfile);
            setParseSuccess(true);
          } else {
            setParseError('Could not extract structured candidate details from file.');
          }
        } catch (err: any) {
          console.error('Error during parse request:', err);
          setParseError(err.message || 'Failed to send resume to parsing server.');
        } finally {
          setIsParsing(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Error processing file:', err);
      setParseError(err.message || 'An error occurred during file selection.');
      setIsParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = ''; // Reset input so re-uploading the same file works
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleParseText = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    setParseSuccess(false);
    setParseError(null);

    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: rawText, fileName: 'Pasted_Resume_Text.txt' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setParseError(data.error || 'Failed to parse resume text.');
        return;
      }

      if (data.parsedResume) {
        const updatedProfile: UserProfile = {
          ...profile,
          resumeText: rawText,
          parsedResume: data.parsedResume,
          keyTechnologies: Array.from(
            new Set([...profile.keyTechnologies, ...(data.parsedResume.primarySkills || [])])
          ),
        };
        setProfile(updatedProfile);
        onSaveProfile(updatedProfile);
        setParseSuccess(true);
      }
    } catch (err: any) {
      console.error('Error parsing resume text:', err);
      setParseError(err.message || 'Network error while parsing text.');
    } finally {
      setIsParsing(false);
    }
  };

  const addItem = (field: 'targetTitles' | 'keyTechnologies' | 'preferredLocations' | 'targetCompanies', val: string) => {
    if (!val.trim()) return;
    setProfile((prev) => ({
      ...prev,
      [field]: Array.from(new Set([...(prev[field] || []), val.trim()])),
    }));
  };

  const removeItem = (field: 'targetTitles' | 'keyTechnologies' | 'preferredLocations' | 'targetCompanies', idx: number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSaveAndScout = () => {
    onSaveProfile(profile);
    onRunScoutAfterSave();
  };

  const pr = profile.parsedResume || {} as ParsedResume;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
          <div>
            <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] inline-block mr-2"></span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#999]">ONBOARDING &amp; CONTEXT VECTOR STORE</span>
            </div>
            <h1 className="text-3xl font-serif italic text-white tracking-tight">Candidate Context Vector &amp; Reasoning Criteria</h1>
            <p className="text-xs text-[#888] font-mono uppercase tracking-wider mt-1 max-w-2xl">
              Resume Context is auto-parsed into skill matrices and cross-referenced by autonomous reasoning agents.
            </p>
          </div>

          <button
            onClick={handleSaveAndScout}
            className="px-5 py-2.5 bg-white hover:bg-[#E0E0E0] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Context &amp; Execute Scout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Resume Upload & Parsing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Resume Upload Box */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-4">
            <h2 className="text-xs uppercase font-mono tracking-widest text-[#666] flex items-center space-x-2">
              <Upload className="w-4 h-4 text-white" />
              <span>1. RESUME SOURCE PAYLOAD</span>
            </h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed transition-all rounded-sm p-6 text-center cursor-pointer relative group ${
                isDragging
                  ? 'border-white bg-[#1A1A1A]'
                  : isParsing
                  ? 'border-[#00FF41] bg-[#0A1A0D]'
                  : 'border-[#333] hover:border-white bg-[#0A0A0A]'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx,.rtf,.md"
                onChange={handleFileUpload}
                disabled={isParsing}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <FileText
                className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                  isParsing
                    ? 'text-[#00FF41] animate-bounce'
                    : 'text-[#666] group-hover:text-white'
                }`}
              />
              <p className="text-xs font-mono uppercase tracking-wider text-[#F0F0F0]">
                {isParsing
                  ? 'Processing & Extracting Resume Vector...'
                  : isDragging
                  ? 'Drop Resume File Here'
                  : 'Select or Drop PDF, Word, or Text CV'}
              </p>
              <p className="text-[10px] text-[#666] mt-1 font-mono">
                Supports .PDF, .DOCX, .DOC, .TXT, .RTF
              </p>
              {profile.resumeFileName && !isParsing && (
                <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#333] text-white text-[10px] font-mono rounded-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>{profile.resumeFileName}</span>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {parseError && (
              <div className="p-3 bg-[#1A0000] border border-[#FF3333] text-[#FF8888] text-xs font-mono rounded-sm flex items-start space-x-2">
                <span className="font-bold shrink-0">ERR:</span>
                <span>{parseError}</span>
              </div>
            )}

            {/* Resume Text Area */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-[#888] block">
                Or Paste Raw Text Context:
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste complete resume text..."
                rows={6}
                className="w-full bg-[#0A0A0A] border border-[#333] rounded-sm p-3 text-xs text-[#F0F0F0] focus:outline-none focus:border-white font-mono"
              />
              <button
                onClick={handleParseText}
                disabled={isParsing || !rawText.trim()}
                className="w-full py-2 bg-[#1A1A1A] hover:bg-white hover:text-black text-white font-mono uppercase text-xs tracking-wider rounded-sm border border-[#333] flex items-center justify-center space-x-2 disabled:opacity-50 transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isParsing ? 'animate-spin' : 'text-[#00FF41]'}`} />
                <span>{isParsing ? 'Extracting Vector Features...' : 'Parse Resume Content'}</span>
              </button>
            </div>

            {parseSuccess && (
              <div className="p-3 bg-[#002208] border border-[#006622] text-[#00FF41] text-xs font-mono rounded-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0" />
                <span>Vector extraction completed! Memory updated.</span>
              </div>
            )}
          </div>

          {/* Parsed Resume Preview Summary */}
          {pr.candidateName && (
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-[#00FF41]" />
                  <span>Parsed Candidate Vector</span>
                </h3>
                <span className="text-[10px] font-mono text-[#666]">
                  {pr.yearsOfExperience || 0} YOE
                </span>
              </div>

              <div>
                <h4 className="text-xl font-serif text-white">{pr.candidateName}</h4>
                <p className="text-xs text-[#888] font-mono mt-0.5">{pr.headline}</p>
              </div>

              <p className="text-xs text-[#AAAAAA] bg-[#0A0A0A] p-3 rounded-sm border-l-2 border-white font-sans line-clamp-3">
                {pr.summary}
              </p>

              {/* Extracted Skills */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666] block mb-2">
                  Extracted Core Vector Features:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(pr.primarySkills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#333] text-[#CCC] rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Target Job Criteria Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#666] border-b border-[#2A2A2A] pb-3 flex items-center space-x-2">
            <Filter className="w-4 h-4 text-white" />
            <span>2. AUTOMATED SCOUT CONSTRAINTS</span>
          </h2>

          {/* Target Job Titles */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#888] block">
              Target Role Titles
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Senior AI Engineer, Staff ML Systems"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('targetTitles', newTitle);
                    setNewTitle('');
                  }
                }}
                className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-sm px-3 py-2 text-xs text-[#F0F0F0] focus:outline-none focus:border-white font-mono"
              />
              <button
                onClick={() => {
                  addItem('targetTitles', newTitle);
                  setNewTitle('');
                }}
                className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black text-white rounded-sm text-xs font-mono uppercase border border-[#333]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(profile.targetTitles || []).map((title, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#1A1A1A] text-white rounded-sm border border-[#333] flex items-center space-x-1.5"
                >
                  <span>{title}</span>
                  <button
                    onClick={() => removeItem('targetTitles', idx)}
                    className="text-[#666] hover:text-[#FF4D00]"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Key Technologies & Stack */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#888] block">
              Core Tech Vectors / Stack
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. PyTorch, Model Context Protocol (MCP), CUDA"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('keyTechnologies', newSkill);
                    setNewSkill('');
                  }
                }}
                className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-sm px-3 py-2 text-xs text-[#F0F0F0] focus:outline-none focus:border-white font-mono"
              />
              <button
                onClick={() => {
                  addItem('keyTechnologies', newSkill);
                  setNewSkill('');
                }}
                className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black text-[#00FF41] rounded-sm text-xs font-mono uppercase border border-[#333]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(profile.keyTechnologies || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#1A1A1A] text-[#00FF41] rounded-sm border border-[#333] flex items-center space-x-1.5"
                >
                  <span>{tech}</span>
                  <button
                    onClick={() => removeItem('keyTechnologies', idx)}
                    className="text-[#666] hover:text-[#FF4D00]"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Locations & Remote Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#888] block">
                Target Locations (India &amp; Global)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Hyderabad, Gurgaon, Remote India"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('preferredLocations', newLocation);
                      setNewLocation('');
                    }
                  }}
                  className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-sm px-3 py-2 text-xs text-[#F0F0F0] focus:outline-none focus:border-white font-mono"
                />
                <button
                  onClick={() => {
                    addItem('preferredLocations', newLocation);
                    setNewLocation('');
                  }}
                  className="px-3 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black text-white rounded-sm text-xs font-mono uppercase border border-[#333]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(profile.preferredLocations || []).map((loc, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#1A1A1A] text-[#AAA] rounded-sm border border-[#333] flex items-center space-x-1"
                  >
                    <span>{loc}</span>
                    <button onClick={() => removeItem('preferredLocations', idx)}>
                      <Trash2 className="w-3 h-3 text-[#666] hover:text-[#FF4D00]" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#888] block">
                Workplace Preference
              </label>
              <select
                value={profile.remotePreference}
                onChange={(e) =>
                  setProfile({ ...profile, remotePreference: e.target.value as any })
                }
                className="w-full bg-[#0A0A0A] border border-[#333] rounded-sm px-3 py-2 text-xs text-[#F0F0F0] focus:outline-none focus:border-white font-mono"
              >
                <option value="REMOTE_ONLY">Remote Only (India / Global)</option>
                <option value="HYBRID">Hybrid Allowed</option>
                <option value="ON_SITE">On-Site</option>
                <option value="ANY">Any / No Preference</option>
              </select>
            </div>
          </div>

          {/* Minimum Salary INR (LPA) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888]">
                Minimum Target Compensation (INR / LPA):
              </span>
              <span className="text-[#00FF41] font-bold text-sm">
                ₹{(() => {
                  const val = profile.minSalaryUsd || 28;
                  if (val >= 100000) return Math.round(val / 100000);
                  if (val >= 1000) return Math.round(val / 1000);
                  return val;
                })()} LPA <span className="text-[10px] text-[#888] font-normal">(₹{(
                  ((profile.minSalaryUsd || 28) >= 100000 ? Math.round((profile.minSalaryUsd || 28) / 100000) : (profile.minSalaryUsd || 28)) * 100000
                ).toLocaleString('en-IN')} / yr)</span>
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={1}
              value={(() => {
                const val = profile.minSalaryUsd || 28;
                if (val >= 100000) return Math.round(val / 100000);
                if (val >= 1000) return Math.round(val / 1000);
                return val;
              })()}
              onChange={(e) => setProfile({ ...profile, minSalaryUsd: Number(e.target.value) })}
              className="w-full accent-[#00FF41] bg-[#0A0A0A] h-2 rounded-none cursor-pointer"
            />
          </div>

          {/* Preferred Companies */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#888] block">
              Target Companies (India Tech &amp; Global Hubs)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="e.g. TensorScale India, Flipkart, Google India, PhonePe"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('targetCompanies', newCompany);
                    setNewCompany('');
                  }
                }}
                className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-sm px-3 py-2 text-xs text-[#F0F0F0] focus:outline-none focus:border-white font-mono"
              />
              <button
                onClick={() => {
                  addItem('targetCompanies', newCompany);
                  setNewCompany('');
                }}
                className="px-3 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black text-white rounded-sm text-xs font-mono uppercase border border-[#333]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(profile.targetCompanies || []).map((company, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#1A1A1A] text-white rounded-sm border border-[#333] flex items-center space-x-1.5"
                >
                  <span>{company}</span>
                  <button onClick={() => removeItem('targetCompanies', idx)}>
                    <Trash2 className="w-3 h-3 text-[#666] hover:text-[#FF4D00]" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Job Board Portals */}
          <div className="space-y-3 pt-2 border-t border-[#2A2A2A]">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#888] block">
                Primary Job Portals (Scout Preference)
              </label>
              <span className="text-[9px] font-mono uppercase text-[#00FF41]">
                First Preference: LinkedIn &amp; Naukri
              </span>
            </div>
            <p className="text-[11px] text-[#AAA] font-sans">
              The MCP Web Scout prioritizes live listings sourced from these job boards.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: 'LinkedIn', priority: '1st Preference', color: 'border-[#0A66C2] text-[#0A66C2] bg-[#0A66C2]/10' },
                { name: 'Naukri', priority: '1st Preference', color: 'border-[#3366FF] text-[#3366FF] bg-[#3366FF]/10' },
                { name: 'Company Career Portal', priority: 'Direct', color: 'border-[#333] text-[#CCC] bg-[#1A1A1A]' },
                { name: 'YC WorkAtAStartups', priority: 'Startups', color: 'border-[#333] text-[#CCC] bg-[#1A1A1A]' },
                { name: 'Glassdoor', priority: 'Reviews', color: 'border-[#333] text-[#CCC] bg-[#1A1A1A]' },
                { name: 'Indeed', priority: 'General', color: 'border-[#333] text-[#CCC] bg-[#1A1A1A]' },
              ].map((portal) => {
                const isSelected = (profile.preferredPortals || ['LinkedIn', 'Naukri', 'Company Career Portal']).includes(portal.name);
                return (
                  <button
                    key={portal.name}
                    type="button"
                    onClick={() => {
                      const current = profile.preferredPortals || ['LinkedIn', 'Naukri', 'Company Career Portal'];
                      const updated = isSelected
                        ? current.filter((p) => p !== portal.name)
                        : [...current, portal.name];
                      setProfile({ ...profile, preferredPortals: updated });
                    }}
                    className={`p-2.5 rounded-sm border text-left font-mono transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${portal.color} border-opacity-100`
                        : 'border-[#222] bg-[#0A0A0A] text-[#555] hover:border-[#444]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{portal.name}</span>
                      <span className="text-[8px] uppercase tracking-wider opacity-80 px-1 py-0.2 rounded border border-current">
                        {portal.priority}
                      </span>
                    </div>
                    <span className="text-[9px] mt-1 opacity-75">
                      {isSelected ? '✓ Enabled' : 'Disabled'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save & Run Scout CTA */}
          <div className="pt-4 border-t border-[#2A2A2A]">
            <button
              onClick={handleSaveAndScout}
              className="w-full py-3 bg-white hover:bg-[#E0E0E0] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Context &amp; Execute MCP Scout Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

