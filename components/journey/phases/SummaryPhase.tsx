'use client';

import { useRouter } from 'next/navigation';
import type { HLBCurriculumStage } from '@/types';
import { useJourneyStore } from '@/stores/journeyStore';
import Button from '@/components/ds/Button';
import s from './SummaryPhase.module.css';

interface Props {
  stage: HLBCurriculumStage;
  stageId: number;
  passed: boolean;
  onRetry: () => void;
}

export default function SummaryPhase({ stage, stageId, passed, onRetry }: Props) {
  const router = useRouter();
  const { progress } = useJourneyStore();
  const prog = progress[stageId];

  const feedbackText = passed
    ? stage.somaticFeedback.onSuccess
    : stage.somaticFeedback.onStruggle;

  const nextStageId = stageId + 1;
  const isLastStage = stageId >= 28;

  return (
    <div className={s.container}>
      <div className={`${s.resultCard} ${passed ? s.passed : s.retry}`}>
        <h2 className={`${s.resultTitle} ${passed ? s.passed : s.retry}`}>
          {passed && isLastStage ? '전 과정을 완료했어요!' : passed ? '통과' : '다시 도전해보세요'}
        </h2>
        <p className={s.feedbackText}>{feedbackText}</p>
        {passed && isLastStage && (
          <p className={s.feedbackText}>28단계 전체를 마쳤어요. 정말 대단해요!</p>
        )}
      </div>

      {prog && (
        <div className={s.stats}>
          <div className={s.statItem}>
            <div className={s.statValue}>{prog.bestScore}</div>
            <div className={s.statLabel}>최고 점수</div>
          </div>
          <div className={s.statItem}>
            <div className={s.statValue}>{prog.attempts}</div>
            <div className={s.statLabel}>시도 횟수</div>
          </div>
        </div>
      )}

      {passed && !isLastStage ? (
        <Button
          variant="accent"
          fullWidth
          onClick={() => router.push(`/journey/${nextStageId}`)}
        >
          다음 레슨
        </Button>
      ) : !passed ? (
        <Button variant="accent" fullWidth onClick={onRetry}>
          다시 연습
        </Button>
      ) : null}

      <Button
        variant="ghost"
        fullWidth
        onClick={() => router.push('/journey')}
      >
        여정으로 돌아가기
      </Button>
    </div>
  );
}
