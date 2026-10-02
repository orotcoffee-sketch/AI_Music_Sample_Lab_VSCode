# CLAUDE.md — 이 프로젝트를 수정할 때의 규칙

## 프로젝트

AI Music Sample Lab. HTML / CSS / Vanilla JavaScript만 쓰는 정적 멀티 페이지 과제 프로젝트.
실제 YuE2를 실행하지 않는다. Web Audio 데모 프로토타입이다.

수정 전에 `docs/ARCHITECTURE.md`와 `docs/MAINTENANCE_MAP.md`를 읽고, 고칠 파일을 먼저 특정한다.

## 절대 금지

- React / Vue / Angular / Next / Bootstrap / Tailwind / jQuery 등 프레임워크·UI 라이브러리
- npm 패키지, package.json, 번들러, 외부 CDN, 외부 폰트, Node/Python 서버
- 실제 YuE2 연동 코드
- ES module(`import`/`export`)로의 전환 — `file://`로 열어도 동작해야 하므로 일반 `<script>` + `window.SampleLab` 네임스페이스를 유지한다.
- 사용자 요청 없는 기능 추가, 디자인 전면 변경

## 책임 분리 (위반 금지)

| 파일 | 책임 | 하면 안 되는 것 |
|---|---|---|
| `core/config.js` | 설정값(장르, BPM, 세부장르, 유형, 개수, 저장 키, 최대 개수) | 로직 |
| `core/utils.js` | 순수 함수(ID, 날짜, clamp, seededRandom) | DOM / localStorage / Web Audio |
| `core/storage.js` | localStorage 읽기·쓰기·upsert·favorite·삭제·초기화 | DOM, 다른 곳에서 localStorage 직접 접근 허용 |
| `core/audio-engine.js` | 15초 버퍼 생성, play/stop, waveform, WAV | 페이지 DOM 조회·조작 |
| `pages/sampler-page.js` | sampler.html의 DOM, 이벤트, 카드 렌더링, core 연결 | 오디오 합성·localStorage 직접 접근 |
| `pages/history-page.js` | history.html의 DOM, 렌더링, 필터, favorite, 삭제 | 오디오, localStorage 직접 접근 |
| `css/tokens.css` | 변수만 | 선택자 규칙 |
| `css/layout.css` | 리셋, 컨테이너, header/footer, 카드 grid, 반응형 | 개별 컴포넌트 스타일 |
| `css/components.css` | button, form, status, card, waveform | 특정 페이지 전용 배치 |
| `css/pages.css` | 페이지별 고유 배치 | 공통 컴포넌트 재정의 |

## 의존 방향

`Page Controller → Core` 한 방향만. core가 page 파일, 페이지 DOM(id/class), 다른 page를 참조하면 안 된다.
page 컨트롤러끼리도 서로 참조하지 않는다. 공유가 필요하면 core로 올린다.

## 규칙

- localStorage는 `storage.js`만 접근한다. 저장 키·최대 개수는 `config.js`의 값만 쓴다.
- 장르/BPM/옵션 등 하드코딩 값은 `config.js`로. HTML `<option>`에 직접 쓰지 않는다 (JS가 config로 채운다).
- 색·폰트·간격은 `tokens.css` 변수를 쓴다. 컴포넌트에 색상 리터럴을 새로 늘리지 않는다.
- script 로딩 순서 고정: sampler = config → utils → storage → audio-engine → sampler-page / history = config → utils → storage → history-page. 새 core 파일을 추가하면 모든 필요한 페이지의 순서와 ARCHITECTURE.md를 같이 갱신한다.
- 파일 경로: root의 `index.html`은 `assets/...`, `pages/*.html`은 `../assets/...`. 메뉴는 4개 HTML 모두 수정.
- 저장 데이터 형식(`docs/ARCHITECTURE.md` 참고)을 바꾸면 기존 저장분과 호환되는지 확인하고 문서에 적는다.

## 최소 수정 원칙

1. 문제를 "문제 → 원인 → 수정 대상 파일 → 수정 내용"으로 먼저 판단한다.
2. MAINTENANCE_MAP에서 해당하는 파일만 수정한다. 여러 파일에 걸치면 이유를 설명한다.
3. 정상 동작하는 코드는 다시 쓰지 않는다. 파일 전체 재작성 대신 부분 수정한다.
4. 기능 수정과 구조 리팩터링을 한 번에 크게 하지 않는다.
5. 구조(파일 추가/삭제/이동, 의존 방향, 로딩 순서)를 바꾸면 `docs/ARCHITECTURE.md`와 `docs/CHANGELOG.md`를 같이 갱신한다. 책임이 바뀌면 `docs/MAINTENANCE_MAP.md`도 갱신한다.
6. 새 limitation을 발견하면 `docs/KNOWN_LIMITATIONS.md`에 적는다.

## 검증 보고

- 브라우저에서 실제로 실행하지 않았다면 "테스트 완료"라고 쓰지 않는다. 정적 검증만 했다고 적는다.
- 수동 절차는 `docs/TEST_CHECKLIST.md`.
- 정적으로 확인할 것: HTML의 경로, script/CSS 순서, `querySelector` id ↔ HTML id, `SampleLab.*` 호출 ↔ 정의, 중복 함수, 삭제한 파일의 잔여 참조.
