'use client';

import { useRouter } from 'next/navigation';
import { useJourneyStore } from '@/stores/journeyStore';
import Card from '@/components/ds/Card';
import Button from '@/components/ds/Button';
import s from './PaywallBanner.module.css';

interface PaywallBannerProps {
  currentStage: number;
}

export default function PaywallBanner({ currentStage }: PaywallBannerProps) {
  const router = useRouter();
  const { userTier } = useJourneyStore();

  if (currentStage <= 18 || userTier !== 'free') return null;

  return (
    <div className={s.banner}>
      <Card variant="active">
        <div className={s.inner}>
          <div className={s.lockIcon}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <h3 className={s.title}>19단계부터는 발성전문반에서 진행돼요</h3>
            <p className={s.warning}>세팅 없이 고음 가면 목 상합니다</p>
          </div>

          <ul className={s.benefits}>
            <li className={s.benefitItem}>
              <span className={s.benefitIcon}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              세팅 → 고음 → 가창까지 28단계 체계 코스
            </li>
            <li className={s.benefitItem}>
              <span className={s.benefitIcon}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              4축 긴장 분석 (후두/혀뿌리/턱/성구전환)
            </li>
            <li className={s.benefitItem}>
              <span className={s.benefitIcon}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              일간 + 주간 성장 리포트 + 맞춤 커리큘럼
            </li>
          </ul>

          <div className={s.priceRow}>
            <span className={s.price}>150,000원</span>
            <span className={s.pricePeriod}>/ 월</span>
          </div>

          <Button variant="accent" fullWidth onClick={() => router.push('/pricing')}>
            발성전문반 시작하기
          </Button>
        </div>
      </Card>
    </div>
  );
}
