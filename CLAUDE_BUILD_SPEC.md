# AI Music Sample Lab — Claude Code Build Spec

## 0. 작업 지시

아래 요구사항을 기준으로 새 프로젝트를 처음부터 구현한다.

중요:
- 사용자에게 추가 질문하지 말고, 아래 명세를 우선 기준으로 완성한다.
- 외부 프레임워크를 사용하지 않는다.
- React, Vue, Next.js, Bootstrap, Tailwind, jQuery 사용 금지.
- npm 패키지 설치 없이 실행 가능해야 한다.
- HTML + CSS + Vanilla JavaScript만 사용한다.
- 외부 CDN도 사용하지 않는다.
- 서버나 Python 백엔드를 만들지 않는다.
- 실제 YuE2 AI 모델을 브라우저에서 실행하지 않는다.
- 이번 과제에서는 기존 YuE2 기반 15초 Sample Lab의 아이디어와 사용자 흐름을 웹 프로토타입으로 구현한다.
- 모든 파일은 하나의 독립 프로젝트 폴더 안에서 관리한다.
- index.html을 더블클릭하면 브라우저에서 시작할 수 있어야 한다.
- Chrome / Edge 최신 버전 기준으로 동작하게 한다.

---

# 1. 프로젝트명

AI Music Sample Lab

부제:
15초 음악 아이디어 생성 및 비교 웹 프로그램

브랜드 표기:
SAMPLE//LAB

---

# 2. 아이디어 도출 배경

다음 내용을 프로젝트 소개 페이지에 자연스럽게 반영한다.

AI 음악 생성 프로그램인 Suno가 어떤 방식으로 음악을 만들어내는지 궁금해서 직접 사용해보게 되었다.

사용해보니 원하는 음악을 찾기 위해 여러 번 생성할수록 크레딧이 계속 소모된다는 점이 아쉬웠다.

이후 로컬 환경에서 음악을 생성할 수 있는 YuE2를 알게 되었다.

YuE2는 Suno보다 결과물의 완성도는 낮을 수 있지만, 별도의 생성 크레딧을 사용하지 않고 로컬에서 여러 음악 아이디어를 시험할 수 있다는 장점이 있었다.

그래서 YuE2를 완성곡 제작보다 약 15초 길이의 짧은 음악 샘플을 여러 개 생성하는 용도로 활용하는 아이디어를 생각했다.

여러 개의 15초 샘플을 먼저 들어보고 원하는 음악 방향을 찾은 뒤, 선택한 아이디어만 Suno에서 발전시키면 불필요한 Suno 생성 횟수와 크레딧 소모를 줄일 수 있다.

이 아이디어를 HTML / CSS / JavaScript 기반 웹 프로젝트로 표현한다.

---

# 3. 과제 조건

반드시 지킨다.

1. 자신이 흥미를 느끼거나 직접 경험한 주제로 아이디어를 도출한다.
2. 최소 1개 이상의 페이지를 만든다.
3. 가능하면 여러 페이지로 구성한다.
4. HTML, CSS, JavaScript만 사용한다.
5. 외부 프레임워크는 사용하지 않는다.
6. 프로젝트별로 별도 폴더에서 관리한다.

이번 프로젝트는 여러 페이지 구성으로 만든다.

---

# 4. 프로젝트 폴더 구조

아래 구조로 정확히 구성한다.

AI_Music_Sample_Lab/
│
├─ index.html
├─ sampler.html
├─ history.html
├─ about.html
├─ style.css
├─ sampler.js
├─ history.js
└─ README.txt

추가 파일이 꼭 필요하지 않다면 구조를 더 복잡하게 만들지 않는다.

---

# 5. 전체 디자인 방향

일반적인 밝은 웹사이트가 아니라 음악 장비 / 샘플러 / 디지털 스튜디오 같은 느낌으로 만든다.

디자인 키워드:
- Dark
- Minimal
- Music workstation
- Sampler
- Modern terminal
- Underground music
- Slightly retro digital
- High contrast

컬러:
- 배경: 거의 검정
- 패널: 짙은 회색
- 기본 텍스트: 밝은 회색 또는 아이보리
- 메인 포인트: 형광 라임
- 보조 포인트: 필요 시 오렌지 또는 청록
- 경계선: 어두운 회색

폰트:
- 외부 폰트 로딩 금지
- system monospace 또는 Courier New 사용

반응형:
- PC 기준으로 완성도 있게 만든다.
- 모바일에서도 레이아웃이 무너지지 않아야 한다.

---

# 6. 공통 헤더

모든 페이지 상단에 같은 헤더를 사용한다.

왼쪽:
SAMPLE//LAB

오른쪽 메뉴:
HOME
SAMPLER
HISTORY
ABOUT

현재 페이지 메뉴는 active 상태로 표시한다.

각 메뉴는 실제 HTML 페이지로 이동한다.

---

# 7. index.html

목적:
프로젝트 메인 소개.

첫 화면에는 다음이 크게 보여야 한다.

작은 라벨:
15 SECOND IDEA GENERATOR

메인 문구:
긴 곡을 만들기 전에
짧게 먼저 들어본다.

설명:
Suno에서 여러 번 생성하며 크레딧을 소모하기 전에,
로컬 샘플링 아이디어를 빠르게 비교해 원하는 방향을 좁히는 웹 프로토타입이라는 내용을 작성한다.

버튼:
- SAMPLE LAB 열기 → sampler.html
- 기획 의도 보기 → about.html

---

## index.html의 WORKFLOW 섹션

4단계 카드:

01 조건 선택
- 장르
- 세부 장르
- 샘플 유형
- 생성 개수

02 15초 아이디어 생성
- 완성곡보다 짧은 음악 아이디어를 먼저 확인

03 비교 & 선택
- 마음에 드는 샘플을 즐겨찾기
- 여러 후보 비교

04 본 제작으로 이동
- 선택한 음악 방향만 실제 Suno 제작에 활용

---

## WHY THIS PROJECT 섹션

다음 흐름을 설명한다.

Suno 사용
→ 반복 생성
→ 크레딧 소모
→ YuE2 발견
→ 로컬 15초 샘플 생성
→ 여러 아이디어 비교
→ 마음에 드는 방향만 Suno에서 발전

---

# 8. sampler.html

이 페이지가 프로젝트의 핵심이다.

화면 상단 제목:

15 SECOND
SAMPLE LAB

상태 표시:
SYSTEM READY

설명:
브라우저 Web Audio 기반 데모

---

## 컨트롤 영역

### GENRE

선택 항목:

UK GARAGE
R&B
HOUSE

### SUBGENRE

장르에 따라 JavaScript로 옵션이 바뀌어야 한다.

UK GARAGE:
- 2-STEP
- GARAGE HOUSE
- SPEED GARAGE

R&B:
- ALT R&B
- NEO SOUL
- INDIE R&B

HOUSE:
- DEEP HOUSE
- GARAGE HOUSE
- MINIMAL HOUSE

### SAMPLE TYPE

HOOK
INTRO
GROOVE

### COUNT

3
5
8

기본값:
5

### IDEA / PROMPT

사용자가 자유롭게 입력.

placeholder 예:

dry female vocal, late night, minimal bass

### GENERATE 버튼

클릭 시 JavaScript로 샘플 카드 생성.

---

# 9. 실제 AI 생성 대신 Web Audio 데모

이번 과제는 HTML/CSS/JavaScript만 허용한다.

따라서 실제 YuE2 모델을 실행하지 않는다.

대신 JavaScript의 Web Audio API를 사용해 짧은 데모 사운드를 생성한다.

중요:
- 각 샘플 길이는 15초
- 장르 선택에 따라 BPM이나 음색 패턴이 약간 달라져도 좋다.
- 실제 완성 음악 품질이 목적이 아니다.
- 사용자 인터랙션과 아이디어를 보여주는 것이 목적이다.

GENERATE를 누르면 선택한 COUNT만큼 샘플이 생성된다.

예:

SMP-001
SMP-002
SMP-003

각 카드에는:

- Sample ID
- Genre
- Subgenre
- Sample Type
- 15 SEC
- 입력 Prompt
- 간단한 waveform
- PLAY
- STOP
- WAV
- Favorite

를 표시한다.

---

# 10. Waveform

외부 waveform 라이브러리 사용 금지.

Canvas API를 이용해 JavaScript로 직접 waveform을 그린다.

사운드 데이터의 진폭을 기준으로 간단한 waveform을 표시한다.

---

# 11. PLAY / STOP

PLAY:
생성된 15초 사운드를 브라우저에서 재생.

STOP:
현재 재생 중인 사운드를 중지.

동시에 여러 샘플이 재생되지 않도록 한다.

---

# 12. WAV 다운로드

가능하면 JavaScript만으로 AudioBuffer를 WAV Blob으로 변환한다.

WAV 버튼을 클릭하면 해당 샘플을 .wav 파일로 다운로드할 수 있게 구현한다.

외부 라이브러리 사용 금지.

---

# 13. Favorite

각 샘플 카드에:

☆
또는
★

버튼을 둔다.

클릭하면 favorite 상태가 변경된다.

즐겨찾기 상태는 localStorage에 저장한다.

---

# 14. 생성 기록

샘플 생성 시 아래 메타데이터를 localStorage에 기록한다.

예시 구조:

{
  id: "...",
  genre: "...",
  subgenre: "...",
  type: "...",
  prompt: "...",
  favorite: false,
  createdAt: "..."
}

최근 60개 정도까지만 유지해도 된다.

---

# 15. history.html

목적:
생성했던 샘플 기록을 확인하는 페이지.

화면 제목:

SAMPLE HISTORY

설명:
생성한 샘플의 조건과 즐겨찾기를 브라우저에 기록합니다.

---

## 필터

ALL
FAVORITES
UK GARAGE
R&B
HOUSE

필터 선택 시 화면이 즉시 변경되어야 한다.

---

## History 카드

표시:

- Sample ID
- Genre
- Subgenre
- Sample Type
- Prompt
- 생성 날짜/시간
- Favorite 상태
- DELETE 버튼

기능:

- Favorite 변경
- 개별 기록 삭제
- 전체 기록 삭제

전체 삭제 전에는 confirm 창을 사용한다.

---

# 16. about.html

프로젝트 기획 의도를 설명하는 페이지.

다음 4단계로 구성한다.

01 아이디어 도출

Suno가 궁금해서 직접 사용해보았다.
원하는 결과를 찾기 위해 반복 생성할수록 크레딧이 계속 소모되는 점을 경험했다.

02 YuE2 발견

로컬 환경에서 음악을 생성할 수 있는 YuE2를 알게 되었다.
상용 서비스보다 품질은 떨어질 수 있지만 생성 크레딧 없이 여러 아이디어를 시험할 수 있다는 점에 주목했다.

03 15초 샘플 방식

완성곡을 계속 생성하기보다 15초 정도의 짧은 음악 아이디어를 여러 개 만들어 먼저 들어본다.

04 프로젝트 목표

샘플을 비교한 뒤 마음에 드는 방향만 Suno에서 발전시켜 불필요한 크레딧 소비를 줄이는 것이 목표다.

---

# 17. about.html 하단

과제 사용 기술 표시:

HTML
페이지 구조

CSS
반응형 UI / 디자인

JavaScript
샘플 생성 / 재생 / 저장 / 필터

NO FRAMEWORK
외부 프레임워크 미사용

---

# 18. JavaScript 구현 원칙

코드는 초보자가 읽어볼 수 있도록 지나치게 복잡하게 만들지 않는다.

하지만 기능별로 함수는 적절하게 분리한다.

예:

fillSubgenres()
generateSamples()
createSampleCard()
drawWaveform()
playSample()
stopAll()
saveHistory()
renderHistory()

전역 변수는 최소화한다.

주석은 필요한 부분에만 작성한다.

---

# 19. sampler.js 핵심 동작

다음 순서로 작동한다.

사용자 조건 선택
↓
GENERATE
↓
진행상태 GENERATING 표시
↓
3/5/8개의 15초 AudioBuffer 생성
↓
Sample Card 생성
↓
Canvas Waveform 생성
↓
localStorage에 metadata 저장
↓
SAMPLES READY 표시

실제 생성 중 너무 긴 인위적 대기시간을 만들지 않는다.

---

# 20. 진행 표시

GENERATE를 누르면:

READY

에서

GENERATING...

으로 바뀐다.

진행 bar도 생성 개수에 따라 증가한다.

완료 후:

5 SAMPLES READY

처럼 표시한다.

---

# 21. README.txt

README에는 아래 내용을 적는다.

- 프로젝트 목적
- 과제 조건
- 페이지 설명
- 실행 방법
- index.html을 브라우저에서 열면 된다는 설명
- 실제 YuE2 모델이 아닌 웹 프로토타입이라는 설명
- HTML/CSS/JavaScript만 사용했다는 설명

---

# 22. 금지 사항

다음은 절대 사용하지 않는다.

React
Vue
Angular
Next.js
Nuxt
Bootstrap
Tailwind
jQuery
Node 서버
Express
Python Flask
FastAPI
npm package
외부 UI 라이브러리
외부 waveform 라이브러리
외부 audio 라이브러리

---

# 23. 제출 전 자체 검증

완성 후 반드시 직접 파일을 점검한다.

체크리스트:

[ ] index.html 열림
[ ] HOME 메뉴 작동
[ ] SAMPLER 메뉴 작동
[ ] HISTORY 메뉴 작동
[ ] ABOUT 메뉴 작동
[ ] Genre 변경 시 Subgenre 변경
[ ] GENERATE 버튼 작동
[ ] 3/5/8개 선택 수만큼 카드 생성
[ ] PLAY 작동
[ ] STOP 작동
[ ] Waveform 표시
[ ] Favorite 작동
[ ] localStorage 저장
[ ] HISTORY 페이지 기록 표시
[ ] History 필터 작동
[ ] 개별 삭제 작동
[ ] 전체 삭제 작동
[ ] WAV 다운로드 가능
[ ] 모바일 화면에서 레이아웃 무너지지 않음
[ ] 외부 프레임워크 없음
[ ] 브라우저 Console에 치명적 오류 없음

오류가 있으면 수정한 뒤 다시 체크한다.

---

# 24. 완료 기준

모든 작업이 끝나면 사용자에게 다음만 간단히 보고한다.

1. 생성한 폴더 경로
2. 생성한 파일 목록
3. 실행 방법
4. 구현된 핵심 기능
5. 실제 YuE2가 아니라 과제용 Web Audio 프로토타입이라는 점

중간에 계속 질문하거나 작업을 멈추지 말고, 가능한 범위에서 완성된 프로젝트까지 만든다.
