'use client';

import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import Button from '@/components/ds/Button';
import styles from './CtaSection.module.css';

export default function CtaSection() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="cta" className={styles.cta}>
      <div className={styles.bg} aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1920&q=80"
          alt=""
          loading="lazy"
        />
      </div>
      <div className="container">
        <div className={styles.content} ref={ref}>
          <h2 className={styles.title}>지금 시작하세요</h2>
          <p className={styles.subtitle}>
            첫 5단계는 무료입니다. 당신의 목소리가 어떻게 변하는지 직접 경험하세요.
          </p>
          <Button variant="primary" size="lg" onClick={() => window.location.href = '/diagnosis'}>
            무료 체험 시작
          </Button>
        </div>
      </div>
    </section>
  );
}
