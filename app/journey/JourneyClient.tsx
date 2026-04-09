'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hlbCurriculum } from '@/lib/data/hlbCurriculum';
import { useJourneyStore } from '@/stores/journeyStore';
import StageCard from '@/components/journey/StageCard';

export default function JourneyClient() {
  const router = useRouter();
  const { getStageStatus, progress } = useJourneyStore();

  const blocks = hlbCurriculum.reduce<Record<string, typeof hlbCurriculum>>((acc, stage) => {
    const key = stage.block;
    if (!acc[key]) acc[key] = [];
    acc[key].push(stage);
    return acc;
  }, {});

  const completedCount = Object.values(progress).filter((p) => p?.passedAt).length;

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      color: 'var(--text-primary)',
    }}>
      {/* 상단 네비 */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
      }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', textDecoration: 'none' }}>
          HLB 보컬스튜디오
        </Link>
        <div className="app-nav-links">
          <Link href="/scale-practice" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 10px', borderRadius: 6 }}>스케일</Link>
          <Link href="/coach" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 10px', borderRadius: 6 }}>AI 코치</Link>
          <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 10px', borderRadius: 6 }}>대시보드</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 20px 60px' }}>
        <header style={{ padding: '32px 0 24px' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>소리의 길</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
            {completedCount}개 완료 · 전체 {hlbCurriculum.length}단계
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {Object.entries(blocks).map(([blockName, stages]) => (
            <section key={blockName}>
              <h2 style={{
                fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
                letterSpacing: '0.03em', marginBottom: 10, paddingLeft: 2,
              }}>
                {blockName}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stages.map((stage) => {
                  const status = getStageStatus(stage.id);
                  const prog = progress[stage.id];
                  return (
                    <StageCard
                      key={stage.id}
                      stage={stage}
                      status={status}
                      bestScore={prog?.bestScore ?? 0}
                      onClick={() => router.push(`/journey/${stage.id}`)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
