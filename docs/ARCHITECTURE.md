# ARCHITECTURE

## 한 줄 요약

HTML / CSS / Vanilla JavaScript만 쓰는 멀티 페이지 정적 사이트. 빌드·서버 없이 `index.html`을 브라우저에서 열면 동작한다.
JS는 ES module이 아니라 일반 `<script>`로 로드하며(`file://`에서도 동작), 공유 코드는 `window.SampleLab` 네임스페이스에 붙는다.

## 폴더 구조

```
index.html                 HOME
pages/
  sampler.html             SAMPLER
  history.html             HISTORY
  about.html               ABOUT
assets/
  css/
    tokens.css             색상·폰트·간격·크기 변수
    layout.css             리셋, 컨테이너, header/footer, 카드 grid, 반응형 구조
    components.css         button, form, status, card, waveform
    pages.css              HOME/SAMPLER/HISTORY/ABOUT 고유 배치
  js/
    core/                  페이지를 모르는 로직
      config.js            설정값
      utils.js             순수 함수
      storage.js           localStorage
      audio-engine.js      Web Audio / waveform / WAV
    pages/                 페이지 컨트롤러 (DOM + 이벤트)
      sampler-page.js
      history-page.js
docs/                      문서
```

## 의존 방향

```
Page Controller  (assets/js/pages/*)
        ↓
Core             (assets/js/core/*)
```

- Page → Core 방향만 허용. **core가 page 파일이나 페이지 DOM(id/class 선택자)에 의존하는 역방향은 금지.**
- 페이지 컨트롤러끼리 서로 참조하지 않는다. (sampler-page ↔ history-page 없음. 둘은 localStorage 데이터로만 간접 연결된다.)

core 내부 의존:

```
config.js        (의존 없음)
utils.js         (의존 없음)
storage.js       → Config
audio-engine.js  → Config, Utils
```

| 모듈 | 노출 이름 | 금지 사항 |
|---|---|---|
| config.js | `SampleLab.Config` | 로직 |
| utils.js | `SampleLab.Utils` | DOM / localStorage / Web Audio |
| storage.js | `SampleLab.Storage` | DOM |
| audio-engine.js | `SampleLab.AudioEngine` | 페이지 DOM 조회·조작 (호출자가 넘긴 canvas에 그리는 것만 허용) |

## Script 로딩 순서

`pages/sampler.html`
```
config.js → utils.js → storage.js → audio-engine.js → sampler-page.js
```
`pages/history.html`
```
config.js → utils.js → storage.js → history-page.js
```
(history 페이지는 오디오를 쓰지 않으므로 audio-engine.js를 로드하지 않는다.)
`index.html`, `about.html`은 JS를 로드하지 않는다.

## CSS 로딩 순서

모든 페이지 동일: `tokens.css → layout.css → components.css → pages.css`
(뒤 파일이 앞 파일을 덮어쓸 수 있다. 각 파일은 자기 영역의 `@media` 반응형을 함께 가진다.)

## 데이터 구조 (localStorage)

키: `Config.STORAGE_KEY` (`sampleLabHistory`), 최대 `Config.MAX_HISTORY`(60)개, 최신순 배열.

```js
{
  id: "SMP-<batchId>-01",
  genre: "ukg",            // Config.GENRES[].id
  genreName: "UK GARAGE",
  subgenre: "2-STEP",
  type: "hook",            // Config.SAMPLE_TYPES[].id
  prompt: "...",
  favorite: false,
  createdAt: "2026-01-01T00:00:00.000Z"
}
```
오디오 데이터(AudioBuffer)는 저장하지 않는다. History 카드는 메타데이터만 보여준다.

## 두 페이지의 연결 방식

- Sampler가 GENERATE 시 `Storage.upsert()`로 기록한다.
- History가 `Storage.readAll()`로 읽는다.
- History에서 바뀐 favorite는 Sampler 화면에 떠 있는 카드에 `focus` / `pageshow` / `visibilitychange` / `storage` 이벤트 때 `syncFavorites()`로 반영된다.
