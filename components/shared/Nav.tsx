'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import styles from './Nav.module.css';
import type { User } from '@supabase/supabase-js';

export default function Nav() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => { window.removeEventListener('scroll', onScroll); subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="mainNav">
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoMark}>
              <svg className={styles.logoIcon} width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="url(#lgr)" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="19" x2="12" y2="22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="lgr" x1="9" y1="2" x2="15" y2="12">
                    <stop stopColor="#fff" />
                    <stop offset="1" stopColor="rgba(255,255,255,0.6)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className={styles.logoLabel}><strong>HLB</strong> 보컬스튜디오</span>
          </Link>

          <ul className={styles.navLinks}>
            <li><Link href="/journey">소리의 길</Link></li>
            <li><Link href="/scale-practice">스케일 연습</Link></li>
            <li><Link href="/coach">AI 코치</Link></li>
            <li><Link href="/ai-cover">AI 커버</Link></li>
            <li><Link href="/vocal-report">발성 분석</Link></li>
            <li><Link href="/pricing">요금제</Link></li>
            {user && <li><Link href="/dashboard">대시보드</Link></li>}
            {user ? (
              <li><button onClick={handleLogout} className={styles.navCta} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}>로그아웃</button></li>
            ) : (
              <li><Link href="/onboarding" className={styles.navCta}>무료 시작</Link></li>
            )}
          </ul>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`} role="dialog" aria-modal="true">
        <button className={styles.mClose} onClick={closeMenu} aria-label="메뉴 닫기">✕</button>
        <Link href="/journey" onClick={closeMenu}>소리의 길</Link>
        <Link href="/scale-practice" onClick={closeMenu}>스케일 연습</Link>
        <Link href="/coach" onClick={closeMenu}>AI 코치</Link>
        <Link href="/ai-cover" onClick={closeMenu}>AI 커버</Link>
        <Link href="/vocal-report" onClick={closeMenu}>발성 분석</Link>
        <Link href="/pricing" onClick={closeMenu}>요금제</Link>
        {user && <Link href="/dashboard" onClick={closeMenu}>대시보드</Link>}
        {user ? (
          <button onClick={() => { closeMenu(); handleLogout(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0, textAlign: 'left' }}>로그아웃</button>
        ) : (
          <Link href="/onboarding" onClick={closeMenu}>무료 시작</Link>
        )}
      </div>
    </>
  );
}
