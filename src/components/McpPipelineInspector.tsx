import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Bot,
  Terminal,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Code,
  Zap,
} from 'lucide-react';
import { McpAgentTrace } from '../types';

interface McpPipelineInspectorProps {
  traces: McpAgentTrace[];
}

export const McpPipelineInspector: React.FC<McpPipelineInspectorProps> = ({ traces }) => {
  const [selectedTrace, setSelectedTrace] = useState<McpAgentTrace | null>(traces[0] || null);

  const totalLatency = traces.reduce((acc, t) => acc + t.latencyMs, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] inline-block mr-2 animate-pulse"></span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#999]">MCP PROTOCOL AGENT TELEMETRY</span>
            </div>
            <h1 className="text-3xl font-serif italic text-white tracking-tight">Multi-Agent Workflow &amp; Telemetry Inspection</h1>
            <p className="text-xs text-[#888] font-mono uppercase tracking-wider mt-1 max-w-2xl">
              Real-time audit log of active MCP agents, tool invocation parameters, latency benchmarks, and neural candidate matching execution graphs.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-[#0A0A0A] px-4 py-2.5 rounded-sm border border-[#333] text-xs font-mono">
            <div>
              <span className="text-[#666] block uppercase text-[9px] tracking-widest">Total Traces</span>
              <span className="text-white font-bold text-sm">{traces.length}</span>
            </div>
            <div className="border-l border-[#333] pl-4">
              <span className="text-[#666] block uppercase text-[9px] tracking-widest">Cum. Latency</span>
              <span className="text-[#00FF41] font-bold text-sm">{totalLatency} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* AGENT GRAPH FLOW VISUALIZER */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#666] flex items-center space-x-2">
          <Layers className="w-4 h-4 text-white" />
          <span>AUTONOMOUS AGENT EXECUTION GRAPH</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Node 1 */}
          <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333] relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="p-1 bg-[#1A1A1A] text-white rounded-sm border border-[#333]">
                <Bot className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#00FF41] bg-[#003311] px-2 py-0.5 border border-[#006622] rounded-sm">
                ACTIVE
              </span>
            </div>
            <h3 className="text-xs font-mono uppercase font-bold text-white">ResumeAnalyzerAgent</h3>
            <p className="text-[11px] text-[#888] mt-1 font-sans">Parses CV PDF/Text into candidate skills vector taxonomy.</p>
            <div className="mt-3 text-[10px] font-mono text-[#AAA]">Tools: mcp_pdf_extractor</div>
          </div>

          {/* Node 2 */}
          <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333] relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="p-1 bg-[#1A1A1A] text-white rounded-sm border border-[#333]">
                <Search className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#00FF41] bg-[#003311] px-2 py-0.5 border border-[#006622] rounded-sm">
                ACTIVE
              </span>
            </div>
            <h3 className="text-xs font-mono uppercase font-bold text-white">MCPWebScoutAgent</h3>
            <p className="text-[11px] text-[#888] mt-1 font-sans">Executes live web searches on job portals &amp; career pages.</p>
            <div className="mt-3 text-[10px] font-mono text-[#AAA]">Tools: googleSearch_grounding</div>
          </div>

          {/* Node 3 */}
          <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333] relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="p-1 bg-[#1A1A1A] text-white rounded-sm border border-[#333]">
                <Zap className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#00FF41] bg-[#003311] px-2 py-0.5 border border-[#006622] rounded-sm">
                ACTIVE
              </span>
            </div>
            <h3 className="text-xs font-mono uppercase font-bold text-white">CandidateMatchEvaluator</h3>
            <p className="text-[11px] text-[#888] mt-1 font-sans">Cross-references job requirements vs candidate CV matrix.</p>
            <div className="mt-3 text-[10px] font-mono text-[#AAA]">Tools: neural_match_scorer</div>
          </div>

          {/* Node 4 */}
          <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#333] relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="p-1 bg-[#1A1A1A] text-white rounded-sm border border-[#333]">
                <Activity className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#00FF41] bg-[#003311] px-2 py-0.5 border border-[#006622] rounded-sm">
                ACTIVE
              </span>
            </div>
            <h3 className="text-xs font-mono uppercase font-bold text-white">NotificationAlertAgent</h3>
            <p className="text-[11px] text-[#888] mt-1 font-sans">Triggers high-priority match notifications &amp; application prep.</p>
            <div className="mt-3 text-[10px] font-mono text-[#AAA]">Tools: app_toast_dispatcher</div>
          </div>
        </div>
      </div>

      {/* TELEMETRY TABLE & JSON INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trace List (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#666] flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-white" />
            <span>AGENT TRACE LOG REPOSITORY</span>
          </h3>

          <div className="space-y-2">
            {traces.map((trace) => {
              const isSelected = selectedTrace?.id === trace.id;
              return (
                <div
                  key={trace.id}
                  onClick={() => setSelectedTrace(trace)}
                  className={`p-3.5 rounded-sm border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-white shadow-md'
                      : 'bg-[#0A0A0A] border-[#333] hover:border-[#555]'
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold bg-[#1A1A1A] text-white border border-[#333] rounded-sm">
                        {trace.agentName}
                      </span>
                      <span className="text-[10px] font-mono text-[#666]">
                        {new Date(trace.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#F0F0F0] font-sans">{trace.action}</p>

                    <div className="flex items-center space-x-2 text-[10px] text-[#888] font-mono">
                      <span>Tools:</span>
                      <span className="text-white">
                        {(trace.mcpToolsUsed || []).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch text-[10px] font-mono">
                    <span className="text-[#00FF41] font-bold bg-[#003311] px-1.5 py-0.5 rounded-sm border border-[#006622] uppercase">
                      {trace.status}
                    </span>
                    <span className="text-[#666] mt-2 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#666]" />
                      <span>{trace.latencyMs} ms</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Trace JSON Viewer (5 cols) */}
        <div className="lg:col-span-5 bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#666] flex items-center space-x-2">
            <Code className="w-4 h-4 text-[#00FF41]" />
            <span>RAW MCP TRACE PAYLOAD</span>
          </h3>

          {selectedTrace ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-[#0A0A0A] rounded-sm border border-[#333] space-y-1">
                <span className="text-[#666] block text-[9px] uppercase tracking-widest">Trace ID:</span>
                <span className="text-white font-bold">{selectedTrace.id}</span>
                <span className="text-[#666] block text-[9px] uppercase tracking-widest mt-2">Agent:</span>
                <span className="text-[#00FF41] font-bold">{selectedTrace.agentName}</span>
              </div>

              <div>
                <span className="text-[#888] block text-[10px] uppercase tracking-wider mb-1 font-bold">Input Payload:</span>
                <pre className="p-3 bg-[#0A0A0A] rounded-sm text-[#00FF41] overflow-x-auto border border-[#333] max-h-48 scrollbar-thin text-[11px]">
                  {JSON.stringify(selectedTrace.inputPayload, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-[#888] block text-[10px] uppercase tracking-wider mb-1 font-bold font-mono">Output Summary:</span>
                <pre className="p-3 bg-[#0A0A0A] rounded-sm text-white overflow-x-auto border border-[#333] max-h-48 scrollbar-thin text-[11px]">
                  {JSON.stringify(selectedTrace.outputSummary, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#666] text-xs font-mono">
              Select a trace on the left to inspect raw JSON parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

