'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboardingStore';
import Button from '@/components/ds/Button';
import s from './StepTransition.module.css';

export default function StepTransition() {
  const router = useRouter();
  const { result } = useOnboardingStore();

  const suggestedStage = result?.consultation.suggested_stage_id ?? 1;

  return (
    <div className={s.container}>
      <h3 className={s.title}>레슨을 시작할 준비가 됐어요</h3>
      <p className={s.desc}>
        분석 결과를 바탕으로 최적의 시작점을 추천합니다.
      </p>

      <div className={s.stageInfo}>
        <div className={s.stageLabel}>추천 시작 단계</div>
        <div className={s.stageValue}>Stage {suggestedStage}</div>
      </div>

      <div className={s.actions}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push(`/journey/${suggestedStage}`)}
        >
          추천 단계로 시작하기
        </Button>
        <button
          type="button"
          className={s.altLink}
          onClick={() => router.push('/journey/1')}
        >
          처음부터 시작하기
        </button>
      </div>
    </div>
  );
}
