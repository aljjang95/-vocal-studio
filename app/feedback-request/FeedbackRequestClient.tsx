'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ds/Card';
import Button from '@/components/ds/Button';
import s from './FeedbackRequest.module.css';

const MIN_SEC = 5;
const MAX_SEC = 60;
const MAX_CHARS = 1000;

export default function FeedbackRequestClient() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [concern, setConcern] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    setFileName(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        cleanup();
      };

      recorder.start(250);
      setIsRecording(true);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_SEC) {
            recorderRef.current?.stop();
            setIsRecording(false);
          }
          return next;
        });
      }, 1000);
    } catch {
      setError('마이크 권한을 허용해주세요.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioBlob(file);
    setFileName(file.name);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setError('녹음 또는 파일을 업로드해주세요.');
      return;
    }
    if (!fileName && elapsed < MIN_SEC) {
      setError(`최소 ${MIN_SEC}초 이상 녹음해주세요.`);
      return;
    }
    if (concern.trim().length === 0) {
      setError('고민이나 요청사항을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, fileName ?? 'recording.webm');
      formData.append('concern', concern.trim());

      const res = await fetch('/api/feedback-request', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${m}:${remainder.toString().padStart(2, '0')}`;
  };

  const hasAudio = audioBlob !== null && !isRecording;

  if (submitted) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.header}>
            <h1 className={s.title}>신청 완료</h1>
            <p className={s.subtitle}>
              녹음과 요청사항이 접수되었습니다. 선생님이 확인 후 피드백을 보내드립니다.
            </p>
            <p className={s.subtitle} style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              결제 시스템은 준비 중입니다. 현재는 무료 체험으로 1회 제공됩니다.
            </p>
          </div>
          <Button variant="accent" fullWidth onClick={() => router.push('/dashboard')}>
            대시보드로 이동
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div style={{ marginBottom: 16 }}>
          <Link href="/pricing" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>
            &larr; 요금제로 돌아가기
          </Link>
        </div>
        {/* 헤더 */}
        <div className={s.header}>
          <h1 className={s.title}>유료 피드백 신청</h1>
          <p className={s.subtitle}>
            녹음을 업로드하시면, 선생님이 직접 듣고 개인 맞춤 피드백을 보내드려요.
          </p>
        </div>

        {/* 안내 */}
        <Card>
          <div className={s.infoInner}>
            <h3 className={s.infoTitle}>진행 과정</h3>
            <ol className={s.infoList}>
              <li className={s.infoItem}>
                <span className={s.infoNum}>1</span>
                녹음을 올리고 고민/요청사항을 작성해주세요
              </li>
              <li className={s.infoItem}>
                <span className={s.infoNum}>2</span>
                결제가 완료되면 선생님에게 전달됩니다
              </li>
              <li className={s.infoItem}>
                <span className={s.infoNum}>3</span>
                7년 경력 전문 트레이너가 직접 듣고 소견을 작성합니다
              </li>
              <li className={s.infoItem}>
                <span className={s.infoNum}>4</span>
                AI 분석 + 선생님 소견을 비교한 맞춤 피드백을 받아보세요
              </li>
            </ol>
          </div>
        </Card>

        {/* 녹음 영역 */}
        <Card>
          <div className={s.recSection}>
            <p className={s.sectionLabel}>목소리 녹음</p>

            <div className={s.recArea}>
              <button
                type="button"
                className={`${s.recBtn} ${isRecording ? s.recBtnActive : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
              >
                <div className={`${s.recIcon} ${isRecording ? s.recIconStop : ''}`} />
              </button>
              <span className={`${s.timer} ${isRecording ? s.timerActive : ''}`}>
                {formatTime(elapsed)}
              </span>
              {isRecording && (
                <span className={s.hint}>
                  {elapsed < MIN_SEC
                    ? `${MIN_SEC - elapsed}초 더 녹음해주세요`
                    : '중지 버튼을 눌러 완료하세요'}
                </span>
              )}
            </div>

            {hasAudio && (
              <p className={s.fileName}>
                {fileName ?? `녹음 완료 (${elapsed}초)`}
              </p>
            )}

            <div className={s.divider}>또는</div>

            <label className={s.uploadLabel}>
              파일 업로드
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className={s.uploadInput}
                disabled={isRecording}
              />
            </label>
          </div>
        </Card>

        {/* 고민/요청사항 */}
        <Card>
          <div className={s.textSection}>
            <p className={s.sectionLabel}>고민 / 요청사항</p>
            <textarea
              className={s.textarea}
              placeholder="고음에서 목이 잠기는 느낌이 있어요, 비브라토 연습 방법이 궁금해요 등 자유롭게 적어주세요."
              value={concern}
              onChange={(e) => setConcern(e.target.value.slice(0, MAX_CHARS))}
              maxLength={MAX_CHARS}
            />
            <span className={s.charCount}>{concern.length} / {MAX_CHARS}</span>
          </div>
        </Card>

        {/* 가격 + CTA */}
        <div className={s.ctaSection}>
          <div className={s.priceRow}>
            <span className={s.price}>50,000원</span>
            <span className={s.pricePer}>/ 1회</span>
          </div>

          {error && <p className={s.errorMsg}>{error}</p>}

          <Button variant="accent" size="lg" fullWidth onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '신청 중...' : '피드백 신청하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
