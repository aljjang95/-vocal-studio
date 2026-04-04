import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")

@pytest.mark.asyncio
async def test_health(client):
    resp = await client.get("/health")
    assert resp.status_code == 200

@pytest.mark.asyncio
async def test_evaluate_requires_audio(client):
    resp = await client.post("/evaluate", json={"stage_id": 1})
    assert resp.status_code == 422

@pytest.mark.asyncio
async def test_evaluate_with_mock_audio(client, monkeypatch):
    import services.audio_service as audio_svc
    monkeypatch.setattr(audio_svc, "analyze_audio_file", lambda path: {
        "pitch_values": [261.6, 293.7, 329.6, 349.2, 392.0],
        "avg_pitch": 325.2, "tone_stability": 88.0, "duration": 5.0,
    })
    resp = await client.post("/evaluate", json={
        "stage_id": 1, "audio_url": "file:///fake/audio.wav",
        "target_pitches": [261.6, 293.7, 329.6, 349.2, 392.0],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "score" in data and "feedback" in data
    assert 0 <= data["score"] <= 100
