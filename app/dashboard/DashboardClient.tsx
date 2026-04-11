'use client';

import { useEffect, useState } from 'react';
import { useJourneyStore } from '@/stores/journeyStore';
import Nav from '@/components/shared/Nav';
import ProgressCard from '@/components/dashboard/ProgressCard';
import TodayPractice from '@/components/dashboard/TodayPractice';
import GrowthChart from '@/components/dashboard/GrowthChart';

export default function DashboardClient() {
  const [hydrated, setHydrated] = useState(false);
  const syncFromSupabase = useJourneyStore((s) => s.syncFromSupabase);

  useEffect(() => {
    setHydrated(true);
    syncFromSupabase();
  }, [syncFromSupabase]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)]">
        <Nav />
        <div className="max-w-[1200px] mx-auto px-7 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[40vh] text-[var(--text-secondary)] text-[0.95rem]">
            불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Nav />
      <div className="max-w-[1200px] mx-auto px-7 pt-24 pb-16 max-md:px-4 max-md:pt-[88px] max-md:pb-10">
        <header className="mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-[var(--fs-h1)] text-[var(--text-primary)] tracking-tight m-0 mb-1.5 max-md:text-[1.4rem]">
            대시보드
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-[0.95rem] m-0">
            보컬 트레이닝 현황을 한눈에 확인하세요
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          <ProgressCard />
          <TodayPractice />
        </div>

        <section className="mt-0">
          <GrowthChart />
        </section>
      </div>
    </div>
  );
}
