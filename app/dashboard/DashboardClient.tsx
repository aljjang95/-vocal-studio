'use client';

import { useEffect, useState } from 'react';
import { useJourneyStore } from '@/stores/journeyStore';
import Nav from '@/components/shared/Nav';
import ProgressCard from '@/components/dashboard/ProgressCard';
import TodayPractice from '@/components/dashboard/TodayPractice';
import GrowthChart from '@/components/dashboard/GrowthChart';
import styles from './dashboard.module.css';

export default function DashboardClient() {
  const [hydrated, setHydrated] = useState(false);
  const syncFromSupabase = useJourneyStore((s) => s.syncFromSupabase);

  useEffect(() => {
    setHydrated(true);
    syncFromSupabase();
  }, [syncFromSupabase]);

  if (!hydrated) {
    return (
      <>
        <Nav />
        <div className={styles.container}>
          <div className={styles.loading}>불러오는 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <p className={styles.subtitle}>보컬 트레이닝 현황을 한눈에 확인하세요</p>
      </header>

      <div className={styles.grid}>
        <ProgressCard />
        <TodayPractice />
      </div>

      <section className={styles.chartSection}>
        <GrowthChart />
      </section>
      </div>
    </>
  );
}
