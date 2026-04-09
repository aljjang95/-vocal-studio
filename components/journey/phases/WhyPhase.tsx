'use client';

import type { HLBCurriculumStage } from '@/types';
import { useTTS } from '@/lib/hooks/useTTS';
import Button from '@/components/ds/Button';
import s from './WhyPhase.module.css';

interface Props {
  stage: HLBCurriculumStage;
  onNext: () => void;
}

export default function WhyPhase({ stage, onNext }: Props) {
  const tts = useTTS(stage.whyText);

  return (
    <div className={s.container}>
      {/* 왜 이 레슨인가 */}
      <div className={s.whyText}>{stage.whyText}</div>

      <div className={s.audioRow}>
        <button
          className={s.listenBtn}
          onClick={tts.play}
          disabled={tts.isLoading}
        >
          {tts.isLoading ? '로딩...' : tts.isPlaying ? '정지' : '음성으로 듣기'}
        </button>
      </div>

      {/* 이번 레슨 정보 */}
      <div className={s.infoGrid}>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>발음</span>
          <span className={s.infoValue}>{stage.pronunciation}</span>
        </div>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>스케일</span>
          <span className={s.infoValue}>{stage.scaleType}</span>
        </div>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>합격 기준</span>
          <span className={s.infoValue}>{stage.evaluationCriteria.passingScore}점</span>
        </div>
        <div className={s.infoItem}>
          <span className={s.infoLabel}>BPM</span>
          <span className={s.infoValue}>{stage.bpmRange[0]}~{stage.bpmRange[1]}</span>
        </div>
      </div>

      {/* 목표 */}
      <div className={s.goalCard}>
        <div className={s.goalLabel}>이번 레슨 목표</div>
        <p className={s.goalText}>{stage.evaluationCriteria.description}</p>
      </div>

      {/* 관찰 질문 */}
      <div className={s.question}>
        {stage.somaticFeedback.observationQuestion}
      </div>

      <Button variant="accent" fullWidth onClick={onNext}>
        시범 보기
      </Button>
    </div>
  );
}
