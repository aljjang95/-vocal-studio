import styles from './Proof.module.css';

const STATS = [
  { num: '28단계', label: '체계적 커리큘럼', sub: '이완 기초 → 실가창까지' },
  { num: '4축', label: '긴장 분석', sub: '후두·혀뿌리·턱·성구전환' },
  { num: '18단계', label: '무료 체험', sub: '카드 없이 지금 시작' },
  { num: '24시간', label: 'AI 코치 상담', sub: '예약 없이 즉시 답변' },
  { num: 'Praat', label: '음성학 분석', sub: '국제 표준 분석 엔진' },
];

export default function Proof() {
  return (
    <section id="proof" className={styles.proof}>
      <div className="container">
        <div className={styles.proofInner}>
          {STATS.map((s) => (
            <div key={s.num} className={styles.statItem}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statSub}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
