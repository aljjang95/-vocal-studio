'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from '../auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message === 'User already registered'
        ? '이미 가입된 이메일입니다.'
        : authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1rem',
    borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)', color: 'white',
    fontSize: '0.9375rem', boxSizing: 'border-box', outline: 'none',
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#030712', padding: '1.5rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7"/>
              <path d="M2 13l10 8 10-8"/>
            </svg>
          </div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            이메일을 확인해주세요
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            <span style={{ color: '#818cf8', fontWeight: '500' }}>{email}</span>로<br />
            인증 링크를 보냈습니다.
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block', marginTop: '2rem', padding: '0.75rem 2rem',
            borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem',
          }}>
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      {/* 브랜딩 */}
      <div className={s.brand}>
        <div className={s.brandOrb1} />
        <div className={s.brandOrb2} />
        <div className={s.brandContent}>
          <div className={s.brandKicker}>HLB 보컬스튜디오</div>
          <h1 className={s.brandTitle}>
            목소리의 변화를,<br />
            <em>직접 느껴보세요</em>
          </h1>
          <p className={s.brandDesc}>
            18단계까지 무료. 신용카드 불필요.<br />
            AI 코치와 함께 지금 바로 시작하세요.
          </p>

          <div style={{
            marginTop: '3rem', padding: '1.5rem', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              무료 플랜 포함
            </div>
            {[
              '18단계 레슨 채점 진행',
              'AI 발성 4축 분석',
              '스케일 피아노 자율 연습',
              '기본 긴장 감지',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="7.5" stroke="rgba(99,102,241,0.4)" />
                  <path d="M5 8l2 2 4-4" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 폼 */}
      <div className={s.formPanel}>
        <div className={s.formInner}>
          <h2 className={s.formTitle}>무료로 시작하기</h2>
          <p className={s.formSub}>계정을 만들면 바로 레슨을 시작합니다</p>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                이름
              </label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                style={inp}
                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                placeholder="홍길동"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                이메일
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
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
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
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
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: 'none',
                background: loading ? '#374151' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', fontSize: '0.9375rem', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem',
              }}
            >
              {loading ? '가입 중...' : '무료로 시작하기'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '500' }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
