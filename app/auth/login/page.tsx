'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/journey';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : authError.message);
      setLoading(false);
      return;
    }

    router.push(nextPath.startsWith('/') ? nextPath : '/journey');
    router.refresh();
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1rem',
    borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)', color: 'white',
    fontSize: '0.9375rem', boxSizing: 'border-box', outline: 'none',
  };

  return (
    <div className={s.page}>
      {/* 브랜딩 */}
      <div className={s.brand}>
        <div className={s.brandOrb1} />
        <div className={s.brandOrb2} />
        <div className={s.brandContent}>
          <div className={s.brandKicker}>HLB 보컬스튜디오</div>
          <h1 className={s.brandTitle}>
            목이 조이는 이유,<br />
            <em>이제 알 수 있습니다</em>
          </h1>
          <p className={s.brandDesc}>
            후두·혀뿌리·턱의 긴장을 AI가 실시간으로 분석하고,
            당신만의 발성 로드맵을 제시합니다.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: '28단계', desc: '체계적 커리큘럼' },
              { label: '4축 분석', desc: '후두·혀뿌리·턱·성구' },
              { label: '18단계 무료', desc: '신용카드 불필요' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: '700', color: '#818cf8',
                }}>
                  {item.label.replace(/[가-힣·]/g, '').trim() || item.label.slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 폼 */}
      <div className={s.formPanel}>
        <div className={s.formInner}>
          <h2 className={s.formTitle}>로그인</h2>
          <p className={s.formSub}>계속하려면 로그인하세요</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inp}
                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                placeholder="vocal@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inp}
                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                placeholder="6자 이상"
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '0.5rem',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: 'none',
                background: loading ? '#374151' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', fontSize: '0.9375rem', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem',
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '500' }}>
              무료로 시작하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
