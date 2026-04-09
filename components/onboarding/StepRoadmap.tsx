'use client';

import { useRef } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import Button from '@/components/ds/Button';
import s from './StepRoadmap.module.css';

export default function StepRoadmap() {
  const { result, isPlayingTts, setPlayingTts, setStep } = useOnboardingStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!result) return null;
  const { consultation } = result;

  const playTts = async () => {
    setPlayingTts(true);
    try {
      const res = await fetch('/api/onboarding-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: consultation.summary }),
      });
      if (!res.ok) throw new Error('TTS 실패');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setPlayingTts(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setPlayingTts(false);
        audioRef.current = null;
      };
      audio.play();
    } catch {
      setPlayingTts(false);
    }
  };

  const stopTts = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingTts(false);
  };

  return (
    <div className={s.container}>
      <h3 className={s.title}>맞춤 로드맵</h3>
      <p className={s.desc}>AI가 추천하는 학습 순서입니다.</p>

      <ol className={s.roadmapList}>
        {consultation.roadmap.map((item, i) => (
          <li key={i} className={s.roadmapItem}>
            <span className={s.roadmapIndex}>{i + 1}</span>
            <span className={s.roadmapText}>{item}</span>
          </li>
        ))}
      </ol>

      <div className={s.suggestedStage}>
        <span className={s.suggestedLabel}>추천 시작 단계:</span>
        <span className={s.suggestedValue}>Stage {consultation.suggested_stage_id}</span>
      </div>

      <button
        type="button"
        className={s.ttsBtn}
        onClick={isPlayingTts ? stopTts : playTts}
        disabled={false}
      >
        {isPlayingTts ? '\u23F9 재생 중지' : '\u25B6 상담 요약 듣기'}
      </button>

      <div className={s.actions}>
        <Button variant="primary" size="lg" onClick={() => setStep(4)}>
          첫 레슨 시작하기
        </Button>
      </div>
    </div>
  );
}
