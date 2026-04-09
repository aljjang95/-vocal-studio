'use client';

import { useCallback, useRef, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_BACKEND_URL ?? 'ws://localhost:8001';
const CHUNK_INTERVAL_MS = 2000;

export interface TensionData {
  overall: number;
  laryngeal: number;
  tongue_root: number;
  jaw: number;
  register_break: number;
  detected: boolean;
  detail: string;
}

export interface ChunkResult {
  type: 'analysis';
  chunk_index: number;
  avg_pitch_hz: number;
  tension: TensionData | null;
  feedback: string;
}

export interface SessionReport {
  type: 'report';
  summary: string;
  improvements: string;
  focus_area: string;
  exercise: string;
  encouragement: string;
  stats: {
    chunk_count: number;
    avg_tension: number;
    max_tension: number;
    min_tension: number;
    tension_events: number;
    main_issues: string[];
  };
}

interface UseRealtimeEvalReturn {
  isRecording: boolean;
  isConnected: boolean;
  latestResult: ChunkResult | null;
  report: SessionReport | null;
  tensionHistory: TensionData[];
  startSession: (stageId: number) => Promise<void>;
  stopSession: () => void;
  error: string | null;
}

export function useRealtimeEval(): UseRealtimeEvalReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [latestResult, setLatestResult] = useState<ChunkResult | null>(null);
  const [report, setReport] = useState<SessionReport | null>(null);
  const [tensionHistory, setTensionHistory] = useState<TensionData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = useCallback(async (stageId: number) => {
    setError(null);
    setReport(null);
    setLatestResult(null);
    setTensionHistory([]);

    // 1) WebSocket 연결
    const ws = new WebSocket(`${WS_URL}/ws/evaluate`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'start', stage_id: stageId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'analysis') {
        setLatestResult(data as ChunkResult);
        if (data.tension) {
          setTensionHistory((prev) => [...prev, data.tension]);
        }
      } else if (data.type === 'report') {
        setReport(data as SessionReport);
        setIsRecording(false);
      } else if (data.type === 'error') {
        setError(data.message);
      }
    };

    ws.onerror = () => setError('WebSocket 연결 실패');
    ws.onclose = () => {
      setIsConnected(false);
      setIsRecording(false);
    };

    // 2) 마이크 스트림
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          ws.send(e.data);
        }
      };

      // WebSocket이 열린 후 녹음 시작
      const waitOpen = () => {
        if (ws.readyState === WebSocket.OPEN) {
          recorder.start(CHUNK_INTERVAL_MS);
          setIsRecording(true);
        } else {
          setTimeout(waitOpen, 50);
        }
      };
      waitOpen();
    } catch {
      setError('마이크 접근 권한이 필요합니다.');
    }
  }, []);

  const stopSession = useCallback(() => {
    // 녹음 중지
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());

    // 세션 종료 신호
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end' }));
    }

    setIsRecording(false);
  }, []);

  return {
    isRecording,
    isConnected,
    latestResult,
    report,
    tensionHistory,
    startSession,
    stopSession,
    error,
  };
}
