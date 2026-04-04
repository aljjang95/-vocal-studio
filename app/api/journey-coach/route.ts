import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.VOCAL_BACKEND_URL ?? 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const resp = await fetch(`${BACKEND_URL}/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch {
    return NextResponse.json(
      { error: '코칭 서버 연결 실패', code: 'BACKEND_ERROR' },
      { status: 502 },
    );
  }
}
