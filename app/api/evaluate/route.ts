import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.VOCAL_BACKEND_URL ?? 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as File | null;
    const stageId = formData.get('stage_id') as string;
    const targetPitches = formData.get('target_pitches') as string;

    if (!audio || !stageId) {
      return NextResponse.json(
        { error: '오디오와 단계 ID가 필요합니다', code: 'MISSING_FIELDS' },
        { status: 400 },
      );
    }

    const resp = await fetch(`${BACKEND_URL}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage_id: parseInt(stageId, 10),
        audio_url: 'file:///tmp/recording.wav',
        target_pitches: JSON.parse(targetPitches || '[]'),
      }),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch {
    return NextResponse.json(
      { error: '채점 서버 연결 실패', code: 'BACKEND_ERROR' },
      { status: 502 },
    );
  }
}
