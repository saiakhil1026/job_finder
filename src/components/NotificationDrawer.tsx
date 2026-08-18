import React from 'react';
import { Bell, X, Check, ExternalLink, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectJob: (jobId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onSelectJob,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141414] border-l border-[#2A2A2A] shadow-2xl h-full flex flex-col font-sans text-[#F0F0F0]">
        {/* Drawer Header */}
        <div className="p-5 bg-[#0A0A0A] border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#00FF41]" />
            <h2 className="text-sm font-serif text-white">Job Match Notifications</h2>
          </div>
          <div className="flex items-center space-x-2 font-mono">
            <button
              onClick={onMarkAllAsRead}
              className="text-[10px] uppercase text-[#888] hover:text-white transition-colors flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#888] hover:text-white rounded-sm hover:bg-[#1A1A1A] border border-transparent hover:border-[#333]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#888] font-mono text-xs uppercase">
              No new alerts. Launch agent scan to discover matches.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectJob(item.jobId);
                  onClose();
                }}
                className={`p-4 rounded-sm border cursor-pointer transition-all ${
                  item.isRead
                    ? 'bg-[#0A0A0A] border-[#2A2A2A] opacity-75'
                    : 'bg-[#0A0A0A] border-white shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] text-[#00FF41] border border-[#333] rounded-sm font-bold">
                    {item.matchScore}% MATCH
                  </span>
                  <span className="text-[10px] font-mono text-[#666]">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="text-xs font-serif font-medium text-white mt-1">{item.jobTitle}</h4>
                <p className="text-[11px] font-mono uppercase text-[#888]">{item.company}</p>
                <p className="text-xs text-[#AAA] mt-2 line-clamp-2 leading-relaxed font-sans">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

