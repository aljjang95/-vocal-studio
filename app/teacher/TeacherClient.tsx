'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './teacher.module.css';

interface FeedbackRequest {
  id: string;
  user_id: string;
  audio_path: string | null;
  concern: string;
  status: 'pending' | 'completed' | 'reviewed';
  teacher_comment: string | null;
  created_at: string;
  profiles: { email: string; full_name: string | null } | null;
}

type StatusFilter = 'all' | 'pending' | 'completed';

export default function TeacherClient() {
  const [requests, setRequests] = useState<FeedbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [comments, setComments] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const url = filter === 'all' ? '/api/teacher/requests' : `/api/teacher/requests?status=${filter}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json() as { requests: FeedbackRequest[] };
      setRequests(data.requests);
      const initComments: Record<string, string> = {};
      data.requests.forEach((r) => {
        initComments[r.id] = r.teacher_comment ?? '';
      });
      setComments(initComments);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const getAudioUrl = useCallback(async (req: FeedbackRequest) => {
    if (audioUrls[req.id] || !req.audio_path) return;
    const res = await fetch(`/api/storage-url?path=${encodeURIComponent(req.audio_path)}`);
    if (res.ok) {
      const { url } = await res.json() as { url: string };
      setAudioUrls((prev) => ({ ...prev, [req.id]: url }));
    }
  }, [audioUrls]);

  const saveComment = async (id: string, newStatus?: string) => {
    setSaving((prev) => ({ ...prev, [id]: true }));
    await fetch(`/api/teacher/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacher_comment: comments[id] ?? '',
        ...(newStatus ? { status: newStatus } : {}),
      }),
    });
    setSaving((prev) => ({ ...prev, [id]: false }));
    void loadRequests();
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.title}>선생님 대시보드</h1>
            <p className={styles.subtitle}>유료 피드백 신청 관리</p>
          </div>
          {pendingCount > 0 && (
            <span className={styles.badge}>{pendingCount}개 대기중</span>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {/* 필터 탭 */}
        <div className={styles.tabs}>
          {(['pending', 'all', 'completed'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              className={`${styles.tab} ${filter === s ? styles.tabActive : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'pending' ? '대기중' : s === 'all' ? '전체' : '완료'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>불러오는 중...</div>
        ) : requests.length === 0 ? (
          <div className={styles.empty}>
            {filter === 'pending' ? '대기중인 신청이 없습니다.' : '신청 내역이 없습니다.'}
          </div>
        ) : (
          <div className={styles.list}>
            {requests.map((req) => (
              <div key={req.id} className={`${styles.card} ${req.status === 'completed' ? styles.cardDone : ''}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>
                      {req.profiles?.full_name ?? req.profiles?.email ?? req.user_id.slice(0, 8)}
                    </span>
                    <span className={styles.userEmail}>{req.profiles?.email}</span>
                  </div>
                  <div className={styles.meta}>
                    <span className={`${styles.statusBadge} ${styles[`status_${req.status}`]}`}>
                      {req.status === 'pending' ? '대기' : req.status === 'reviewed' ? '검토중' : '완료'}
                    </span>
                    <span className={styles.date}>
                      {new Date(req.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* 고민/요청사항 */}
                <div className={styles.concern}>
                  <p className={styles.concernLabel}>고민/요청</p>
                  <p className={styles.concernText}>{req.concern}</p>
                </div>

                {/* 오디오 재생 */}
                {req.audio_path && (
                  <div className={styles.audioSection}>
                    <p className={styles.concernLabel}>녹음 파일</p>
                    {audioUrls[req.id] ? (
                      <audio controls className={styles.audio} src={audioUrls[req.id]} />
                    ) : (
                      <button
                        className={styles.loadAudioBtn}
                        onClick={() => void getAudioUrl(req)}
                      >
                        녹음 듣기
                      </button>
                    )}
                  </div>
                )}

                {/* 선생님 코멘트 */}
                <div className={styles.commentSection}>
                  <p className={styles.concernLabel}>코멘트 작성</p>
                  <textarea
                    className={styles.textarea}
                    placeholder="피드백 코멘트를 입력하세요..."
                    value={comments[req.id] ?? ''}
                    onChange={(e) => setComments((prev) => ({ ...prev, [req.id]: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* 액션 버튼 */}
                <div className={styles.actions}>
                  <button
                    className={styles.btnSave}
                    onClick={() => void saveComment(req.id)}
                    disabled={saving[req.id]}
                  >
                    {saving[req.id] ? '저장 중...' : '코멘트 저장'}
                  </button>
                  {req.status !== 'completed' && (
                    <button
                      className={styles.btnComplete}
                      onClick={() => void saveComment(req.id, 'completed')}
                      disabled={saving[req.id]}
                    >
                      완료 처리
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
