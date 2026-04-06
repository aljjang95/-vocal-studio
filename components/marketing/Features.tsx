'use client';

import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import Card from '@/components/ds/Card';
import styles from './Features.module.css';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
      </svg>
    ),
    title: '실시간 긴장 감지',
    desc: 'AI가 후두, 혀뿌리, 턱의 긴장을 실시간으로 분석하고 이완 방법을 안내합니다.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M7 6V4M12 6V4M17 6V4"/>
      </svg>
    ),
    title: '피아노 스케일 연습',
    desc: '그랜드 피아노와 함께 스케일 연습. 3단계 채점으로 실력을 측정합니다.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: 'AI 커버 생성',
    desc: '당신의 음성을 학습한 AI 모델로 좋아하는 노래를 커버합니다.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: '맞춤형 성장 리포트',
    desc: '매 세션마다 음역대, 음정 정확도, 긴장도 변화를 추적합니다.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: '24시간 AI 코치',
    desc: '실제 보컬 트레이너의 7년 노하우가 담긴 AI가 24시간 맞춤 코칭을 제공합니다.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
    title: '개인 맞춤 루틴',
    desc: '목표와 연습 가능 시간을 입력하면 AI가 주간 루틴을 자동으로 설계합니다.',
  },
];

export default function Features() {
  const headRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className={styles.features}>
      <div className="container">
        <div className={styles.head} ref={headRef}>
          <div className="section-kicker">Features</div>
          <h2 className="section-title">
            AI가 당신의 몸을 읽습니다
          </h2>
          <p className="section-desc">
            후두, 혀뿌리, 턱의 긴장을 실시간으로 분석하고, 편안한 발성으로 안내합니다.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <Card key={f.title} glow interactive>
              <div className={styles.iconBox}>
                {f.icon}
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
