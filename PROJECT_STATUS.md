# PROJECT STATUS

기준일: 2026-10-02

## 프로젝트 목적

Suno 반복 생성으로 크레딧이 소모되는 문제에서 출발한 아이디어(YuE2로 15초 샘플을 여러 개 먼저 비교 → 선택한 방향만 Suno에서 발전)를 HTML/CSS/Vanilla JS 멀티 페이지 웹 과제로 구현한다. 실제 YuE2 연동은 없고 Web Audio 데모를 사용한다.

## 현재 구현 완료 기능

- 4개 페이지(HOME / SAMPLER / HISTORY / ABOUT)와 공통 header
- Genre → Subgenre 연동 select, Sample Type, Count(3/5/8), Prompt (옵션은 `config.js`에서 생성)
- GENERATE: 15초 AudioBuffer 생성, 진행 표시, 카드 렌더링
- Canvas waveform (창 크기 변경 시 재렌더)
- PLAY / STOP (동시에 하나만 재생), WAV 다운로드
- Favorite (Sampler / History 공유, History 변경분은 Sampler 복귀 시 반영)
- localStorage 기록 (최근 60개)
- History: 필터(ALL / FAVORITES / 장르별), Favorite, 개별 삭제, 전체 삭제(confirm)
- 반응형 CSS (820px / 480px 기준)
- 책임별 구조: core(config, utils, storage, audio-engine) / pages(sampler-page, history-page) / CSS 4분할

## 검증 상태

- **정적 검증 완료**: 파일 경로, script/CSS 로딩 순서, DOM id ↔ JS 참조, 모듈 함수 참조, 중복 코드, 잔여 flat 파일 참조.
- **headless Edge 스모크 테스트 완료**: Sampler/History 주요 흐름을 DOM 수준에서 확인 (상세: `docs/TEST_CHECKLIST.md` 검증 이력).
- **사람이 직접 하는 브라우저 테스트는 아직 안 했다**: 실제 소리, WAV 재생, 시각 레이아웃, 모바일 화면, 실제 resize. `docs/TEST_CHECKLIST.md`를 Chrome/Edge에서 수행해야 한다.

## 알려진 limitation

요약 (자세한 내용은 `docs/KNOWN_LIMITATIONS.md`):
- 실제 AI 생성이 아닌 동기식 Web Audio 데모
- 오디오는 저장되지 않아 History에서 재생/WAV 불가
- favorite 동기화는 실시간이 아니라 페이지 복귀 시점 반영
- 새 장르를 config에 추가해도 소리 분기는 `audio-engine.js`에서 별도 수정 필요
- 자동 테스트 없음

## 다음 개발자가 처음 읽어야 할 파일 순서

1. `README.md` — 목적과 실행 방법
2. `PROJECT_STATUS.md` — (이 문서) 현재 상태
3. `docs/ARCHITECTURE.md` — 의존 방향, 로딩 순서, 데이터 구조
4. `docs/MAINTENANCE_MAP.md` — 무엇을 고치려면 어느 파일인지
5. `CLAUDE.md` — 수정 규칙 (AI/사람 공통으로 읽어둘 것)
6. `assets/js/core/config.js` → `storage.js` → `audio-engine.js`
7. `assets/js/pages/sampler-page.js`, `history-page.js`
8. `docs/KNOWN_LIMITATIONS.md`, `docs/TEST_CHECKLIST.md`
