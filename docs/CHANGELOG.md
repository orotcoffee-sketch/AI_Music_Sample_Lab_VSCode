# CHANGELOG

## 2026-10-02 — 제출 전 QA 수정 (구조 변경 없음)

- `core/audio-engine.js`: PLAY를 빠르게 연타하거나 PLAY 직후 STOP/페이지 이탈 시, `resume()` 대기 중이던 이전 요청이 뒤늦게 재생되어 소리가 겹치거나 STOP이 무시되던 경쟁 상태를 수정 (`playRequestId`로 오래된 요청 무효화)
- `pages/history-page.js`: 장르 이름을 저장된 `genreName`보다 `Config.GENRES`를 우선해 표시 (config 이름 변경이 History에 일관되게 반영)
- `css/layout.css`, `css/components.css`: 토큰과 같은 값의 리터럴 색(`#666`, `#0a0a0a`)을 변수로 치환 (표시 색 동일)

## 2026-10-02 — 구조 리팩터링 (기능 추가 없음)

flat prototype(`style.css`, `sampler.js`, `history.js`, 루트의 HTML 4개)을 책임별 구조로 분리했다.

### 구조
- `sampler.html`, `history.html`, `about.html` → `pages/`로 이동 (`index.html`은 루트 유지)
- `style.css` → `assets/css/{tokens,layout,components,pages}.css`
- `sampler.js` → `core/config.js`, `core/utils.js`, `core/audio-engine.js`, `pages/sampler-page.js`
- `history.js` → `pages/history-page.js`
- localStorage 코드(두 파일에 중복) → `core/storage.js` 하나로 통합
- 장르/BPM/세부장르/유형/개수/저장 키/최대 개수 → `core/config.js`
- 공통 JS는 `window.SampleLab.*` 네임스페이스, 일반 `<script>` 로딩 (`file://` 호환 유지)
- 삭제: 루트의 `style.css`, `sampler.js`, `history.js`, `sampler.html`, `history.html`, `about.html`, `README.txt`
- `CLAUDE_BUILD_SPEC.md`: 구조 부분이 superseded 되었음을 상단에 표기 (본문 유지)

### 중복 제거
- `HISTORY_KEY` 상수, history 읽기(JSON 파싱 + 배열 검사), 쓰기, 날짜 포맷을 각 한 곳으로 통합
- 장르 이름 매핑(`ukg→UK GARAGE` 등)을 `Config.GENRES` 하나로 통합 (기존: sampler.js `subgenres`, history.js `genreNames`, HTML `<option>` 3곳)

### 동작 변경 (작은 수정 2건)
- Sampler: 창 크기 변경 시 waveform 재렌더
- Sampler: History에서 바뀐 favorite를 `focus`/`pageshow`/`visibilitychange`/`storage` 때 카드에 반영
- waveform 색을 하드코딩(`#d8ff3e`) 대신 CSS 변수 `--lime`에서 읽도록 변경 (색은 동일)

### 보존
- 기존 오디오 생성 수식, WAV 인코딩, 카드/History 렌더링 구조, 디자인(색·크기·레이아웃)은 그대로 옮겼다. CSS는 색/폰트/간격 값을 변수로 치환했을 뿐 값은 같다.
- Sampler select 옵션과 History 필터 옵션은 HTML 하드코딩에서 JS(config 기반) 생성으로 바뀌었다. 화면 결과는 동일해야 한다.

### 검증
- 정적 검증 + headless Edge 스모크 테스트(Sampler/History 주요 흐름, DOM 수준). 소리 청취, 시각 확인, 모바일 화면, 실제 resize는 미확인. 상세는 `TEST_CHECKLIST.md` 검증 이력.
