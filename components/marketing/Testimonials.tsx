import styles from './Testimonials.module.css';

const STORIES = [
  {
    name: '김지은',
    role: '팝 보컬 연습생 · 6개월 수강',
    before: { label: '시작 전', text: '고음 D4에서 목이 잠기고 소리가 끊겼어요' },
    after:  { label: '3개월 후', text: 'G4까지 안정적으로 연장. AI가 후두 긴장 원인을 찾아줬어요' },
    quote: '레슨 받을 때처럼 "왜 그런지" 설명이 있어요. 유튜브랑 다른 건 그 부분이에요.',
  },
  {
    name: '박민준',
    role: '뮤지컬 지망생 · 오디션 합격',
    before: { label: '시작 전', text: '호흡이 얕아서 한 프레이즈를 끝까지 못 냈어요' },
    after:  { label: '6주 후', text: '복식호흡 세팅 완료. 오디션에서 프레이즈 2개 연결 성공' },
    quote: '4축 분석에서 혀뿌리 긴장이 높다고 나왔는데, 그게 정확히 제 문제였어요.',
  },
  {
    name: '이수아',
    role: 'R&B 싱어송라이터 · 취미 수강',
    before: { label: '시작 전', text: '성구전환 구간에서 소리가 갈라지는 게 고민이었어요' },
    after:  { label: '2개월 후', text: '빠사지오 구간 매끄럽게 통과. 성구전환 점수 78점 달성' },
    quote: '사설 레슨 가격이 부담돼서 못 갔는데, 여기서 오히려 더 구체적인 원인을 찾았어요.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className="container">
        <div className="section-head center reveal">
          <div className="section-kicker" style={{ justifyContent: 'center' }}>수강생 변화</div>
          <h2 className="section-title">
            원인을 알면, <em>달라집니다</em>
          </h2>
          <p className="section-desc" style={{ textAlign: 'center' }}>
            막연히 "더 연습하세요"가 아닌, 정확한 원인 진단 후 개선된 사례들입니다.
          </p>
        </div>

        <div className={styles.grid}>
          {STORIES.map((s) => (
            <div key={s.name} className={`${styles.card} reveal`}>
              {/* Before/After */}
              <div className={styles.transform}>
                <div className={styles.transformCol}>
                  <span className={styles.transformBadgeBefore}>{s.before.label}</span>
                  <p className={styles.transformText}>{s.before.text}</p>
                </div>
                <div className={styles.arrow} aria-hidden="true">→</div>
                <div className={styles.transformCol}>
                  <span className={styles.transformBadgeAfter}>{s.after.label}</span>
                  <p className={`${styles.transformText} ${styles.transformTextAfter}`}>{s.after.text}</p>
                </div>
              </div>

              {/* 구분선 */}
              <div className={styles.divider} />

              {/* 후기 */}
              <p className={styles.quote}>&ldquo;{s.quote}&rdquo;</p>

              <div className={styles.author}>
                <div className={styles.authorInitial}>{s.name[0]}</div>
                <div>
                  <div className={styles.authorName}>{s.name}</div>
                  <div className={styles.authorRole}>{s.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
