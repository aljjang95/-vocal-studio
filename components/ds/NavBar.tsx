'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import s from './NavBar.module.css';

const NAV_ITEMS = [
  { href: '/journey', label: '소리의 길' },
  { href: '/scale-practice', label: '스케일' },
  { href: '/practice', label: '연습실' },
  { href: '/coach', label: 'AI 코치' },
];

interface Props {
  children?: React.ReactNode;
}

export default function NavBar({ children }: Props) {
  const pathname = usePathname();

  return (
    <nav className={s.nav}>
      <Link href="/" className={s.logo}>
        <span className={s.logoMark}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2"/>
          </svg>
        </span>
        HLB 보컬스튜디오
      </Link>
      <div className={s.links}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${s.link} ${pathname.startsWith(item.href) ? s.active : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className={s.right}>
        {children}
      </div>
    </nav>
  );
}
