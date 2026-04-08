import React from 'react';
import { UserProfile } from '../UserProfile';

export const UserProfileHub: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in p-8">
      <header className="mb-10">
        <div className="flex items-center gap-6 mb-4">
          <div>
            <h1 className="text-5xl prestige-title text-white italic leading-none mb-2">User Profile</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Sovereign Identity Configuration</p>
          </div>
        </div>
      </header>
      
      <UserProfile />
    </div>
  );
};
