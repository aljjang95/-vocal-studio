'use client';

import type { HLBCurriculumStage, StageStatus } from '@/types';

interface StageCardProps {
  stage: HLBCurriculumStage;
  status: StageStatus;
  bestScore: number;
  onClick: () => void;
}

const STATUS_STYLES: Record<StageStatus, string> = {
  locked: 'opacity-40 cursor-not-allowed',
  available: 'ring-2 ring-emerald-400 cursor-pointer hover:scale-[1.02]',
  in_progress: 'ring-2 ring-amber-400 cursor-pointer hover:scale-[1.02]',
  passed: 'ring-2 ring-blue-400 cursor-pointer',
};

const STATUS_BADGE: Record<StageStatus, string> = {
  locked: '🔒',
  available: '▶️',
  in_progress: '🔄',
  passed: '✅',
};

export default function StageCard({ stage, status, bestScore, onClick }: StageCardProps) {
  return (
    <button
      onClick={status !== 'locked' ? onClick : undefined}
      disabled={status === 'locked'}
      className={`w-full p-4 rounded-xl bg-gray-900/50 border border-gray-800 transition-all duration-200 text-left ${STATUS_STYLES[status]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{stage.blockIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{stage.id}단계</span>
            <span>{STATUS_BADGE[status]}</span>
          </div>
          <h3 className="text-white font-medium truncate">{stage.name}</h3>
          <p className="text-xs text-gray-500">{stage.block} · {stage.pronunciation}</p>
        </div>
        {bestScore > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold text-white">{bestScore}</div>
            <div className="text-xs text-gray-500">점</div>
          </div>
        )}
      </div>
    </button>
  );
}
