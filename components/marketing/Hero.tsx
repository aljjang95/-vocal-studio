'use client';

import { useRouter } from 'next/navigation';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import Button from '@/components/ds/Button';
import styles from './Hero.module.css';

export default function Hero() {
  const router = useRouter();
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80"
          alt=""
          loading="eager"
        />
      </div>

      <div className={styles.content} ref={ref}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          4축 긴장 감지 AI · 7년 경력 커리큘럼
        </div>

        <h1 className={styles.title}>
          목이 조이는 이유,
          <br />
          <em className={styles.titleEm}>이제 알 수 있습니다</em>
        </h1>

        <p className={styles.subtitle}>
          후두·혀뿌리·턱의 긴장을 AI가 실시간으로 분석합니다.{' '}
          <br className={styles.desktopBr} />
          원인을 알면, 달라집니다.
        </p>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => router.push('/onboarding')}>
            무료 상담 시작하기
          </Button>
          <Button variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            어떻게 다른지 보기
          </Button>
        </div>

        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>7년+</span>
            <span className={styles.trustLabel}>트레이닝 경력</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>28단계</span>
            <span className={styles.trustLabel}>체계적 커리큘럼</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>4축</span>
            <span className={styles.trustLabel}>실시간 긴장 감지</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>무료</span>
            <span className={styles.trustLabel}>18단계까지 체험</span>
          </div>
        </div>
      </div>
    </section>
  );
}
