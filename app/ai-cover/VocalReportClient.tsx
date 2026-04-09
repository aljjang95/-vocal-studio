'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import s from './VocalReport.module.css';

type Phase = 'idle' | 'recording' | 'analyzing' | 'result';

interface TensionScore {
  overall: number;
  laryngeal: number;
  tongue_root: number;
  jaw: number;
  register_break: number;
  detail: string;
}

interface AnalysisResult {
  tension: TensionScore;
  consultation: {
    problems: string[];
    roadmap: string[];
    suggested_stage_id: number;
    summary: string;
  };
}

const AXIS_LABELS: Record<string, string> = {
  laryngeal: '후두 긴장',
  tongue_root: '혀뿌리 긴장',
  jaw: '턱 긴장',
  register_break: '성구전환',
};

function TensionBar({ label, value }: { label: string; value: number }) {
  const color = value < 30 ? '#34d399' : value < 60 ? '#fbbf24' : '#f87171';
  const statusText = value < 30 ? '양호' : value < 60 ? '주의' : '긴장';

  return (
    <div className={s.barItem}>
      <div className={s.barHeader}>
        <span className={s.barLabel}>{label}</span>
        <span className={s.barValue} style={{ color }}>{value}<span className={s.barUnit}>/ 100</span></span>
      </div>
      <div className={s.barTrack}>
        <div
          className={s.barFill}
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <div className={s.barStatus} style={{ color }}>{statusText}</div>
    </div>
  );
}

export default function VocalReportClient() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start(200);
      mediaRef.current = mr;
      setPhase('recording');
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((n) => n + 1), 1000);
    } catch {
      setError('마이크 권한이 필요합니다');
    }
  }, []);

  const stopAndAnalyze = useCallback(async () => {
    if (!mediaRef.current) return;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }

    const mr = mediaRef.current;
    mr.stop();
    setPhase('analyzing');

    await new Promise<void>((resolve) => {
      mr.onstop = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        resolve();
      };
    });

    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const fd = new FormData();
    fd.append('audio', blob, 'recording.webm');

    try {
      const res = await fetch('/api/onboarding-analyze', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('분석 실패');
      const data: AnalysisResult = await res.json();
      setResult(data);
      setPhase('result');
    } catch {
      setError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      setPhase('idle');
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError('');
    setElapsed(0);
  }, []);

  return (
    <div className={s.page}>
      <div className={s.container}>

        {/* 상단 네비 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>&larr; HLB 보컬스튜디오</Link>
          <Link href="/journey" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>소리의 길</Link>
        </div>

        {/* 헤더 */}
        <div className={s.header}>
          <div className={s.badge}>발성 분석</div>
          <h1 className={s.title}>지금 내 목소리 상태</h1>
          <p className={s.subtitle}>
            노래 한 소절을 부르면 AI가 4축 긴장도를 측정합니다
          </p>
        </div>

        {/* idle */}
        {phase === 'idle' && (
          <div className={s.idleSection}>
            <div className={s.micCircle} onClick={startRecording}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <p className={s.hint}>버튼을 눌러 녹음 시작</p>
            <p className={s.hintSub}>편하게 아무 노래나 5~10초 불러주세요</p>
            {error && <p className={s.errorText}>{error}</p>}
          </div>
        )}

        {/* recording */}
        {phase === 'recording' && (
          <div className={s.recordingSection}>
            <div className={s.micCircleRecording} onClick={stopAndAnalyze}>
              <div className={s.recDot} />
            </div>
            <p className={s.recTime}>{elapsed}초 녹음 중</p>
            <p className={s.hint}>버튼을 눌러 분석 시작</p>
            <p className={s.hintSub}>최소 5초 이상 녹음하면 더 정확합니다</p>
          </div>
        )}

        {/* analyzing */}
        {phase === 'analyzing' && (
          <div className={s.analyzingSection}>
            <div className={s.spinner} />
            <p className={s.analyzingText}>AI가 분석하는 중...</p>
            <p className={s.hintSub}>후두·혀뿌리·턱 긴장을 측정합니다</p>
          </div>
        )}

        {/* result */}
        {phase === 'result' && result && (
          <div className={s.resultSection}>
            {/* 종합 점수 */}
            <div className={s.overallCard}>
              <div className={s.overallLabel}>종합 긴장 점수</div>
              <div className={s.overallScore} style={{
                color: result.tension.overall < 30 ? '#34d399' : result.tension.overall < 60 ? '#fbbf24' : '#f87171',
              }}>
                {result.tension.overall}
                <span className={s.overallUnit}>/ 100</span>
              </div>
              <div className={s.overallDesc}>
                {result.tension.overall < 30 ? '긴장이 거의 없습니다' :
                  result.tension.overall < 60 ? '부분적인 긴장이 감지됩니다' :
                    '전반적인 긴장 완화가 필요합니다'}
              </div>
            </div>

            {/* 4축 바 */}
            <div className={s.barsSection}>
              <h3 className={s.barsTitle}>4축 분석</h3>
              {(Object.entries(AXIS_LABELS) as [keyof typeof AXIS_LABELS, string][]).map(([key, label]) => (
                <TensionBar
                  key={key}
                  label={label}
                  value={result.tension[key as keyof TensionScore] as number}
                />
              ))}
            </div>

            {/* AI 코멘트 */}
            {result.tension.detail && (
              <div className={s.detailCard}>
                <div className={s.detailLabel}>AI 분석 코멘트</div>
                <p className={s.detailText}>{result.tension.detail}</p>
              </div>
            )}

            {/* 문제점 */}
            {result.consultation.problems.length > 0 && (
              <div className={s.listCard}>
                <div className={s.listTitle}>발견된 패턴</div>
                <ul className={s.list}>
                  {result.consultation.problems.map((p, i) => (
                    <li key={i} className={s.listItem}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 추천 단계 */}
            <div className={s.suggestionCard}>
              <span className={s.suggestionLabel}>추천 시작 단계</span>
              <span className={s.suggestionStage}>단계 {result.consultation.suggested_stage_id}</span>
            </div>

            <div className={s.actions}>
              <button className={s.retryBtn} onClick={reset}>다시 분석하기</button>
              <Link href={`/journey/${result.consultation.suggested_stage_id}`} className={s.startBtn}>
                지금 연습 시작
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
