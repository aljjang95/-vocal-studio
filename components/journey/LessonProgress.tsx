'use client';

import type { JourneyLessonPhase } from '@/types';
import s from './LessonProgress.module.css';

const PHASES: { key: JourneyLessonPhase; label: string }[] = [
  { key: 'why', label: '왜?' },
  { key: 'demo', label: '시범' },
  { key: 'practice', label: '실습' },
  { key: 'eval', label: '평가' },
  { key: 'summary', label: '요약' },
];

const PHASE_ORDER: JourneyLessonPhase[] = ['why', 'demo', 'practice', 'eval', 'summary'];

interface Props {
  currentPhase: JourneyLessonPhase;
}

export default function LessonProgress({ currentPhase }: Props) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className={s.container}>
      {PHASES.map((phase, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;
        const dotCls = [s.dot, isCompleted && s.completed, isActive && s.active]
          .filter(Boolean)
          .join(' ');
        const labelCls = [s.label, isCompleted && s.completed, isActive && s.active]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={phase.key} style={{ display: 'contents' }}>
            <div className={s.step}>
              <div className={dotCls} />
              <span className={labelCls}>{phase.label}</span>
            </div>
            {i < PHASES.length - 1 && (
              <div className={`${s.line} ${i < currentIndex ? s.filled : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
