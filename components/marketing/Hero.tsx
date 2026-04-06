'use client';

import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import Button from '@/components/ds/Button';
import styles from './Hero.module.css';

export default function Hero() {
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
          AI 보컬 코칭
        </div>

        <h1 className={styles.title}>
          당신의 목소리를
          <br />
          <em className={styles.titleEm}>깨워드립니다</em>
        </h1>

        <p className={styles.subtitle}>
          7년 경력 보컬 트레이너의 커리큘럼과 AI 긴장 감지 기술이 결합된,
          <br />
          당신만의 보컬 코치.
        </p>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => window.location.href = '/diagnosis'}>
            무료로 시작하기
          </Button>
          <Button variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            둘러보기
          </Button>
        </div>

        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>7년+</span>
            <span className={styles.trustLabel}>트레이닝 경력</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>95%</span>
            <span className={styles.trustLabel}>수강생 만족도</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>24/7</span>
            <span className={styles.trustLabel}>AI 코칭</span>
          </div>
        </div>
      </div>
    </section>
  );
}
