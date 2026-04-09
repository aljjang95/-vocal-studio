'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { HLBCurriculumStage } from '@/types';
import type { SessionReport, TensionData } from '@/lib/hooks/useRealtimeEval';
import { useRealtimeEval } from '@/lib/hooks/useRealtimeEval';
import PitchVisualizer from '@/components/journey/PitchVisualizer';
import TensionIndicator from '@/components/journey/TensionIndicator';
import LiveFeedbackToast from '@/components/journey/LiveFeedbackToast';
import VoiceVisualizer from '@/components/journey/VoiceVisualizer';
import s from './PracticePhase.module.css';

interface Props {
  stage: HLBCurriculumStage;
  stageId: number;
  onComplete: (report: SessionReport, tensionHistory: TensionData[]) => void;
}

function classifyFeedback(feedback: string): 'positive' | 'neutral' | 'correction' {
  if (!feedback) return 'neutral';
  const lower = feedback.toLowerCase();
  if (lower.includes('좋') || lower.includes('잘') || lower.includes('편안') || lower.includes('유지')) {
    return 'positive';
  }
  if (lower.includes('긴장') || lower.includes('힘') || lower.includes('조') || lower.includes('올라')) {
    return 'correction';
  }
  return 'neutral';
}

const PITCH_HISTORY_MAX = 50;

export default function PracticePhase({ stage, stageId, onComplete }: Props) {
  const {
    isRecording, isConnected, latestResult, report,
    tensionHistory, startSession, stopSession, error,
  } = useRealtimeEval();

  const completedRef = useRef(false);
  const [pitchHistory, setPitchHistory] = useState<number[]>([]);

  // report 도착 시 onComplete 호출 (1회만)
  useEffect(() => {
    if (report && !completedRef.current) {
      completedRef.current = true;
      onComplete(report, tensionHistory);
    }
  }, [report, onComplete]);

  // Accumulate pitch history from analysis chunks
  useEffect(() => {
    if (latestResult) {
      const pitch = latestResult.avg_pitch_hz ?? 0;
      setPitchHistory((prev) => {
        const next = [...prev, pitch];
        return next.length > PITCH_HISTORY_MAX ? next.slice(-PITCH_HISTORY_MAX) : next;
      });
    }
  }, [latestResult]);

  const handleToggle = useCallback(() => {
    if (isRecording) {
      stopSession();
    } else {
      completedRef.current = false;
      setPitchHistory([]);
      startSession(stageId);
    }
  }, [isRecording, stopSession, startSession, stageId]);

  const targetPitches = stage.pattern.map((semitone) => 261.6 * Math.pow(2, semitone / 12));

  const feedbackMsg = latestResult?.feedback ?? null;
  const feedbackType = feedbackMsg ? classifyFeedback(feedbackMsg) : 'neutral';

  return (
    <div className={s.container}>
      {isConnected && (
        <div className={s.connected}>
          <span className={s.connDot} />
          실시간
        </div>
      )}

      <div className={s.stageInfo}>
        <p>
          발음: <strong>{stage.pronunciation}</strong> / BPM: {stage.bpmRange[0]}~{stage.bpmRange[1]} / {stage.scaleType}
        </p>
        <p className={s.detail}>{stage.evaluationCriteria.description}</p>
      </div>

      <VoiceVisualizer
        isRecording={isRecording}
        currentPitch={latestResult?.avg_pitch_hz}
        tensionData={latestResult?.tension ? {
          laryngeal: latestResult.tension.laryngeal,
          tongueRoot: latestResult.tension.tongue_root,
          jaw: latestResult.tension.jaw,
          registerBreak: latestResult.tension.register_break,
        } : undefined}
        pitchHistory={pitchHistory}
      />

      <PitchVisualizer
        targetPitches={targetPitches}
        currentPitch={null}
        isActive={isRecording}
      />

      <div className={s.recordRow}>
        <button
          className={`${s.recordBtn} ${isRecording ? s.recording : s.idle}`}
          onClick={handleToggle}
        >
          {isRecording ? '\u23F9' : '\uD83C\uDFA4'}
        </button>
      </div>

      {error && <div className={s.error}>{error}</div>}

      {isRecording && (
        <>
          <TensionIndicator
            tension={latestResult?.tension ?? null}
            feedback={latestResult?.feedback ?? ''}
          />
          <LiveFeedbackToast message={feedbackMsg} type={feedbackType} />
        </>
      )}
    </div>
  );
}
