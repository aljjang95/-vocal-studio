import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")

@pytest.mark.asyncio
async def test_coach_requires_stage_id(client):
    resp = await client.post("/coach", json={})
    assert resp.status_code == 422

@pytest.mark.asyncio
async def test_coach_returns_feedback(client, monkeypatch):
    import services.rag_service as rag_svc
    monkeypatch.setattr(rag_svc, "get_coaching_feedback", lambda **kw: {
        "feedback": "턱을 편하게 내려놓는 감각을 유지해보세요.",
        "next_exercise": "허밍으로 같은 음을 다시 해볼까요?",
        "encouragement": "좋아요, 방향이 맞아요!",
    })
    resp = await client.post("/coach", json={
        "stage_id": 3, "user_message": "모음 전환할 때 목이 긴장돼요",
        "score": 65, "pitch_accuracy": 70,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "feedback" in data and "next_exercise" in data

@pytest.mark.asyncio
async def test_coach_returns_encouragement(client, monkeypatch):
    import services.rag_service as rag_svc
    monkeypatch.setattr(rag_svc, "get_coaching_feedback", lambda **kw: {
        "feedback": "호흡이 안정적으로 흐르는 감각이 느껴지시나요?",
        "next_exercise": "같은 음을 모음 'ㅏ'로 다시 해볼까요?",
        "encouragement": "정말 잘하고 있어요!",
    })
    resp = await client.post("/coach", json={"stage_id": 1})
    assert resp.status_code == 200
    data = resp.json()
    assert "encouragement" in data
    assert len(data["encouragement"]) > 0

@pytest.mark.asyncio
async def test_coach_default_values(client, monkeypatch):
    import services.rag_service as rag_svc
    captured = {}
    def fake_feedback(**kw):
        captured.update(kw)
        return {
            "feedback": "기본값 테스트",
            "next_exercise": "다시 해볼까요?",
            "encouragement": "잘했어요!",
        }
    monkeypatch.setattr(rag_svc, "get_coaching_feedback", fake_feedback)
    resp = await client.post("/coach", json={"stage_id": 5})
    assert resp.status_code == 200
    assert captured["user_message"] == ""
    assert captured["score"] == 0
    assert captured["pitch_accuracy"] == 0

@pytest.mark.asyncio
async def test_coach_invalid_body_type(client):
    resp = await client.post("/coach", json={"stage_id": "not_an_int"})
    assert resp.status_code == 422

@pytest.mark.asyncio
async def test_coach_low_score_feedback(client, monkeypatch):
    import services.rag_service as rag_svc
    captured = {}
    def fake_feedback(**kw):
        captured.update(kw)
        return {
            "feedback": "아직 연습이 필요해요, 천천히 해보세요.",
            "next_exercise": "허밍부터 다시 시작해볼까요?",
            "encouragement": "처음엔 누구나 어려워요!",
        }
    monkeypatch.setattr(rag_svc, "get_coaching_feedback", fake_feedback)
    resp = await client.post("/coach", json={
        "stage_id": 2, "user_message": "어렵네요", "score": 10, "pitch_accuracy": 20,
    })
    assert resp.status_code == 200
    assert captured["score"] == 10
    assert captured["pitch_accuracy"] == 20
