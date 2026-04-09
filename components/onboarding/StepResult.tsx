'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import MetricBar from '@/components/ds/MetricBar';
import Button from '@/components/ds/Button';
import s from './StepResult.module.css';

function scoreColor(value: number): string {
  if (value <= 30) return 'var(--success)';
  if (value <= 60) return 'var(--warning)';
  return 'var(--error)';
}

function scoreClass(value: number): string {
  if (value <= 30) return s.scoreLow;
  if (value <= 60) return s.scoreMid;
  return s.scoreHigh;
}

function scoreLabel(value: number): string {
  if (value <= 20) return '매우 양호';
  if (value <= 40) return '양호';
  if (value <= 60) return '보통';
  if (value <= 80) return '긴장 감지';
  return '높은 긴장';
}

export default function StepResult() {
  const { result, setStep } = useOnboardingStore();
  if (!result) return null;

  const { tension, consultation } = result;

  return (
    <div className={s.container}>
      <h3 className={s.title}>분석 결과</h3>
      <p className={s.desc}>AI가 목소리에서 감지한 긴장 상태입니다.</p>

      <div className={s.overallCard}>
        <div>
          <div className={`${s.overallScore} ${scoreClass(tension.overall)}`}>
            {Math.round(tension.overall)}
          </div>
          <div className={s.overallLabel}>종합 긴장도</div>
          <div className={s.overallHint}>{scoreLabel(tension.overall)}</div>
        </div>
      </div>

      <div className={s.section}>
        <div className={s.sectionTitle}>부위별 긴장도</div>
        <MetricBar label="후두 긴장" value={tension.laryngeal} color={scoreColor(tension.laryngeal)} />
        <MetricBar label="혀뿌리 긴장" value={tension.tongue_root} color={scoreColor(tension.tongue_root)} />
        <MetricBar label="턱 긴장" value={tension.jaw} color={scoreColor(tension.jaw)} />
        <MetricBar label="성구전환" value={tension.register_break} color={scoreColor(tension.register_break)} />
      </div>

      {consultation.problems.length > 0 && (
        <div className={s.section}>
          <div className={s.sectionTitle}>발견된 문제점</div>
          <ul className={s.problemList}>
            {consultation.problems.map((problem, i) => (
              <li key={i} className={s.problemItem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={s.actions}>
        <Button variant="primary" size="lg" onClick={() => setStep(3)}>
          맞춤 로드맵 보기
        </Button>
      </div>
    </div>
  );
}
