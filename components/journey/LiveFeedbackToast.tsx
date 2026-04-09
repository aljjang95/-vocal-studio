'use client';

import { useEffect, useRef, useState } from 'react';
import s from './LiveFeedbackToast.module.css';

type ToastType = 'positive' | 'neutral' | 'correction';

interface Props {
  message: string | null;
  type: ToastType;
}

const AUTO_DISMISS_MS = 3000;
const EXIT_ANIMATION_MS = 300;

export default function LiveFeedbackToast({ message, type }: Props) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const [displayType, setDisplayType] = useState<ToastType>('neutral');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message) return;

    // Clear any pending dismiss
    if (timerRef.current) clearTimeout(timerRef.current);

    setDisplayMessage(message);
    setDisplayType(type);
    setExiting(false);
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, EXIT_ANIMATION_MS);
    }, AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, type]);

  if (!visible || !displayMessage) return null;

  const toastCls = [s.toast, s[displayType], exiting && s.exiting]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={s.wrapper}>
      <div className={toastCls}>{displayMessage}</div>
    </div>
  );
}
