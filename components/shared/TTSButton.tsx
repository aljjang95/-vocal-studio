'use client';

import { useTTS } from '@/lib/hooks/useTTS';
import styles from './TTSButton.module.css';

interface TTSButtonProps {
  text: string;
  size?: 'sm' | 'md';
  label?: string;
}

function SpeakerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export default function TTSButton({ text, size = 'md', label = '듣기' }: TTSButtonProps) {
  const { play, isPlaying, isLoading } = useTTS(text);

  const displayLabel = isLoading ? '로딩' : isPlaying ? '정지' : label;

  return (
    <button
      type="button"
      className={`${styles.ttsBtn} ${styles[size]}`}
      onClick={play}
      disabled={!text}
      aria-label={displayLabel}
    >
      <span className={styles.icon}>
        {isLoading ? (
          <span className={styles.spinner} />
        ) : isPlaying ? (
          <StopIcon />
        ) : (
          <SpeakerIcon />
        )}
      </span>
      {displayLabel}
    </button>
  );
}
