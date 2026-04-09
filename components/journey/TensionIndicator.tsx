'use client';

import type { TensionData } from '@/lib/hooks/useRealtimeEval';

interface Props {
  tension: TensionData | null;
  feedback: string;
}

const AXIS_LABELS = [
  { key: 'laryngeal' as const, label: '후두', icon: '🫁' },
  { key: 'tongue_root' as const, label: '혀뿌리', icon: '👅' },
  { key: 'jaw' as const, label: '턱', icon: '🦷' },
  { key: 'register_break' as const, label: '성구전환', icon: '🎵' },
];

function barColor(value: number): string {
  if (value < 30) return '#10b981';
  if (value < 50) return '#eab308';
  if (value < 70) return '#f97316';
  return '#ef4444';
}

function overallColor(value: number): string {
  if (value < 30) return '#34d399';
  if (value < 50) return '#fbbf24';
  if (value < 70) return '#fb923c';
  return '#f87171';
}

export default function TensionIndicator({ tension, feedback }: Props) {
  if (!tension) {
    return (
      <div style={{ padding: 12, borderRadius: 8, background: 'rgba(17,24,39,0.5)', border: '1px solid #1f2937' }}>
        <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', margin: 0 }}>녹음을 시작하면 실시간 분석이 시작됩니다</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 종합 긴장도 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, background: 'rgba(17,24,39,0.5)', border: '1px solid #1f2937' }}>
        <span style={{ fontSize: 14, color: '#9ca3af' }}>긴장도</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: overallColor(tension.overall) }}>
          {Math.round(tension.overall)}
        </span>
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          {tension.detected ? '⚠️ 긴장 감지' : '✅ 이완'}
        </span>
      </div>

      {/* 4축 바 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {AXIS_LABELS.map(({ key, label, icon }) => {
          const value = tension[key];
          return (
            <div key={key} style={{ padding: 8, borderRadius: 6, background: 'rgba(17,24,39,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{icon} {label}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(value)}</span>
              </div>
              <div style={{ height: 6, background: '#1f2937', borderRadius: 999, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 999,
                    transition: 'all 0.5s',
                    background: barColor(value),
                    width: `${Math.min(value, 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 감각 피드백 */}
      {feedback && (
        <div style={{ padding: 12, borderRadius: 8, background: 'rgba(29,17,69,0.3)', border: '1px solid rgba(55,48,163,0.5)' }}>
          <p style={{ fontSize: 14, color: '#c7d2fe', margin: 0 }}>{feedback}</p>
        </div>
      )}
    </div>
  );
}
