'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import Button from '@/components/ds/Button';
import s from './StepRecording.module.css';

const MIN_SEC = 5;
const MAX_SEC = 30;

export default function StepRecording() {
  const { setStep, setAnalyzing, setError, setResult } = useOnboardingStore();

  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (!audioBlob) return;
    if (!fileName && elapsed < MIN_SEC) {
      setError(`최소 ${MIN_SEC}초 이상 녹음해주세요.`);
      return;
    }

    setSubmitting(true);
    setStep(1);
    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, fileName ?? 'recording.webm');

      const res = await fetch('/api/onboarding-analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errBody.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      setStep(2);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '분석에 실패했습니다.';
      setError(msg);
      setStep(0);
    } finally {
      setAnalyzing(false);
      setSubmitting(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s_ = sec % 60;
    return `${m}:${s_.toString().padStart(2, '0')}`;
  };

  return (
    <div className={s.container}>
      <h3 className={s.title}>목소리를 들려주세요</h3>
      <p className={s.desc}>
        편하게 아무 노래나 한 소절 불러주세요. AI가 목소리 상태를 분석하고 맞춤 로드맵을 만들어드립니다.
      </p>

      <div className={s.recArea}>
        <button
          type="button"
          className={`${s.recBtn} ${isRecording ? s.recBtnActive : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={submitting}
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

      {audioBlob && !isRecording && (
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
          disabled={isRecording || submitting}
        />
      </label>

      {audioBlob && !isRecording && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '분석 중...' : '분석 시작'}
        </Button>
      )}
    </div>
  );
}
