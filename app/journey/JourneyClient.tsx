'use client';

import { useRouter } from 'next/navigation';
import { hlbCurriculum } from '@/lib/data/hlbCurriculum';
import { useJourneyStore } from '@/stores/journeyStore';
import StageCard from '@/components/journey/StageCard';

export default function JourneyClient() {
  const router = useRouter();
  const { getStageStatus, progress } = useJourneyStore();

  const blocks = hlbCurriculum.reduce<Record<string, typeof hlbCurriculum>>((acc, stage) => {
    const key = `${stage.blockIcon} ${stage.block}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(stage);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <header className="text-center py-6">
        <h1 className="text-2xl font-bold">소리의 길</h1>
        <p className="text-gray-400 mt-1">몸이 기억하는 소리를 찾아가는 여정</p>
      </header>
      <div className="max-w-md mx-auto space-y-8">
        {Object.entries(blocks).map(([blockName, stages]) => (
          <section key={blockName}>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">{blockName}</h2>
            <div className="space-y-2 relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />
              {stages.map((stage) => {
                const status = getStageStatus(stage.id);
                const prog = progress[stage.id];
                return (
                  <div key={stage.id} className="relative z-10">
                    <StageCard
                      stage={stage}
                      status={status}
                      bestScore={prog?.bestScore ?? 0}
                      onClick={() => router.push(`/journey/${stage.id}`)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
