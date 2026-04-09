'use client';

import Link from 'next/link';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import styles from './onboarding.module.css';

export default function OnboardingClient() {
  return (
    <>
      <div className="gradient-bg" aria-hidden="true" />
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.backLink}>
              &larr; HLB 보컬스튜디오
            </Link>
            <nav className={styles.headerNav}>
              <Link href="/journey" className={styles.headerLink}>소리의 길</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHead}>
            <div className="section-kicker">AI 상담</div>
            <h1 className="section-title">
              목소리를 분석하고<br /><em>맞춤 로드맵</em>을 제시합니다
            </h1>
            <p className="section-desc">
              녹음 한 번으로 AI가 긴장 상태를 분석하고, 당신만의 학습 경로를 설계합니다.
            </p>
          </div>
          <OnboardingWizard />
        </div>
      </main>
    </>
  );
}
