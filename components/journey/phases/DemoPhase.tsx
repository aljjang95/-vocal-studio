'use client';

import type { HLBCurriculumStage } from '@/types';
import { useTTS } from '@/lib/hooks/useTTS';
import Button from '@/components/ds/Button';
import s from './DemoPhase.module.css';

interface Props {
  stage: HLBCurriculumStage;
  onNext: () => void;
}

export default function DemoPhase({ stage, onNext }: Props) {
  const tts = useTTS(stage.demoScript);

  return (
    <div className={s.container}>
      <div className={s.demoCard}>
        <p className={s.script}>{stage.demoScript}</p>
        <button
          className={s.playBtn}
          onClick={tts.play}
          disabled={tts.isLoading}
          aria-label="시범 음성 재생"
        >
          {tts.isLoading ? '...' : tts.isPlaying ? '||' : '\u25B6'}
        </button>
      </div>

      <p className={s.readyText}>이제 직접 해볼까요?</p>

      <Button variant="accent" fullWidth onClick={onNext}>
        실습 시작
      </Button>
    </div>
  );
}
