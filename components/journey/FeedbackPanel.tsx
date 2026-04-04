'use client';

import type { CoachingFeedback, EvaluationResult } from '@/types';

interface FeedbackPanelProps {
  evaluation: EvaluationResult | null;
  coaching: CoachingFeedback | null;
  isLoading: boolean;
}

export default function FeedbackPanel({ evaluation, coaching, isLoading }: FeedbackPanelProps) {
  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    );
  }
  if (!evaluation) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        <div className={`text-3xl font-bold ${evaluation.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
          {evaluation.score}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-400">피치 정확도 {evaluation.pitchAccuracy}%</div>
          <div className="text-sm text-gray-400">톤 안정성 {evaluation.toneStability.toFixed(0)}%</div>
          {evaluation.passed && <div className="text-emerald-400 text-sm font-medium mt-1">통과!</div>}
        </div>
      </div>
      {coaching && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800">
          <div className="text-sm font-medium text-indigo-300 mb-2">AI 코치</div>
          <p className="text-white text-sm">{coaching.feedback}</p>
          {coaching.nextExercise && <p className="text-indigo-300 text-sm mt-2">💡 {coaching.nextExercise}</p>}
          {coaching.encouragement && <p className="text-emerald-300 text-sm mt-1">{coaching.encouragement}</p>}
        </div>
      )}
    </div>
  );
}
