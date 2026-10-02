# REQUIREMENTS

(최초 `CLAUDE_BUILD_SPEC.md`의 기능·디자인·과제 조건을 정리한 것. 폴더 구조 요구사항은 `ARCHITECTURE.md`가 우선한다.)

## 프로젝트

- 이름: AI Music Sample Lab / 브랜드 `SAMPLE//LAB`
- 부제: 15초 음악 아이디어 생성 및 비교 웹 프로그램
- 배경: Suno로 반복 생성하면 크레딧이 소모된다 → 로컬 YuE2로 15초 샘플을 여러 개 먼저 만들어 방향을 정하고, 선택한 아이디어만 Suno에서 발전시킨다. 이 흐름을 웹 프로토타입으로 보여준다.
- **실제 YuE2를 실행하지 않는다.** 브라우저 Web Audio로 만든 15초 데모 사운드다.

## 기술 제약

- HTML / CSS / Vanilla JavaScript만 사용
- React, Vue, Angular, Next.js, Bootstrap, Tailwind, jQuery 금지
- npm 패키지, 외부 CDN, 외부 폰트, 서버(Node/Python) 금지
- `index.html`을 Chrome/Edge에서 열면 실행되어야 한다
- 여러 페이지로 구성, 프로젝트는 하나의 폴더에서 관리

## 페이지

| 페이지 | 요구 |
|---|---|
| HOME | 소개, WORKFLOW 4단계, WHY THIS PROJECT 흐름, SAMPLER/ABOUT 버튼 |
| SAMPLER | GENRE / SUBGENRE / SAMPLE TYPE / COUNT(3·5·8, 기본 5) / PROMPT, GENERATE, 진행 표시, 샘플 카드 |
| HISTORY | 필터(ALL, FAVORITES, 장르별), 카드, Favorite, 개별 삭제, 전체 삭제(confirm) |
| ABOUT | 기획 의도 4단계, 사용 기술 |

## SAMPLER 기능

- GENERATE: 선택한 개수만큼 15초 AudioBuffer 생성 → 카드 → waveform → localStorage 기록
- 상태: `READY` → `GENERATING...` → `N SAMPLES READY`
- 카드: Sample ID, Genre, Subgenre, Type, 15 SEC, Prompt, waveform(Canvas), PLAY, STOP, WAV, Favorite
- PLAY/STOP: 동시에 하나만 재생
- WAV: JS로 AudioBuffer → WAV Blob 다운로드
- Favorite: localStorage에 저장
- 기록: 최근 60개까지 유지

## 디자인

Dark / Minimal / Music workstation / Modern terminal. 배경 거의 검정, 패널 짙은 회색, 포인트 형광 라임, system monospace(Courier New). PC 기준으로 완성하되 모바일에서도 레이아웃이 깨지지 않을 것.

## 유지보수 요구 (리팩터링 이후 추가)

- 기술팀장/개발팀장이 폴더를 열었을 때 파일별 책임이 바로 보일 것
- 기능 하나를 고치기 위해 전체를 다시 쓰지 않도록 책임 분리, 관련 파일만 최소 수정
