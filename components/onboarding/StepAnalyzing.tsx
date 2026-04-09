'use client';

import { useState, useEffect } from 'react';
import s from './StepAnalyzing.module.css';

const PHASES = [
  '음성 파일을 처리하고 있어요',
  '긴장도를 측정하고 있어요',
  'AI 상담 결과를 생성하고 있어요',
];

export default function StepAnalyzing() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, PHASES.length - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.container}>
      <div className={s.spinner} />
      <h3 className={s.title}>AI가 목소리를 분석하고 있어요</h3>
      <p className={s.desc}>잠시만 기다려주세요.</p>
      <div className={s.phases}>
        {PHASES.map((label, i) => (
          <span
            key={label}
            className={`${s.phase} ${i === phaseIndex ? s.phaseActive : ''} ${i < phaseIndex ? s.phaseDone : ''}`}
          >
            {i < phaseIndex ? '\u2713 ' : i === phaseIndex ? '\u25B6 ' : ''}{label}
          </span>
        ))}
      </div>
    </div>
  );
}
