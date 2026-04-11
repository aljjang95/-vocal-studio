'use client';

import { useRouter } from 'next/navigation';
import { GlowCard } from '@/components/ui/glow-card';

export default function Pricing() {
  const router = useRouter();

  const goCheckout = (plan: string) => router.push(`/checkout/${plan}`);
  const goSignup = () => router.push('/auth/signup');

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-[1200px] mx-auto px-7">
        <div className="text-center mb-10">
          <div className="section-kicker" style={{ justifyContent: 'center' }}>요금제</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            오프라인 레슨 그대로,<br />온라인으로
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] text-center mt-3 leading-relaxed">
            사설 레슨 1회 평균 5만원. 발성전문반은 한 달 내내 AI 코칭.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {/* 무료 */}
          <GlowCard className="p-6 flex flex-col">
            <div className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">무료</div>
            <p className="text-[13px] text-[var(--text-muted)] mt-0 mb-5 leading-normal">가볍게 시작하기</p>
            <div className="flex items-baseline gap-0.5 mb-0.5">
              <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">무료</span>
            </div>
            <div className="text-sm text-[var(--text-muted)] mb-5">광고 포함</div>
            <div className="h-px bg-[var(--border-subtle)] mb-5" />
            <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-2.5 flex-1">
              <Feature on>18단계까지 채점 기반 진행</Feature>
              <Feature on>이완 ~ 두성밸런스 코스</Feature>
              <Feature on>피아노 스케일 연습</Feature>
              <Feature on>기본 긴장 감지</Feature>
              <Feature on>목소리 변환 (내장 프리셋)</Feature>
              <Feature on note>광고 포함</Feature>
              <Feature off>19~28단계 (세팅~가창)</Feature>
              <Feature off>4축 긴장 상세 분석</Feature>
              <Feature off>성장 리포트</Feature>
            </ul>
            <button
              onClick={goSignup}
              className="mt-auto pt-6 w-full py-2.5 rounded-lg font-medium transition-colors border border-white/[0.10] text-[var(--text-secondary)] hover:bg-white/[0.04]"
            >
              무료로 시작
            </button>
          </GlowCard>

          {/* 정액제 */}
          <GlowCard className="p-6 flex flex-col">
            <div className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">정액제</div>
            <p className="text-[13px] text-[var(--text-muted)] mt-0 mb-5 leading-normal">광고 없이 마음껏</p>
            <div className="flex items-baseline gap-0.5 mb-0.5">
              <span className="text-base font-medium text-[var(--text-secondary)]">₩</span>
              <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">19,900</span>
            </div>
            <div className="text-sm text-[var(--text-muted)] mb-5">/ 월</div>
            <div className="h-px bg-[var(--border-subtle)] mb-5" />
            <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-2.5 flex-1">
              <Feature on>무료 콘텐츠 전부 포함</Feature>
              <Feature on>광고 완전 제거</Feature>
              <Feature on>발성 분석 리포트 무제한</Feature>
              <Feature on>곡 연습 + 구간 분석</Feature>
              <Feature on>AI 코치 채팅 무제한</Feature>
              <Feature off>채점 기반 해금 (19~28단계)</Feature>
              <Feature off>4축 긴장 상세 분석</Feature>
              <Feature off>맞춤 커리큘럼 설계</Feature>
            </ul>
            <button
              onClick={() => goCheckout('subscription')}
              className="mt-auto pt-6 w-full py-2.5 rounded-lg font-medium transition-colors border border-white/[0.10] text-[var(--text-secondary)] hover:bg-white/[0.04]"
            >
              정액제 시작
            </button>
          </GlowCard>

          {/* 발성전문반 */}
          <GlowCard active className="p-6 flex flex-col relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white bg-[var(--accent)] px-3 py-0.5 rounded">
              추천
            </span>
            <div className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">발성전문반</div>
            <p className="text-[13px] text-[var(--text-muted)] mt-0 mb-5 leading-normal">발성 매커니즘 기반, 체계적 성장</p>
            <div className="flex items-baseline gap-0.5 mb-0.5">
              <span className="text-base font-medium text-[var(--text-secondary)]">₩</span>
              <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">150,000</span>
            </div>
            <div className="text-sm text-[var(--text-muted)] mb-5">/ 월</div>
            <div className="h-px bg-[var(--border-subtle)] mb-5" />
            <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-2.5 flex-1">
              <Feature on>정액제 전부 포함</Feature>
              <Feature on>28단계 채점 기반 해금</Feature>
              <Feature on>세팅 → 고음 → 가창 코스</Feature>
              <Feature on>4축 긴장 분석 (후두/혀뿌리/턱/성구)</Feature>
              <Feature on>단계별 매커니즘 AI 해설</Feature>
              <Feature on>1:1 맞춤 커리큘럼 + 루틴</Feature>
              <Feature on>일간 + 주간 성장 리포트</Feature>
              <Feature on>발성 분석 리포트 + AI 커버</Feature>
            </ul>
            <button
              onClick={() => goCheckout('pro')}
              className="mt-auto pt-6 w-full py-2.5 rounded-lg font-medium transition-colors bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
            >
              발성전문반 시작
            </button>
          </GlowCard>

          {/* 유료 피드백 */}
          <GlowCard className="p-6 flex flex-col">
            <div className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">유료 피드백</div>
            <p className="text-[13px] text-[var(--text-muted)] mt-0 mb-5 leading-normal">선생님이 직접 듣고 진단</p>
            <div className="flex items-baseline gap-0.5 mb-0.5">
              <span className="text-base font-medium text-[var(--text-secondary)]">₩</span>
              <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">50,000</span>
            </div>
            <div className="text-sm text-[var(--text-muted)] mb-5">/ 1회</div>
            <div className="h-px bg-[var(--border-subtle)] mb-5" />
            <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-2.5 flex-1">
              <Feature on>녹음 제출 → 선생님 직접 청취</Feature>
              <Feature on>AI 진단 + 선생님 소견 비교</Feature>
              <Feature on>구체적 개선 방향 제시</Feature>
              <Feature on>7년 경력 전문 트레이너</Feature>
              <Feature on>모든 플랜에서 추가 구매 가능</Feature>
            </ul>
            <button
              onClick={() => goCheckout('feedback')}
              className="mt-auto pt-6 w-full py-2.5 rounded-lg font-medium transition-colors border border-white/[0.10] text-[var(--text-secondary)] hover:bg-white/[0.04]"
            >
              피드백 신청
            </button>
          </GlowCard>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          발성전문반 · 정액제는 언제든 해지 가능 · 유료 피드백은 건당 결제
        </p>
      </div>
    </section>
  );
}

function Feature({ on, off, note, children }: {
  on?: boolean; off?: boolean; note?: boolean; children: React.ReactNode;
}) {
  const included = on && !off;
  return (
    <li className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${!included ? 'text-[var(--text-muted)] opacity-50' : ''}`}>
      {included ? (
        <svg className="text-[var(--accent-light)] flex-shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className="text-[var(--text-muted)] flex-shrink-0 opacity-40" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )}
      <span className={note ? 'text-[var(--text-muted)] italic' : ''}>{children}</span>
    </li>
  );
}
