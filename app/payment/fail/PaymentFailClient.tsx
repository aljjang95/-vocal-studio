'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/ds/Button';
import styles from './fail.module.css';

const FAIL_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: '결제가 취소되었습니다.',
  PAY_PROCESS_ABORTED: '결제가 중단되었습니다.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 거부했습니다.',
};

export default function PaymentFailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code') ?? '';
  const message = searchParams.get('message') ?? '결제에 실패했습니다.';
  const orderId = searchParams.get('orderId') ?? '';

  const displayMessage = FAIL_MESSAGES[code] || message;

  return (
    <div className={styles.center}>
      <div className={styles.icon}>✗</div>
      <h2 className={styles.title}>결제 실패</h2>
      <p className={styles.desc}>{displayMessage}</p>
      {code && <p className={styles.code}>오류 코드: {code}</p>}
      {orderId && <p className={styles.code}>주문 번호: {orderId}</p>}
      <div className={styles.actions}>
        <Button variant="accent" onClick={() => router.back()}>
          다시 시도하기
        </Button>
        <Button variant="secondary" onClick={() => router.push('/pricing')}>
          요금제로 돌아가기
        </Button>
      </div>
    </div>
  );
}
