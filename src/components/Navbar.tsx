import React from 'react';
import {
  Bot,
  Search,
  FileText,
  Activity,
  Bookmark,
  Bell,
  RefreshCw,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { NotificationItem, ScoutConfig } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'criteria' | 'pipeline' | 'saved' | 'custom';
  setActiveTab: (tab: 'dashboard' | 'criteria' | 'pipeline' | 'saved' | 'custom') => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onOpenNotifications: () => void;
  onRunScout: () => void;
  isScouting: boolean;
  scoutConfig: ScoutConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  onOpenNotifications,
  onRunScout,
  isScouting,
}) => {
  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#2A2A2A] text-[#F0F0F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Agent Pulse */}
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-baseline space-x-3">
                <h1 className="text-3xl font-serif italic tracking-tighter leading-none text-white">Neural_Match</h1>
                <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 bg-[#1A1A1A] border border-[#333] rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#00FF41] inline-block mr-2 animate-pulse"></span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#999]">MCP Agents: Operational</span>
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#666] mt-1 font-mono">
                Automated Talent Intelligence Pipeline / v2.4.0
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 text-xs uppercase font-mono tracking-wider transition-all flex items-center space-x-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-black font-bold rounded-sm'
                  : 'text-[#888] hover:text-white hover:bg-[#1A1A1A] rounded-sm'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Signals Feed</span>
            </button>

            <button
              id="tab-criteria"
              onClick={() => setActiveTab('criteria')}
              className={`px-3 py-1.5 text-xs uppercase font-mono tracking-wider transition-all flex items-center space-x-1.5 ${
                activeTab === 'criteria'
                  ? 'bg-white text-black font-bold rounded-sm'
                  : 'text-[#888] hover:text-white hover:bg-[#1A1A1A] rounded-sm'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Context Vector</span>
            </button>

            <button
              id="tab-pipeline"
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 text-xs uppercase font-mono tracking-wider transition-all flex items-center space-x-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-white text-black font-bold rounded-sm'
                  : 'text-[#888] hover:text-white hover:bg-[#1A1A1A] rounded-sm'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Telemetry</span>
            </button>

            <button
              id="tab-saved"
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 text-xs uppercase font-mono tracking-wider transition-all flex items-center space-x-1.5 ${
                activeTab === 'saved'
                  ? 'bg-white text-black font-bold rounded-sm'
                  : 'text-[#888] hover:text-white hover:bg-[#1A1A1A] rounded-sm'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Roles</span>
            </button>

            <button
              id="tab-custom"
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 text-xs uppercase font-mono tracking-wider transition-all flex items-center space-x-1.5 ${
                activeTab === 'custom'
                  ? 'bg-white text-black font-bold rounded-sm'
                  : 'text-[#888] hover:text-white hover:bg-[#1A1A1A] rounded-sm'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Scan Link</span>
            </button>
          </nav>

          {/* Action Buttons & Notifications */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-scout-trigger"
              onClick={onRunScout}
              disabled={isScouting}
              className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-white hover:text-black border border-[#333] text-white font-mono text-xs uppercase tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50 rounded-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScouting ? 'animate-spin' : ''}`} />
              <span>{isScouting ? 'Scanning...' : 'Execute Scout'}</span>
            </button>

            <button
              id="btn-notifications-drawer"
              onClick={onOpenNotifications}
              className="relative p-2 text-[#888] hover:text-white rounded-sm hover:bg-[#1A1A1A] transition-colors border border-transparent hover:border-[#333]"
              title="Job Alert Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#FF4D00] text-white rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-[#2A2A2A] text-xs font-mono scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 uppercase text-[10px] tracking-wider whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-white text-black font-bold' : 'text-[#888]'
            }`}
          >
            Signals
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`px-2.5 py-1 uppercase text-[10px] tracking-wider whitespace-nowrap ${
              activeTab === 'criteria' ? 'bg-white text-black font-bold' : 'text-[#888]'
            }`}
          >
            Context
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-2.5 py-1 uppercase text-[10px] tracking-wider whitespace-nowrap ${
              activeTab === 'pipeline' ? 'bg-white text-black font-bold' : 'text-[#888]'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-2.5 py-1 uppercase text-[10px] tracking-wider whitespace-nowrap ${
              activeTab === 'saved' ? 'bg-white text-black font-bold' : 'text-[#888]'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-2.5 py-1 uppercase text-[10px] tracking-wider whitespace-nowrap ${
              activeTab === 'custom' ? 'bg-white text-black font-bold' : 'text-[#888]'
            }`}
          >
            Scan Link
          </button>
        </div>
      </div>
    </header>
  );
};

