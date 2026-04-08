'use client';

import { useEffect, useRef, useState } from 'react';
import type { HLBCurriculumStage } from '@/types';
import type { SessionReport, TensionData } from '@/lib/hooks/useRealtimeEval';
import { useJourneyStore } from '@/stores/journeyStore';
import SessionReportPanel from '@/components/journey/SessionReportPanel';
import Button from '@/components/ds/Button';
import s from './EvalPhase.module.css';

interface Props {
  stage: HLBCurriculumStage;
  stageId: number;
  report: SessionReport;
  tensionHistory: TensionData[];
  onNext: () => void;
}

export default function EvalPhase({ stage, stageId, report, tensionHistory, onNext }: Props) {
  const { submitEvaluation } = useJourneyStore();
  const submittedRef = useRef(false);
  const [ragFeedback, setRagFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (submittedRef.current) return;
    if (!report.stats) return;
    submittedRef.current = true;

    const avgTension = report.stats.avg_tension;
    const passed = avgTension < 40 && report.stats.chunk_count >= 3;
    const score = Math.max(0, Math.min(100, Math.round(100 - avgTension)));

    // 부위별 평균 긴장도 계산 (실제 tensionHistory 기반)
    const avgByAxis = (key: keyof TensionData) => {
      if (tensionHistory.length === 0) return 0;
      const vals = tensionHistory.map((t) => Number(t[key]) || 0);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    const tensionDetail = report.stats.main_issues?.join(', ') || '이완 상태';

    submitEvaluation(stageId, {
      score,
      pitchAccuracy: score,
      toneStability: 100 - avgTension,
      tensionDetected: report.stats.tension_events > 0,
      tension: {
        overall: avgTension,
        laryngeal: avgByAxis('laryngeal'),
        tongue_root: avgByAxis('tongue_root'),
        jaw: avgByAxis('jaw'),
        register_break: avgByAxis('register_break'),
        detail: tensionDetail,
      },
      feedback: report.summary,
      passed,
    });

    // RAG 코칭 피드백 — 음성 질감 기반 선생님 사례 검색
    fetch('/api/journey-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage_id: stageId,
        user_message: tensionDetail,
        score,
        pitch_accuracy: score,
        tension_detail: tensionDetail,
      }),
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.feedback) setRagFeedback(data.feedback); })
      .catch(() => {});
  }, [report, stageId, submitEvaluation, tensionHistory]);

  return (
    <div className={s.container}>
      <SessionReportPanel report={report} tensionHistory={tensionHistory} />

      {ragFeedback && (
        <div className={s.ragFeedback}>
          <span className={s.ragLabel}>선생님 코칭</span>
          <p>{ragFeedback}</p>
        </div>
      )}

      <Button variant="accent" fullWidth onClick={onNext}>
        요약 보기
      </Button>
    </div>
  );
}
