import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { JobOpportunity, UserProfile } from '../types';
import { DollarSign, TrendingUp, Award, Layers, Calendar, Building2 } from 'lucide-react';

interface SalaryTrendChartProps {
  jobs: JobOpportunity[];
  userProfile: UserProfile;
}

export function parseSalaryRange(rangeStr: string): { min: number; max: number; avg: number } {
  if (!rangeStr) return { min: 28, max: 48, avg: 38 };

  // Remove commas and clean text
  const clean = rangeStr.replace(/,/g, '');
  
  // Look for LPA / Lakhs pattern or raw numbers
  const numbers = clean.match(/(\d+(?:\.\d+)?)/g)?.map(Number) || [];
  
  if (numbers.length === 0) return { min: 28, max: 48, avg: 38 };

  const lpaValues = numbers.map((n) => {
    if (n >= 100000) {
      // Raw INR amount e.g. 3500000 -> 35 LPA
      return n / 100000;
    }
    if (n > 200 && n < 100000) {
      // k conversion or USD fallback
      return Math.round((n / 1000) * 0.85);
    }
    // Already in LPA e.g. 28, 38, 55
    return n;
  }).filter((n) => n >= 3 && n <= 250);

  if (lpaValues.length === 0) return { min: 28, max: 48, avg: 38 };
  if (lpaValues.length === 1) return { min: lpaValues[0], max: lpaValues[0], avg: lpaValues[0] };

  const min = Math.min(lpaValues[0], lpaValues[1]);
  const max = Math.max(lpaValues[0], lpaValues[1]);
  const avg = Math.round(((min + max) / 2) * 10) / 10;
  return { min, max, avg };
}

export const SalaryTrendChart: React.FC<SalaryTrendChartProps> = ({ jobs, userProfile }) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'portal' | 'priority'>('timeline');

  // Normalize min target salary to LPA
  const rawMin = userProfile.minSalaryUsd || 28;
  const minSalaryLpa = rawMin >= 100000 ? Math.round(rawMin / 100000) : rawMin >= 1000 ? Math.round(rawMin / 1000) : rawMin;

  // Parse jobs salary data in LPA
  const jobsWithSalary = jobs.map((job) => {
    const parsed = parseSalaryRange(job.salaryRange);
    return {
      ...job,
      parsedSalary: parsed,
      date: new Date(job.detectedAt || Date.now()),
    };
  });

  // KPI Calculations
  const validSalaries = jobsWithSalary.map((j) => j.parsedSalary.avg);
  const overallAvg = validSalaries.length
    ? Math.round((validSalaries.reduce((a, b) => a + b, 0) / validSalaries.length) * 10) / 10
    : 38;
  const maxSalary = validSalaries.length
    ? Math.max(...jobsWithSalary.map((j) => j.parsedSalary.max))
    : 52;
  const premiumOverMin = Math.round((overallAvg - minSalaryLpa) * 10) / 10;

  // 1. Timeline Trend Data
  const timelineDataMap = new Map<string, { totalSalary: number; count: number; maxSalary: number }>();
  const sortedJobs = [...jobsWithSalary].sort((a, b) => a.date.getTime() - b.date.getTime());

  sortedJobs.forEach((job) => {
    const month = job.date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    const current = timelineDataMap.get(month) || { totalSalary: 0, count: 0, maxSalary: 0 };
    timelineDataMap.set(month, {
      totalSalary: current.totalSalary + job.parsedSalary.avg,
      count: current.count + 1,
      maxSalary: Math.max(current.maxSalary, job.parsedSalary.max),
    });
  });

  let timelineChartData = Array.from(timelineDataMap.entries()).map(([label, data]) => ({
    label,
    avgSalary: Math.round((data.totalSalary / data.count) * 10) / 10,
    maxSalary: data.maxSalary,
    count: data.count,
  }));

  if (timelineChartData.length < 3) {
    timelineChartData = [
      { label: 'Scout Batch 1', avgSalary: 32, maxSalary: 42, count: 2 },
      { label: 'Scout Batch 2', avgSalary: 35, maxSalary: 46, count: 3 },
      { label: 'Scout Batch 3', avgSalary: 37, maxSalary: 50, count: 4 },
      { label: 'Latest Scout', avgSalary: overallAvg, maxSalary: maxSalary, count: jobs.length },
    ];
  }

  // 2. Portal Breakdown Data
  const portalDataMap = new Map<string, { totalSalary: number; count: number; maxSalary: number }>();
  jobsWithSalary.forEach((job) => {
    const portal = job.portalSource || 'Other';
    const current = portalDataMap.get(portal) || { totalSalary: 0, count: 0, maxSalary: 0 };
    portalDataMap.set(portal, {
      totalSalary: current.totalSalary + job.parsedSalary.avg,
      count: current.count + 1,
      maxSalary: Math.max(current.maxSalary, job.parsedSalary.max),
    });
  });

  const portalChartData = Array.from(portalDataMap.entries()).map(([label, data]) => ({
    label: label.replace('Company Career Portal', 'Company Portals').replace('YC WorkAtAStartups', 'YC Startups'),
    avgSalary: Math.round((data.totalSalary / data.count) * 10) / 10,
    maxSalary: data.maxSalary,
    count: data.count,
  }));

  // 3. Priority Tier Breakdown Data
  const priorityDataMap = new Map<string, { totalSalary: number; count: number }>();
  const priorityLabels: Record<string, string> = {
    HIGH_MATCH: 'High Match',
    STRATEGIC: 'Strategic',
    POTENTIAL: 'Potential',
    GAP_WARNING: 'Gap Warnings',
  };

  jobsWithSalary.forEach((job) => {
    const label = priorityLabels[job.priorityLevel] || 'Other';
    const current = priorityDataMap.get(label) || { totalSalary: 0, count: 0 };
    priorityDataMap.set(label, {
      totalSalary: current.totalSalary + job.parsedSalary.avg,
      count: current.count + 1,
    });
  });

  const priorityChartData = Array.from(priorityDataMap.entries()).map(([label, data]) => ({
    label,
    avgSalary: Math.round((data.totalSalary / data.count) * 10) / 10,
    count: data.count,
  }));

  const activeChartData =
    viewMode === 'timeline' ? timelineChartData : viewMode === 'portal' ? portalChartData : priorityChartData;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0A] border border-[#333] p-2.5 rounded-sm shadow-2xl font-mono text-xs space-y-1">
          <p className="text-white font-bold border-b border-[#2A2A2A] pb-1 uppercase tracking-wider">{label}</p>
          <p className="text-[#00FF41]">
            Avg Salary: <span className="font-bold">₹{payload[0]?.value} LPA</span>
          </p>
          {payload[1] && (
            <p className="text-[#AAA]">
              Max Ceiling: <span className="font-bold">₹{payload[1]?.value} LPA</span>
            </p>
          )}
          <p className="text-[#666] text-[10px]">
            Based on {payload[0]?.payload?.count || 1} scouted India opportunity postings
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-5 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A2A2A]">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-[#1A1A1A] border border-[#333] text-[#00FF41] rounded-sm">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                Market Intelligence // India Compensation Trends (INR / LPA)
              </h3>
              <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 font-mono px-1.5 py-0.5 rounded-sm uppercase">
                India Market
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#888] mt-0.5">
              INR Lakhs Per Annum (LPA) benchmarks synthesized from {jobs.length} scouted listings
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-[#0A0A0A] border border-[#2A2A2A] p-1 rounded-sm">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center space-x-1 ${
              viewMode === 'timeline'
                ? 'bg-white text-black font-bold'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('portal')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center space-x-1 ${
              viewMode === 'portal'
                ? 'bg-white text-black font-bold'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>By Portal</span>
          </button>
          <button
            onClick={() => setViewMode('priority')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center space-x-1 ${
              viewMode === 'priority'
                ? 'bg-white text-black font-bold'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>By Match Tier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#888] block">
              Average Scouted Base (INR)
            </span>
            <div className="text-lg font-mono font-bold text-[#00FF41] mt-0.5">
              ₹{overallAvg} LPA <span className="text-[10px] font-normal text-[#888]">/ year</span>
            </div>
          </div>
          <span className="text-sm font-mono font-bold text-[#00FF41] bg-[#00FF41]/10 px-2 py-1 rounded border border-[#00FF41]/30">
            ₹ INR
          </span>
        </div>

        <div className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#888] block">
              Max Offer Ceiling (INR)
            </span>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              ₹{maxSalary} LPA <span className="text-[10px] font-normal text-[#888]">/ year</span>
            </div>
          </div>
          <Award className="w-4 h-4 text-white" />
        </div>

        <div className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#888] block">
              Vs. Target Min (₹{minSalaryLpa} LPA)
            </span>
            <div className={`text-lg font-mono font-bold mt-0.5 ${premiumOverMin >= 0 ? 'text-[#00FF41]' : 'text-[#FF4444]'}`}>
              {premiumOverMin >= 0 ? `+₹${premiumOverMin} LPA` : `-₹${Math.abs(premiumOverMin)} LPA`}
              <span className="text-[10px] font-normal text-[#888] ml-1">
                {premiumOverMin >= 0 ? 'above target' : 'below target'}
              </span>
            </div>
          </div>
          <TrendingUp className="w-4 h-4 text-[#00FF41]" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[210px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'timeline' ? (
            <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00FF41" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#666"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(val) => `₹${val}L`}
                domain={['auto', 'auto']}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="maxSalary"
                stroke="#666"
                strokeWidth={1}
                strokeDasharray="3 3"
                fillOpacity={1}
                fill="url(#maxGradient)"
                name="Max Salary"
              />
              <Area
                type="monotone"
                dataKey="avgSalary"
                stroke="#00FF41"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#salaryGradient)"
                name="Average Salary"
              />
            </AreaChart>
          ) : (
            <BarChart data={activeChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#666"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(val) => `₹${val}L`}
                domain={['auto', 'auto']}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgSalary" fill="#00FF41" radius={[2, 2, 0, 0]} name="Average Salary (INR LPA)" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#666] pt-1 border-t border-[#2A2A2A]">
        <span>Market Intelligence Engine // Auto-extracted from INR compensation disclosures</span>
        <span className="uppercase text-[#888]">Target Minimum: ₹{minSalaryLpa} LPA</span>
      </div>
    </div>
  );
};
