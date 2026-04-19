/**
 * utils.js — 순수 유틸리티 함수 모음
 * DOM 접근 없음, 전역 상태 의존 없음
 * types.js 이후, 다른 모든 모듈보다 먼저 로드되어야 함
 */

/**
 * DOM 엘리먼트 조회 (document.getElementById 축약)
 * @param {string} id
 * @returns {HTMLElement|null}
 */
function ge(id){return document.getElementById(id);}

/**
 * DOM 엘리먼트 value 조회
 * @param {string} id
 * @returns {string}
 */
function gv(id){var el=ge(id);return el?el.value:'';}

/**
 * 레슨생 색상 조회 (COLORS 배열 기반)
 * @param {object} s - 레슨생 객체
 * @returns {string}
 */
function gc(s){var i=students.indexOf(s);return COLORS[i>=0?i%COLORS.length:0]||COLORS[0];}

/**
 * 반 라벨 (pro=발성전문반, hobby=취미반)
 */
function clsL(c){return c==='pro'?'발성전문반':'취미반';}

/**
 * 반 레슨 시간 (pro=1시간, hobby=50분)
 */
function clsD(c){return c==='pro'?'1시간':'50분';}

/**
 * 고유 ID 생성 (타임스탬프 + 랜덤)
 * @returns {string}
 */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Date → 'YYYY-MM-DD' 문자열 변환
 * @param {Date} d
 * @returns {string}
 */
function toDS(d) {
  var y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
  return y + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd;
}

/**
 * 주어진 날짜가 속한 주의 월요일 반환
 * 주의: 소스에 getMonday 중복 존재 (~4959) — getMon이 정본이며 getMonday는 삭제 대상
 * @param {Date} d
 * @returns {Date}
 */
function getMon(d) {
  var x = new Date(d);
  var dw = x.getDay();
  x.setDate(x.getDate() - (dw === 0 ? 6 : dw - 1));
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * 날짜에 n일 더한 새 Date 반환
 * @param {Date} d
 * @param {number} n
 * @returns {Date}
 */
function addDays(d, n) {
  var x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/**
 * 날짜를 짧은 형식으로 포맷 (예: '4월 17일')
 * @param {Date} d
 * @returns {string}
 */
function fmtS(d) {
  return d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
}

/**
 * 날짜를 긴 형식으로 포맷 (예: '2026년 4월 17일 금요일')
 * @param {Date} d
 * @returns {string}
 */
function fmtL(d) {
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

/**
 * 날짜(월요일)에서 ISO 주차 키 생성 (예: '2026-W16')
 * @param {Date} m - 해당 주의 월요일
 * @returns {string}
 */
function getWK(m) {
  var y = m.getFullYear();
  var s = new Date(y, 0, 1);
  var w = Math.ceil(((m - s) / 864e5 + s.getDay() + 1) / 7);
  return y + '-W' + (w < 10 ? '0' : '') + w;
}

/**
 * 숫자를 한국 원화 형식으로 포맷 (예: '350,000원')
 * @param {number} n
 * @returns {string}
 */
function won(n) {
  return n ? Number(n).toLocaleString('ko-KR') + '원' : '';
}

/**
 * HTML 특수문자 이스케이프
 * @param {string} s
 * @returns {string}
 */
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 'YYYY-MM-DD' 문자열을 로컬 타임존 기준 Date로 파싱
 * new Date('YYYY-MM-DD')는 UTC 기준이라 시차 문제 발생 — 이 함수로 해결
 * @param {string} ds
 * @returns {Date}
 */
function parseDateLocal(ds) {
  var p = ds.split('-');
  return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
}
