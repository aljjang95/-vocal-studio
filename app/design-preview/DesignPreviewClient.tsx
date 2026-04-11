'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Play, Mic, BarChart3, Headphones,
  ChevronRight, Check, Lock, TrendingUp
} from 'lucide-react';

/* ───────────────────────────────────────────
   GLOWING SOUND WAVE — luminous green
─────────────────────────────────────────── */
function SoundWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let w = 0; w < 6; w++) {
        ctx.beginPath();
        const opacity = 0.02 + w * 0.012;
        ctx.strokeStyle = `rgba(100, 200, 140, ${opacity})`;
        ctx.lineWidth = 1.2 + w * 0.3;
        ctx.shadowColor = 'rgba(80, 180, 120, 0.15)';
        ctx.shadowBlur = 20 + w * 5;

        for (let x = 0; x < canvas.width; x += 3) {
          const y = canvas.height * 0.5
            + Math.sin(x * 0.002 + t + w * 0.8) * (40 + w * 15)
            + Math.sin(x * 0.005 + t * 1.3 + w) * (20 + w * 8)
            + Math.sin(x * 0.001 + t * 0.7) * 60;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ───────────────────────────────────────────
   ANIMATED COUNTER
─────────────────────────────────────────── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ───────────────────────────────────────────
   GLOWING CARD — 3D depth + green luminance
─────────────────────────────────────────── */
function GlowCard({ children, className = '', glow = false }: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`
      relative rounded-2xl border border-white/[0.06]
      bg-gradient-to-b from-white/[0.03] to-white/[0.01]
      backdrop-blur-sm
      shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
      ${glow ? 'shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_60px_rgba(80,180,120,0.06),inset_0_1px_0_rgba(255,255,255,0.04)]' : ''}
      ${className}
    `}
      style={{ transform: 'perspective(1000px) rotateX(0.5deg)' }}
    >
      {glow && (
        <div className="absolute -top-px -left-px -right-px h-[1px] bg-gradient-to-r from-transparent via-[#5B8C6E]/50 to-transparent" />
      )}
      {children}
    </div>
  );
}

/* ───────────────────────────────────────────
   MAIN
─────────────────────────────────────────── */
export default function DesignPreviewClient() {
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  return (
    <div className="min-h-screen bg-[#080C0A] text-[#E2E6E3] selection:bg-[#5B8C6E]/30 selection:text-white overflow-x-hidden">
      <SoundWaveBackground />

      {/* ── Green ambient glow orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[rgba(80,180,120,0.03)] rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[rgba(60,140,100,0.025)] rounded-full blur-[130px]" />
        <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-[rgba(100,200,140,0.02)] rounded-full blur-[120px]" />
      </div>

      {/* ═══════════ STICKY NAV ═══════════ */}
      <motion.nav
        style={{ opacity: headerOpacity }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-[#080C0A]/60 border-b border-white/[0.04]"
      >
        <div className="max-w-[1200px] mx-auto px-8 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wider text-[#6EAA80] drop-shadow-[0_0_8px_rgba(80,180,120,0.3)]">HLB</span>
          <div className="flex items-center gap-8 text-[13px] text-[#5A6A60]">
            <a href="#" className="hover:text-[#E2E6E3] transition-colors">커리큘럼</a>
            <a href="#" className="hover:text-[#E2E6E3] transition-colors">요금제</a>
            <a href="#" className="hover:text-[#E2E6E3] transition-colors">코치</a>
            <button className="h-8 px-4 rounded-lg bg-[#5B8C6E] text-[#080C0A] text-[12px] font-semibold hover:bg-[#6B9E7E] transition-all shadow-[0_0_20px_rgba(80,180,120,0.2)]">
              시작하기
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10">

        {/* ═══════════ HERO ═══════════ */}
        <motion.section
          style={{ y: heroY }}
          className="min-h-screen flex flex-col items-center justify-center text-center px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-[11px] font-medium tracking-[0.3em] text-[#6EAA80] uppercase mb-8 drop-shadow-[0_0_12px_rgba(80,180,120,0.4)]">
              AI Vocal Studio
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(3rem,7vw,5.5rem)] font-light tracking-[-0.04em] leading-[1.05] max-w-[800px]"
            style={{ fontFamily: "'Crimson Pro', 'Noto Serif KR', serif" }}
          >
            당신의 목소리를
            <br />
            <span className="font-normal text-[#6EAA80]"
              style={{ textShadow: '0 0 40px rgba(80,180,120,0.25), 0 0 80px rgba(80,180,120,0.1)' }}>
              깨워드립니다
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-[15px] text-[#7A8A80] max-w-[380px] leading-[1.8]"
          >
            7년 경력 보컬 트레이너의 커리큘럼과
            <br />
            AI 실시간 분석이 만났습니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-4 mt-10"
          >
            <button className="group relative h-12 px-7 rounded-xl bg-[#5B8C6E] text-[#080C0A] text-[13px] font-semibold flex items-center gap-2 hover:bg-[#6B9E7E] transition-all hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(80,180,120,0.25),0_0_60px_rgba(80,180,120,0.1)]"
              style={{ transform: 'perspective(500px) translateZ(0)' }}>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-white/10 pointer-events-none" />
              무료로 시작하기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="h-12 px-6 rounded-xl border border-white/[0.08] text-[13px] text-[#7A8A80] flex items-center gap-2 hover:border-[#5B8C6E]/30 hover:text-[#E2E6E3] hover:shadow-[0_0_30px_rgba(80,180,120,0.06)] transition-all backdrop-blur-sm">
              <Play className="w-3.5 h-3.5" /> 데모 듣기
            </button>
          </motion.div>

          {/* Scroll indicator — glowing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#5B8C6E]/60 to-transparent"
              style={{ boxShadow: '0 0 8px rgba(80,180,120,0.3)' }}
            />
          </motion.div>
        </motion.section>

        {/* ═══════════ SOCIAL PROOF ═══════════ */}
        <section className="py-20 border-t border-white/[0.04]">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="grid grid-cols-4 gap-8">
              {[
                { num: 2847, suffix: '+', label: '수강생' },
                { num: 28, suffix: '단계', label: '커리큘럼' },
                { num: 95, suffix: '%', label: '긴장 감지 정확도' },
                { num: 4.9, suffix: '', label: '평균 만족도' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <p className="text-[clamp(2rem,3vw,2.5rem)] font-light tracking-tight text-[#E2E6E3]">
                    <Counter end={stat.num} suffix={stat.suffix} />
                  </p>
                  <p className="text-[12px] text-[#3A4A40] mt-1 tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section className="py-24">
          <div className="max-w-[1200px] mx-auto px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <p className="text-[11px] font-medium tracking-[0.3em] text-[#6EAA80] uppercase mb-4 drop-shadow-[0_0_8px_rgba(80,180,120,0.3)]">How it works</p>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-light tracking-[-0.02em] leading-[1.2]"
                style={{ fontFamily: "'Crimson Pro', 'Noto Serif KR', serif" }}>
                소리가 자라는 과정
              </h2>
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: '녹음 & 분석',
                  desc: '마이크에 대고 노래하면 AI가 Jitter, Shimmer, HNR, 포먼트를 실시간 측정합니다.',
                  icon: Mic,
                },
                {
                  step: '02',
                  title: '긴장 감지',
                  desc: '후두, 혀뿌리, 턱, 성구전환 — 4축 긴장 지표로 발성 습관을 정밀 진단합니다.',
                  icon: BarChart3,
                },
                {
                  step: '03',
                  title: '감각 코칭',
                  desc: '숫자가 아닌 느낌으로. "목 안쪽이 열리는 감각을 떠올려보세요" 같은 안내를 드립니다.',
                  icon: Headphones,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                >
                  <GlowCard className="group p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_50px_rgba(80,180,120,0.05),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.1] transition-all duration-500 cursor-pointer">
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-[40px] font-extralight text-[#5B8C6E]/15"
                        style={{ fontFamily: "'Crimson Pro', serif" }}>
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#5B8C6E]/[0.08] flex items-center justify-center text-[#6EAA80] group-hover:bg-[#5B8C6E]/[0.15] group-hover:shadow-[0_0_20px_rgba(80,180,120,0.15)] transition-all">
                        <item.icon className="w-[18px] h-[18px]" />
                      </div>
                    </div>
                    <h3 className="text-[17px] font-medium mb-3 text-[#E2E6E3]">{item.title}</h3>
                    <p className="text-[13px] text-[#5A6A60] leading-[1.8]">{item.desc}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ DASHBOARD PREVIEW ═══════════ */}
        <section className="py-24 border-t border-white/[0.04]">
          <div className="max-w-[1200px] mx-auto px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <p className="text-[11px] font-medium tracking-[0.3em] text-[#6EAA80] uppercase mb-4 drop-shadow-[0_0_8px_rgba(80,180,120,0.3)]">Dashboard</p>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-light tracking-[-0.02em] leading-[1.2]"
                style={{ fontFamily: "'Crimson Pro', 'Noto Serif KR', serif" }}>
                오늘의 연습
              </h2>
            </motion.div>

            <div className="grid grid-cols-12 gap-4"
              style={{ perspective: '1200px' }}>
              {/* Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col-span-4"
              >
                <GlowCard className="p-6 h-full" glow>
                  <p className="text-[11px] text-[#4A5A50] mb-3">연습 스트릭</p>
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-[36px] font-light tracking-tight">7</span>
                    <span className="text-[13px] text-[#4A5A50]">일 연속</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5,6,7].map(d => (
                      <div key={d} className="flex-1 h-8 rounded-md bg-[#5B8C6E]/10 border border-[#5B8C6E]/20 flex items-center justify-center shadow-[0_0_12px_rgba(80,180,120,0.06)]">
                        <Check className="w-3 h-3 text-[#6EAA80]" />
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>

              {/* Score Ring */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="col-span-4"
              >
                <GlowCard className="p-6 h-full" glow>
                  <p className="text-[11px] text-[#4A5A50] mb-3">종합 점수</p>
                  <div className="flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                      <svg className="w-[80px] h-[80px] -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(91,140,110,0.1)" strokeWidth="6" />
                        <motion.circle
                          cx="60" cy="60" r="52" fill="none" strokeWidth="6" strokeLinecap="round"
                          stroke="url(#scoreGlow)"
                          initial={{ strokeDasharray: `0 ${2 * Math.PI * 52}` }}
                          whileInView={{ strokeDasharray: `${2 * Math.PI * 52 * 0.82} ${2 * Math.PI * 52}` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          style={{ filter: 'drop-shadow(0 0 6px rgba(80,180,120,0.4))' }}
                        />
                        <defs>
                          <linearGradient id="scoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5B8C6E" />
                            <stop offset="100%" stopColor="#8CC6A0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[22px] font-light">82</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium flex items-center gap-1 text-[#6EAA80]">
                        <TrendingUp className="w-3.5 h-3.5" /> +5
                      </p>
                      <p className="text-[11px] text-[#4A5A50] mt-0.5">지난주 대비</p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>

              {/* Tension */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="col-span-4"
              >
                <GlowCard className="p-6 h-full">
                  <p className="text-[11px] text-[#4A5A50] mb-4">긴장 분석</p>
                  <div className="space-y-3">
                    {[
                      { label: '후두', value: 88 },
                      { label: '혀뿌리', value: 72 },
                      { label: '턱', value: 45 },
                      { label: '성구', value: 35 },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-[#7A8A80]">{m.label}</span>
                          <span className="text-[#4A5A50] font-mono tabular-nums">{m.value}</span>
                        </div>
                        <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, #5B8C6E, #8CC6A0)`,
                              opacity: 0.3 + (m.value / 100) * 0.7,
                              boxShadow: m.value > 60 ? '0 0 8px rgba(80,180,120,0.3)' : 'none',
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${m.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════ JOURNEY ═══════════ */}
        <section className="py-24">
          <div className="max-w-[1200px] mx-auto px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <p className="text-[11px] font-medium tracking-[0.3em] text-[#6EAA80] uppercase mb-4 drop-shadow-[0_0_8px_rgba(80,180,120,0.3)]">Journey</p>
                <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-light tracking-[-0.02em]"
                  style={{ fontFamily: "'Crimson Pro', 'Noto Serif KR', serif" }}>
                  소리의 길
                </h2>
              </div>
              <button className="text-[12px] text-[#4A5A50] hover:text-[#7A8A80] transition-colors flex items-center gap-1">
                전체 보기 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            <div className="grid grid-cols-4 gap-4" style={{ perspective: '1200px' }}>
              {[
                { stage: 1, title: '호흡의 기초', sub: '횡격막 호흡으로 소리의 토대를 쌓습니다', progress: 100, status: 'done' as const },
                { stage: 2, title: '편안한 발성', sub: '후두 긴장 없이 소리를 내는 감각', progress: 72, status: 'current' as const },
                { stage: 3, title: '공명 찾기', sub: '머리와 가슴의 울림을 연결합니다', progress: 0, status: 'locked' as const },
                { stage: 4, title: '성구 전환', sub: '자연스러운 믹스보이스의 시작', progress: 0, status: 'locked' as const },
              ].map((item, i) => (
                <motion.div
                  key={item.stage}
                  initial={{ opacity: 0, y: 20, rotateX: 4 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <GlowCard
                    glow={item.status === 'current'}
                    className={`p-5 cursor-pointer transition-all duration-500 hover:-translate-y-1 h-full ${
                      item.status === 'current'
                        ? 'border-[#5B8C6E]/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_60px_rgba(80,180,120,0.08)]'
                        : item.status === 'done'
                        ? 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
                        : 'opacity-45'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all ${
                        item.status === 'current'
                          ? 'bg-[#5B8C6E]/15 text-[#6EAA80] shadow-[0_0_16px_rgba(80,180,120,0.15)]'
                          : item.status === 'done'
                          ? 'bg-white/[0.04] text-[#7A8A80]'
                          : 'bg-white/[0.03] text-[#3A4A40]'
                      }`}>
                        {item.status === 'done'
                          ? <Check className="w-4 h-4" />
                          : item.status === 'locked'
                          ? <Lock className="w-4 h-4" />
                          : <span className="font-mono text-[12px]">{item.stage}</span>
                        }
                      </div>
                      <span className="text-[10px] text-[#3A4A40] tracking-wider uppercase">
                        {item.status === 'done' ? '완료' : item.status === 'current' ? '진행 중' : '잠금'}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-medium mb-1">{item.title}</h3>
                    <p className="text-[11px] text-[#4A5A50] leading-[1.6] mb-4">{item.sub}</p>
                    <div className="h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.progress}%`,
                          background: item.status === 'current' ? 'linear-gradient(90deg, #5B8C6E, #8CC6A0)' : 'rgba(122,138,128,0.4)',
                          boxShadow: item.status === 'current' ? '0 0 8px rgba(80,180,120,0.3)' : 'none',
                        }}
                      />
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="py-32 border-t border-white/[0.04] relative">
          {/* CTA glow backdrop */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[400px] h-[400px] bg-[rgba(80,180,120,0.04)] rounded-full blur-[120px]" />
          </div>
          <div className="max-w-[600px] mx-auto px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-light tracking-[-0.03em] leading-[1.15] mb-5"
                style={{ fontFamily: "'Crimson Pro', 'Noto Serif KR', serif" }}>
                지금, 당신의 소리를
                <br />
                <span className="text-[#6EAA80]"
                  style={{ textShadow: '0 0 30px rgba(80,180,120,0.2)' }}>
                  들어보세요
                </span>
              </h2>
              <p className="text-[14px] text-[#5A6A60] leading-[1.8] mb-8">
                무료 플랜으로 18단계까지 체험할 수 있습니다.
                <br />
                신용카드가 필요하지 않습니다.
              </p>
              <button className="group relative h-13 px-8 rounded-xl bg-[#5B8C6E] text-[#080C0A] text-[14px] font-semibold inline-flex items-center gap-2 hover:bg-[#6B9E7E] transition-all hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(80,180,120,0.25),0_0_80px_rgba(80,180,120,0.1)]">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-white/15 pointer-events-none" />
                무료로 시작하기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="py-12 border-t border-white/[0.04]">
          <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
            <span className="text-[12px] text-[#2A3A30]">© 2026 HLB 보컬스튜디오</span>
            <div className="flex gap-6 text-[12px] text-[#2A3A30]">
              <a href="#" className="hover:text-[#4A5A50] transition-colors">이용약관</a>
              <a href="#" className="hover:text-[#4A5A50] transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-[#4A5A50] transition-colors">문의</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
