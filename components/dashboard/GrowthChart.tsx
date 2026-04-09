'use client';

import { useJourneyStore } from '@/stores/journeyStore';
import { hlbCurriculum } from '@/lib/data/hlbCurriculum';
import Card from '@/components/ds/Card';
import styles from './GrowthChart.module.css';

export default function GrowthChart() {
  const progress = useJourneyStore((s) => s.progress);

  // 통과한 스테이지만 스테이지 ID 순서로 정렬
  const passedEntries = hlbCurriculum
    .filter((stage) => progress[stage.id]?.status === 'passed')
    .map((stage) => ({
      id: stage.id,
      name: stage.name,
      blockIcon: stage.blockIcon,
      score: progress[stage.id].bestScore,
    }));

  if (passedEntries.length === 0) {
    return (
      <Card className={styles.card}>
        <h2 className={styles.heading}>성장 그래프</h2>
        <div className={styles.empty}>
          <p className={styles.emptyText}>아직 데이터가 없어요</p>
          <p className={styles.emptyHint}>레슨을 통과하면 점수 변화를 확인할 수 있어요</p>
        </div>
      </Card>
    );
  }

  const maxScore = 100;

  return (
    <Card className={styles.card}>
      <h2 className={styles.heading}>성장 그래프</h2>
      <div className={styles.chart}>
        <div className={styles.yAxis}>
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        <div className={styles.bars}>
          {passedEntries.map((entry) => {
            const heightPct = (entry.score / maxScore) * 100;
            const colorClass = entry.score >= 80
              ? styles.barHigh
              : entry.score >= 60
                ? styles.barMid
                : styles.barLow;

            return (
              <div key={entry.id} className={styles.barGroup}>
                <div className={styles.barWrapper}>
                  <div
                    className={`${styles.bar} ${colorClass}`}
                    style={{ height: `${heightPct}%` }}
                  >
                    <span className={styles.barScore}>{entry.score}</span>
                  </div>
                </div>
                <span className={styles.barLabel} title={entry.name}>
                  {entry.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.barHigh}`} /> 80+
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.barMid}`} /> 60-79
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.barLow}`} /> 60 미만
        </span>
      </div>
    </Card>
  );
}
