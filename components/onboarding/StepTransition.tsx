'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function StepTransition() {
  const router = useRouter();
  const { result, saveToSupabase } = useOnboardingStore();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const suggestedStage = result?.consultation.suggested_stage_id ?? 1;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      // 로그인 상태면 자동으로 Supabase에 저장
      if (data.user && result && !saved) {
        saveToSupabase().then(() => setSaved(true));
      }
    });
  }, [result, saved, saveToSupabase]);

  const handleStartLesson = (stageId: number) => {
    if (user) {
      router.push(`/journey/${stageId}`);
    } else {
      // 비로그인: 가입 페이지로 보내고, 가입 후 추천 레슨으로
      router.push(`/auth/signup?next=/journey/${stageId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] gap-6 text-center animate-[fadeIn_0.5s_ease-out]">
      <h3 className="font-['Inter',sans-serif] text-[1.6rem] font-bold">
        레슨을 시작할 준비가 됐어요
      </h3>
      <p className="text-[0.9rem] text-[var(--text2)] leading-relaxed max-w-[420px]">
        분석 결과를 바탕으로 최적의 시작점을 추천합니다.
      </p>

      <div className="px-7 py-4 bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.2)] rounded-[var(--r-xs)] text-[0.88rem] text-[var(--accent-lt)]">
        <div className="text-[0.78rem] text-[var(--text2)] mb-1">추천 시작 단계</div>
        <div className="font-mono font-bold text-[1.1rem]">Stage {suggestedStage}</div>
      </div>

      {!user && (
        <p className="text-[0.82rem] text-[var(--accent-lt)] bg-[rgba(59,130,246,0.04)] border border-[rgba(59,130,246,0.12)] rounded-lg px-4 py-2.5 max-w-[380px]">
          가입하면 분석 결과가 저장되고, 맞춤 커리큘럼으로 이어갑니다.
        </p>
      )}

      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={() => handleStartLesson(suggestedStage)}
        >
          {user ? '추천 단계로 시작하기' : '가입하고 시작하기'}
        </Button>
        <button
          type="button"
          className="bg-transparent border-none text-[var(--text2)] text-[0.85rem] font-[var(--font-sans)] cursor-pointer py-2 transition-colors duration-200 hover:text-[var(--text)]"
          onClick={() => handleStartLesson(1)}
        >
          처음부터 시작하기
        </button>
      </div>
    </div>
  );
}
