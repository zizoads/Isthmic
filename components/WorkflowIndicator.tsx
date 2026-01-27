
import React from 'react';
import { WorkflowState } from '../types';

interface Props {
  workflow: WorkflowState;
  lang: 'ar' | 'en';
}

const WorkflowIndicator: React.FC<Props> = ({ workflow, lang }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-[32px] p-6 shadow-2xl animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">
            {lang === 'ar' ? workflow.nameAr : workflow.nameEn}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-primary font-bold">{Math.round(workflow.progress)}%</span>
      </div>

      <div className="flex gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
        {workflow.nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <div className={`flex flex-col items-center gap-2 shrink-0 transition-all duration-500 ${node.status === 'idle' ? 'opacity-30 grayscale' : 'opacity-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                node.status === 'running' ? 'border-primary bg-primary/20 animate-pulse' :
                node.status === 'completed' ? 'border-green-500 bg-green-500/20' :
                node.status === 'failed' ? 'border-red-500 bg-red-500/20' : 'border-white/10'
              }`}>
                {node.status === 'completed' ? <i className="fas fa-check text-green-500 text-xs"></i> :
                 node.status === 'failed' ? <i className="fas fa-times text-red-500 text-xs"></i> :
                 <span className="text-[10px] font-black">{i + 1}</span>}
              </div>
              <span className="text-[8px] font-black uppercase text-slate-400 whitespace-nowrap">
                {lang === 'ar' ? node.labelAr : node.labelEn}
              </span>
            </div>
            {i < workflow.nodes.length - 1 && (
              <div className={`h-[1px] w-8 shrink-0 transition-all duration-700 ${node.status === 'completed' ? 'bg-green-500' : 'bg-white/10'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowIndicator;
