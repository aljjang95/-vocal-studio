'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ds/Button';
import Card from '@/components/ds/Card';
import styles from './Pricing.module.css';

export default function Pricing() {
  const router = useRouter();

  const goCheckout = (plan: string) => router.push(`/checkout/${plan}`);
  const goSignup = () => router.push('/auth/signup');

  return (
    <section id="pricing" className={styles.pricing}>
      <div className="container">
        <div className={styles.head}>
          <div className="section-kicker" style={{ justifyContent: 'center' }}>요금제</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            오프라인 레슨 그대로,<br />온라인으로
          </h2>
          <p className={styles.subtitle}>
            사설 레슨 1회 평균 5만원. 발성전문반은 한 달 내내 AI 코칭.
          </p>
        </div>

        <div className={styles.grid}>
          {/* 무료 */}
          <Card className={styles.planCard}>
            <div className={styles.planName}>무료</div>
            <p className={styles.planTagline}>가볍게 시작하기</p>
            <div className={styles.priceRow}>
              <span className={styles.priceNum}>무료</span>
            </div>
            <div className={styles.pricePeriod}>광고 포함</div>
            <div className={styles.divider} />
            <ul className={styles.featureList}>
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
            <Button variant="secondary" fullWidth onClick={goSignup}>
              무료로 시작
            </Button>
          </Card>

          {/* 정액제 */}
          <Card className={styles.planCard}>
            <div className={styles.planName}>정액제</div>
            <p className={styles.planTagline}>광고 없이 마음껏</p>
            <div className={styles.priceRow}>
              <span className={styles.priceCurrency}>₩</span>
              <span className={styles.priceNum}>19,900</span>
            </div>
            <div className={styles.pricePeriod}>/ 월</div>
            <div className={styles.divider} />
            <ul className={styles.featureList}>
              <Feature on>무료 콘텐츠 전부 포함</Feature>
              <Feature on>광고 완전 제거</Feature>
              <Feature on>발성 분석 리포트 무제한</Feature>
              <Feature on>곡 연습 + 구간 분석</Feature>
              <Feature on>AI 코치 채팅 무제한</Feature>
              <Feature off>채점 기반 해금 (19~28단계)</Feature>
              <Feature off>4축 긴장 상세 분석</Feature>
              <Feature off>맞춤 커리큘럼 설계</Feature>
            </ul>
            <Button variant="secondary" fullWidth onClick={() => goCheckout('subscription')}>
              정액제 시작
            </Button>
          </Card>

          {/* 발성전문반 */}
          <Card variant="active" className={styles.planCard}>
            <span className={styles.badge}>추천</span>
            <div className={styles.planName}>발성전문반</div>
            <p className={styles.planTagline}>발성 매커니즘 기반, 체계적 성장</p>
            <div className={styles.priceRow}>
              <span className={styles.priceCurrency}>₩</span>
              <span className={styles.priceNum}>150,000</span>
            </div>
            <div className={styles.pricePeriod}>/ 월</div>
            <div className={styles.divider} />
            <ul className={styles.featureList}>
              <Feature on>정액제 전부 포함</Feature>
              <Feature on>28단계 채점 기반 해금</Feature>
              <Feature on>세팅 → 고음 → 가창 코스</Feature>
              <Feature on>4축 긴장 분석 (후두/혀뿌리/턱/성구)</Feature>
              <Feature on>단계별 매커니즘 AI 해설</Feature>
              <Feature on>1:1 맞춤 커리큘럼 + 루틴</Feature>
              <Feature on>일간 + 주간 성장 리포트</Feature>
              <Feature on>발성 분석 리포트 + AI 커버</Feature>
            </ul>
            <Button variant="accent" fullWidth onClick={() => goCheckout('pro')}>
              발성전문반 시작
            </Button>
          </Card>

          {/* 유료 피드백 */}
          <Card className={styles.planCard}>
            <div className={styles.planName}>유료 피드백</div>
            <p className={styles.planTagline}>선생님이 직접 듣고 진단</p>
            <div className={styles.priceRow}>
              <span className={styles.priceCurrency}>₩</span>
              <span className={styles.priceNum}>50,000</span>
            </div>
            <div className={styles.pricePeriod}>/ 1회</div>
            <div className={styles.divider} />
            <ul className={styles.featureList}>
              <Feature on>녹음 제출 → 선생님 직접 청취</Feature>
              <Feature on>AI 진단 + 선생님 소견 비교</Feature>
              <Feature on>구체적 개선 방향 제시</Feature>
              <Feature on>7년 경력 전문 트레이너</Feature>
              <Feature on>모든 플랜에서 추가 구매 가능</Feature>
            </ul>
            <Button variant="secondary" fullWidth onClick={() => goCheckout('feedback')}>
              피드백 신청
            </Button>
          </Card>
        </div>

        <p className={styles.fine}>
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
    <li className={`${styles.featureItem} ${!included ? styles.featureOff : ''}`}>
      {included ? (
        <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className={styles.xIcon} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )}
      <span className={note ? styles.noteText : ''}>{children}</span>
    </li>
  );
}
