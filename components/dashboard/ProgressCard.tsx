'use client';

import Link from 'next/link';
import { useJourneyStore } from '@/stores/journeyStore';
import { hlbCurriculum } from '@/lib/data/hlbCurriculum';
import Card from '@/components/ds/Card';
import Button from '@/components/ds/Button';
import styles from './ProgressCard.module.css';

export default function ProgressCard() {
  const progress = useJourneyStore((s) => s.progress);
  const getNextAvailableStage = useJourneyStore((s) => s.getNextAvailableStage);

  const totalStages = hlbCurriculum.length;
  const passedStages = Object.values(progress).filter((p) => p.status === 'passed');
  const passedCount = passedStages.length;
  const percentage = totalStages > 0 ? Math.round((passedCount / totalStages) * 100) : 0;

  const nextStageId = getNextAvailableStage();
  const nextStage = nextStageId ? hlbCurriculum.find((s) => s.id === nextStageId) : null;

  // 가장 최근 통과한 스테이지
  const lastPassed = passedStages.length > 0
    ? passedStages.sort((a, b) => {
        const aTime = a.passedAt ? new Date(a.passedAt).getTime() : 0;
        const bTime = b.passedAt ? new Date(b.passedAt).getTime() : 0;
        return bTime - aTime;
      })[0]
    : null;
  const lastPassedStage = lastPassed
    ? hlbCurriculum.find((s) => s.id === lastPassed.stageId)
    : null;

  return (
    <Card className={styles.card}>
      <h2 className={styles.heading}>레슨 진도</h2>

      <div className={styles.stats}>
        <div className={styles.statMain}>
          <span className={styles.statNumber}>{passedCount}</span>
          <span className={styles.statLabel}>/ {totalStages} 완료</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={styles.percentage}>{percentage}%</span>
      </div>

      {lastPassedStage && (
        <div className={styles.lastPassed}>
          <span className={styles.lastLabel}>최근 통과</span>
          <span className={styles.lastValue}>
            {lastPassedStage.blockIcon} {lastPassedStage.name}
            {lastPassed ? ` (${lastPassed.bestScore}점)` : ''}
          </span>
        </div>
      )}

      {nextStage && (
        <div className={styles.nextStage}>
          <span className={styles.nextLabel}>다음 레슨</span>
          <span className={styles.nextValue}>
            {nextStage.blockIcon} {nextStage.name}
          </span>
        </div>
      )}

      {nextStageId ? (
        <Link href={`/journey/${nextStageId}`} className={styles.ctaLink}>
          <Button variant="accent" fullWidth>
            이어서 연습하기
          </Button>
        </Link>
      ) : passedCount === totalStages ? (
        <Link href="/journey" className={styles.ctaLink}>
          <Button variant="secondary" fullWidth>
            전체 복습하기
          </Button>
        </Link>
      ) : (
        <Link href="/journey" className={styles.ctaLink}>
          <Button variant="secondary" fullWidth>
            소리의 길 보기
          </Button>
        </Link>
      )}
    </Card>
  );
}
