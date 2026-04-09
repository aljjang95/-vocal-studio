'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import StepRecording from './StepRecording';
import StepAnalyzing from './StepAnalyzing';
import StepResult from './StepResult';
import StepRoadmap from './StepRoadmap';
import StepTransition from './StepTransition';
import s from './OnboardingWizard.module.css';

const STEP_LABELS = ['녹음', '분석', '결과', '로드맵', '시작'];

export default function OnboardingWizard() {
  const { step, error, result, setError, resetAll } = useOnboardingStore();

  // result가 있으면 step 2 이상으로 점프 가능
  const displayStep = result && step < 2 ? 2 : step;

  return (
    <div className={s.wizard}>
      {/* 진행 바 */}
      <div className={s.progress}>
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`${s.progressStep} ${i === displayStep ? s.progressActive : ''} ${i < displayStep ? s.progressDone : ''}`}
          >
            <div className={s.progressDot}>
              {i < displayStep ? <span>&#10003;</span> : <span>{i + 1}</span>}
            </div>
            <span className={s.progressLabel}>{label}</span>
          </div>
        ))}
        <div className={s.progressBar}>
          <div className={s.progressFill} style={{ width: `${(displayStep / (STEP_LABELS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div className={s.errorBanner}>
          <span>&#9888;</span> {error}
          <button type="button" onClick={() => setError(null)} className={s.errorClose}>&#10005;</button>
        </div>
      )}

      {/* 단계별 콘텐츠 */}
      {displayStep === 0 && <StepRecording />}
      {displayStep === 1 && <StepAnalyzing />}
      {displayStep === 2 && <StepResult />}
      {displayStep === 3 && <StepRoadmap />}
      {displayStep === 4 && <StepTransition />}
    </div>
  );
}
