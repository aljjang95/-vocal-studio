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
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(17,24,39,0.5)', border: '1px solid #1f2937' }}>
        <div style={{ height: 16, background: '#374151', borderRadius: 4, width: '75%', marginBottom: 8 }} />
        <div style={{ height: 16, background: '#374151', borderRadius: 4, width: '50%' }} />
      </div>
    );
  }
  if (!evaluation) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 12, background: 'rgba(17,24,39,0.5)', border: '1px solid #1f2937' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: evaluation.passed ? '#34d399' : '#fbbf24' }}>
          {evaluation.score}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: '#9ca3af' }}>피치 정확도 {evaluation.pitchAccuracy}%</div>
          <div style={{ fontSize: 14, color: '#9ca3af' }}>톤 안정성 {evaluation.toneStability.toFixed(0)}%</div>
          {evaluation.passed && <div style={{ color: '#34d399', fontSize: 14, fontWeight: 500, marginTop: 4 }}>통과!</div>}
        </div>
      </div>
      {evaluation.tensionDetected && evaluation.tension && (
        <div style={{ padding: 12, borderRadius: 8, background: 'rgba(69,10,10,0.2)', border: '1px solid #7f1d1d' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#fca5a5', marginBottom: 8 }}>긴장 감지</div>
          <p style={{ color: '#e5e5e5', fontSize: 14, margin: 0 }}>{evaluation.tension.detail}</p>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {evaluation.tension.laryngeal > 40 && (
              <div style={{ fontSize: 12, color: '#fca5a5' }}>후두: {evaluation.tension.laryngeal.toFixed(0)}%</div>
            )}
            {evaluation.tension.tongue_root > 40 && (
              <div style={{ fontSize: 12, color: '#fca5a5' }}>혀뿌리: {evaluation.tension.tongue_root.toFixed(0)}%</div>
            )}
            {evaluation.tension.jaw > 40 && (
              <div style={{ fontSize: 12, color: '#fca5a5' }}>턱: {evaluation.tension.jaw.toFixed(0)}%</div>
            )}
            {evaluation.tension.register_break > 40 && (
              <div style={{ fontSize: 12, color: '#fca5a5' }}>성구전환: {evaluation.tension.register_break.toFixed(0)}%</div>
            )}
          </div>
        </div>
      )}
      {coaching && (
        <div style={{ padding: 16, borderRadius: 12, background: 'rgba(29,17,69,0.3)', border: '1px solid #3730a3' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#a5b4fc', marginBottom: 8 }}>AI 코치</div>
          <p style={{ color: '#e5e5e5', fontSize: 14, margin: 0 }}>{coaching.feedback}</p>
          {coaching.nextExercise && <p style={{ color: '#a5b4fc', fontSize: 14, marginTop: 8, marginBottom: 0 }}>💡 {coaching.nextExercise}</p>}
          {coaching.encouragement && <p style={{ color: '#6ee7b7', fontSize: 14, marginTop: 4, marginBottom: 0 }}>{coaching.encouragement}</p>}
        </div>
      )}
    </div>
  );
}
