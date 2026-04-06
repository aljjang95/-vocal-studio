'use client';

import { useCountUp } from '@/lib/hooks/useCountUp';
import s from './ScoreDisplay.module.css';

function getColor(score: number): string {
  if (score >= 90) return 'var(--success)';
  if (score >= 70) return 'var(--accent)';
  if (score >= 40) return 'var(--warning)';
  return 'var(--error)';
}

interface Props {
  score: number;
  passed?: boolean;
  label?: string;
}

export default function ScoreDisplay({ score, passed, label = 'Score' }: Props) {
  const { ref, value } = useCountUp(score);
  const color = getColor(score);
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={s.wrap}>
      <div className={s.ring}>
        <svg viewBox="0 0 180 180">
          <circle className={s.bg} cx="90" cy="90" r="80" />
          <circle
            className={s.fill} cx="90" cy="90" r="80"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={s.value}>
          <span ref={ref as React.Ref<HTMLSpanElement>} className={s.num} style={{ color }}>
            {value}
          </span>
          <span className={s.label}>{label}</span>
        </div>
      </div>
      {passed !== undefined && (
        <div className={s.verdict} style={{ color }}>
          {passed ? '통과' : '재도전'}
        </div>
      )}
    </div>
  );
}
