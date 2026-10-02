# AI Music Sample Lab (SAMPLE//LAB)

15초 음악 아이디어 생성 및 비교 웹 프로토타입.

Suno에서 원하는 음악 방향을 찾으려고 반복 생성하면 크레딧이 계속 소모된다. 그래서 로컬 환경(YuE2)에서 15초짜리 짧은 샘플을 여러 개 먼저 만들어 비교하고, 마음에 드는 방향만 Suno에서 발전시키는 흐름을 웹으로 표현했다.

> **실제 YuE2 모델을 실행하지 않는다.** 샘플 소리는 브라우저 Web Audio API로 만든 데모 사운드이며, 이 프로젝트는 사용 흐름과 아이디어를 보여주는 과제용 프로토타입이다.

## 실행

`index.html`을 Chrome 또는 Edge에서 열면 된다. 서버, 빌드, 설치, 인터넷 연결이 필요 없다.
(오디오는 PLAY 버튼을 눌러야 재생된다.)

## 기술 조건

HTML / CSS / Vanilla JavaScript만 사용. 프레임워크, 라이브러리, CDN, npm, 백엔드 없음.

## 페이지

| 페이지 | 파일 | 내용 |
|---|---|---|
| HOME | `index.html` | 소개, 워크플로, 아이디어 도출 흐름 |
| SAMPLER | `pages/sampler.html` | 조건 선택 → 15초 샘플 생성, waveform, PLAY/STOP, WAV, Favorite |
| HISTORY | `pages/history.html` | 저장된 기록 필터·즐겨찾기·삭제 |
| ABOUT | `pages/about.html` | 기획 의도, 사용 기술 |

## 구조

```
index.html
pages/                 sampler.html, history.html, about.html
assets/css/            tokens → layout → components → pages
assets/js/core/        config, utils, storage, audio-engine   (페이지를 모르는 로직)
assets/js/pages/       sampler-page, history-page             (DOM + 이벤트)
docs/                  ARCHITECTURE, MAINTENANCE_MAP, ...
```

수정할 곳을 찾으려면 [docs/MAINTENANCE_MAP.md](docs/MAINTENANCE_MAP.md), 설계는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), 현재 상태는 [PROJECT_STATUS.md](PROJECT_STATUS.md)를 본다.
