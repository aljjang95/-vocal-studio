'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChatBox from '@/components/coach/ChatBox';
import { IconMic, IconChat, IconTarget } from '@/components/shared/Icons';
import styles from './Demo.module.css';

/* ── 4축 긴장 분석 시뮬레이션 ── */
const TENSION_AXES = [
  { label: '후두 긴장',   score: 72, level: 'high',   feedback: '후두가 많이 올라와 있어요. 혀를 먼저 내려보내면 자연스럽게 안정됩니다.' },
  { label: '혀뿌리 긴장', score: 31, level: 'low',    feedback: '혀뿌리는 비교적 편안한 상태예요.' },
  { label: '턱 긴장',     score: 48, level: 'medium', feedback: '턱에 약간의 힘이 들어가 있어요. 입을 자연스럽게 열어보세요.' },
  { label: '성구전환',    score: 58, level: 'medium', feedback: '전환점에서 소리가 약간 흔들립니다.' },
];

const LEVEL_COLOR: Record<string, string> = {
  high: 'var(--error)',
  medium: 'var(--warning)',
  low: 'var(--success)',
};

const LEVEL_BG: Record<string, string> = {
  high: 'var(--error-muted)',
  medium: 'var(--warning-muted)',
  low: 'var(--success-muted)',
};

const LEVEL_LABEL: Record<string, string> = {
  high: '주의',
  medium: '보통',
  low: '양호',
};

function TensionDemo() {
  const worst = TENSION_AXES.reduce((a, b) => a.score > b.score ? a : b);

  return (
    <div className={styles.tensionPanel}>
      <div className={styles.tensionHeader}>
        <div className={styles.tensionRec}>
          <span className={styles.tensionRecDot} />
          분석 완료 — 후두 긴장 감지됨
        </div>
      </div>

      <div className={styles.axesList}>
        {TENSION_AXES.map((ax) => (
          <div key={ax.label} className={styles.axisRow}>
            <div className={styles.axisLabelRow}>
              <span className={styles.axisLabel}>{ax.label}</span>
              <span className={styles.axisScore} style={{ color: LEVEL_COLOR[ax.level] }}>
                {LEVEL_LABEL[ax.level]}
              </span>
            </div>
            <div className={styles.axisBarBg}>
              <div
                className={styles.axisBarFill}
                style={{
                  width: `${ax.score}%`,
                  background: LEVEL_COLOR[ax.level],
                  boxShadow: `0 0 8px ${LEVEL_BG[ax.level]}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tensionFeedback}>
        <span className={styles.tensionFeedbackLabel}>AI 코치</span>
        <p className={styles.tensionFeedbackText}>
          &ldquo;{worst.feedback} 지금 목 안쪽이 좁게 느껴지나요? 혀를 먼저 내려보내는 연습을 해봐요.&rdquo;
        </p>
      </div>

      <div className={styles.tensionCta}>
        <Link href="/onboarding" className={styles.tensionCtaBtn}>
          내 긴장 분석 받기
        </Link>
        <span className={styles.tensionCtaSub}>녹음 30초면 결과가 나옵니다</span>
      </div>
    </div>
  );
}

/* ── Demo 탭 ── */
const TABS = [
  { id: 'chat', icon: <IconChat size={16} />, label: 'AI 코치 체험' },
  { id: 'tension', icon: <IconMic size={16} />, label: '4축 긴장 분석' },
];

export default function Demo() {
  const [tab, setTab] = useState<'chat' | 'tension'>('tension');

  return (
    <section id="demo" className={styles.demo}>
      <div className="container">
        <div className={`${styles.head} reveal`}>
          <div className="section-kicker" style={{ justifyContent: 'center' }}>직접 확인</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            실제로 어떻게 작동하는지
          </h2>
          <p className={styles.headDesc}>
            녹음하면 4축 긴장이 수치로 나옵니다. AI 코치는 원인과 해결 방법을 바로 알려줍니다.
          </p>
        </div>

        {/* 탭 */}
        <div className={styles.tabRow}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id as 'chat' | 'tension')}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div className={styles.demoGrid}>
          <div className={`${styles.mainPanel} reveal`}>
            {tab === 'chat' ? <ChatBox /> : <TensionDemo />}
          </div>

          <div className={`${styles.descWrap} reveal`}>
            {tab === 'tension' ? (
              <>
                <div className={styles.demoRow}>
                  <div className={styles.demoRowIcon} style={{ background: 'rgba(239,68,68,0.12)' }}>
                    <IconMic size={20} />
                  </div>
                  <div>
                    <div className={styles.demoRowTitle}>왜 목이 조이는지 알려줍니다</div>
                    <div className={styles.demoRowDesc}>
                      일반 앱은 "음정이 틀렸어요"까지만 말해요. HLB는 <strong>후두가 올라가서</strong> 음정이 틀렸다고 알려줍니다.
                    </div>
                  </div>
                </div>
                <div className={styles.demoRow}>
                  <div className={styles.demoRowIcon} style={{ background: 'rgba(59,130,246,0.12)' }}>
                    <IconTarget size={20} />
                  </div>
                  <div>
                    <div className={styles.demoRowTitle}>4부위를 동시에 분석</div>
                    <div className={styles.demoRowDesc}>
                      후두·혀뿌리·턱·성구전환을 한 번의 녹음으로 측정합니다. 어디서 힘을 빼야 하는지 바로 보입니다.
                    </div>
                  </div>
                </div>
                <div className={styles.demoRow}>
                  <div className={styles.demoRowIcon} style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <IconChat size={20} />
                  </div>
                  <div>
                    <div className={styles.demoRowTitle}>감각 언어로 설명</div>
                    <div className={styles.demoRowDesc}>
                      "Jitter 수치가 0.8%"가 아니라 "목 안쪽이 좁게 느껴지나요?"처럼 실제로 느낄 수 있는 말로 전달합니다.
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.demoRow}>
                  <div className={styles.demoRowIcon} style={{ background: 'rgba(59,130,246,0.12)' }}>
                    <IconChat size={20} />
                  </div>
                  <div>
                    <div className={styles.demoRowTitle}>실제 AI가 답합니다</div>
                    <div className={styles.demoRowDesc}>
                      미리 만든 답변이 아닙니다. 7년 트레이너 커리큘럼을 학습한 AI가 맞춤 답변을 생성합니다.
                    </div>
                  </div>
                </div>
                <div className={styles.demoRow}>
                  <div className={styles.demoRowIcon} style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <IconTarget size={20} />
                  </div>
                  <div>
                    <div className={styles.demoRowTitle}>즉각적인 피드백</div>
                    <div className={styles.demoRowDesc}>
                      레슨 예약도, 대기도 없습니다. 지금 궁금한 것을 바로 물어보세요.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
