# MAINTENANCE MAP — 무엇을 수정하려면 어느 파일을 보나

## 기능 / 설정

| 하고 싶은 일 | 볼 파일 |
|---|---|
| 장르 추가·이름 변경 | `assets/js/core/config.js` (`GENRES`) — Sampler select와 History 필터에 자동 반영 |
| 세부 장르 변경 | `assets/js/core/config.js` (`GENRES[].subgenres`) |
| BPM / 베이스 음높이 변경 | `assets/js/core/config.js` (`bpm`, `baseFreq`, `swingHz`) |
| 샘플 유형 추가 | `config.js` (`SAMPLE_TYPES`) + 유형별 소리는 `audio-engine.js` (`createSampleBuffer`) |
| 생성 개수 선택지 / 기본값 | `config.js` (`COUNTS`, `DEFAULT_COUNT`) |
| History 최대 개수, localStorage 키 | `config.js` (`MAX_HISTORY`, `STORAGE_KEY`) |
| 샘플 길이 / 샘플레이트 | `config.js` (`SAMPLE_DURATION`, `SAMPLE_RATE`) |
| 새 장르의 소리 방식 변경 | `audio-engine.js` — 장르별 믹스 분기(`rnb`, `house`, 그 외는 UKG 방식) |

## 오류 → 파일

| 증상 | 볼 파일 |
|---|---|
| Generate 눌러도 카드가 안 생김 / 진행바 오류 | `assets/js/pages/sampler-page.js` (`generateSamples`) |
| 장르 바꿔도 Subgenre가 안 바뀜 | `sampler-page.js` (`fillSubgenres`) + `config.js` |
| 카드 모양/버튼 동작 | `sampler-page.js` (`createSampleCard`) |
| Sampler에서 Favorite 안 바뀜 | `sampler-page.js` (`toggleFavorite`) → `storage.js` |
| 소리가 안 나옴 / PLAY·STOP 오류 / 동시 재생 | `assets/js/core/audio-engine.js` (`play`, `stop`) |
| waveform이 안 그려짐 | `audio-engine.js` (`drawWaveform`), 크기는 `components.css` (`.waveform`) |
| waveform이 resize 후 흐림 | `sampler-page.js` (`redrawWaveforms`) |
| WAV 파일이 이상함 | `audio-engine.js` (`toWavBlob`) |
| WAV 다운로드 버튼 | `sampler-page.js` (`downloadWav`) |
| History 저장/읽기/삭제 오류 | `assets/js/core/storage.js` |
| History 필터 오류 | `assets/js/pages/history-page.js` (`filterItems`, `initFilter`) |
| History 화면 렌더링 / 삭제·Favorite 버튼 | `history-page.js` |
| 날짜 표시 형식 | `assets/js/core/utils.js` (`formatDateTime`) |
| ID 형식 | `utils.js` (`createSampleId`, `createBatchId`) |

## 디자인

| 하고 싶은 일 | 볼 파일 |
|---|---|
| 전체 색상 / 폰트 / 간격 | `assets/css/tokens.css` |
| waveform 선 색상 | `tokens.css` (`--lime`) — canvas가 이 값을 읽는다 |
| header / footer / 컨테이너 폭 / 카드 grid 열 수 | `assets/css/layout.css` |
| 버튼·카드·폼·진행바·waveform 디자인 | `assets/css/components.css` |
| 페이지별 배치 (HOME hero, ABOUT grid, HISTORY toolbar 등) | `assets/css/pages.css` |
| 모바일 깨짐 | 해당 영역의 파일 안 `@media` (header·grid → layout, 폼·카드 → components, 페이지 배치 → pages) |

## 문구 / 페이지

| 하고 싶은 일 | 볼 파일 |
|---|---|
| HOME 문구 | `index.html` |
| ABOUT 문구 | `pages/about.html` |
| 메뉴 추가 | 4개 HTML 모두의 `<nav>` (경로 주의: root는 `pages/…`, pages는 `../index.html`) |
| 페이지 추가 | `pages/`에 HTML 추가, CSS 4개 + 필요한 script를 ARCHITECTURE.md의 순서대로 로드 |
