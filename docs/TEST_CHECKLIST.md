# TEST CHECKLIST

수동 테스트용. Chrome / Edge에서 `index.html`을 연 뒤 개발자도구 Console을 열어두고 진행한다.
**이 체크리스트는 사람이 브라우저 화면에서 직접 수행한 적이 없다.** headless Edge 자동 스모크 테스트만 있었다. (아래 "검증 이력" 참고)

## 공통
- [ ] index.html이 열리고 CSS가 적용된다 (Network/Console에 404 없음)
- [ ] HOME / SAMPLER / HISTORY / ABOUT 메뉴가 4개 페이지 모두에서 이동된다
- [ ] 현재 페이지 메뉴가 active로 표시된다
- [ ] Console에 오류가 없다

## SAMPLER
- [ ] GENRE / SAMPLE TYPE / COUNT select에 옵션이 채워진다 (COUNT 기본값 5)
- [ ] GENRE를 바꾸면 SUBGENRE 옵션이 바뀐다
- [ ] GENERATE → `GENERATING...` → `N SAMPLES READY`, 진행바가 100%까지 간다
- [ ] COUNT 3 / 5 / 8 각각 그 수만큼 카드가 생긴다
- [ ] 카드에 ID, 장르/세부장르/유형/15 SEC, prompt, waveform이 보인다
- [ ] PLAY로 소리가 나고, 다른 카드 PLAY 시 이전 소리가 멈춘다
- [ ] STOP이 소리를 멈춘다
- [ ] PLAY를 빠르게 여러 번 눌러도 소리가 겹치지 않는다 (특히 페이지를 연 직후 첫 재생)
- [ ] PLAY 중 다른 페이지로 이동해도 소리가 이어지지 않고, 뒤로 가기로 돌아와도 다시 재생된다
- [ ] WAV 버튼으로 `.wav`가 다운로드되고 재생된다 (약 15초, 모노)
- [ ] ★ 클릭 시 상태가 바뀌고 새로고침 후 History에 반영된다
- [ ] CLEAR가 화면의 카드만 지우고 History 기록은 유지한다
- [ ] 브라우저 창 크기를 바꾸면 waveform이 다시 그려진다
- [ ] History에서 favorite를 바꾼 뒤 Sampler 탭으로 돌아오면 카드의 ★가 갱신된다

## HISTORY
- [ ] 생성한 샘플이 최신순으로 보인다 (최대 60개)
- [ ] 필터 ALL / FAVORITES / UK GARAGE / R&B / HOUSE가 즉시 바뀐다
- [ ] ★ 토글이 저장된다
- [ ] DELETE가 해당 기록만 지운다
- [ ] CLEAR HISTORY가 confirm 후 전체 삭제한다 (취소하면 유지)
- [ ] 기록이 없을 때 빈 상태 문구가 보인다

## 모바일 (DevTools 기기 모드, 375px / 768px)
- [ ] header 메뉴가 줄바꿈되고 가로 스크롤이 없다
- [ ] SAMPLER 컨트롤이 1~2열로 접힌다
- [ ] 카드 grid가 1열이 된다
- [ ] HISTORY toolbar가 세로로 쌓인다

## 오류 상황
- [ ] DevTools에서 `sampleLabHistory`를 `{}`로 바꾸면 History가 오류 문구를 보여주고 앱이 멈추지 않는다

## 검증 이력

| 날짜 | 범위 | 결과 |
|---|---|---|
| 2026-10-02 | 구조 리팩터링 직후 정적 검증 (경로, script 순서, id/함수 참조, 중복 코드, 잔여 참조) | 이상 없음 |
| 2026-10-02 | headless Edge 스모크 테스트(임시 복사본에 테스트 스크립트 주입, 프로젝트 파일 무수정). 확인: select 옵션 생성, Subgenre 연동, GENERATE 3개, waveform 픽셀 존재, localStorage 저장, Favorite, History→Sampler 동기화 동작, WAV 크기(661,544B), STOP/CLEAR, History 필터 5종·Favorite·개별/전체 삭제·confirm 취소, 손상 데이터 오류 표시 | 통과 |
| 2026-10-02 | QA 재검증(headless Edge): 링크/경로/id 정적 점검, 외부 의존성 없음, GENERATE 연타(3회 클릭 → 카드 3개, 버튼 비활성), 손상 JSON(History 오류 표시·Sampler ERROR 표시 후 페이지 정상·CLEAR로 복구), PLAY 연타 시 소스 1개(수정 후), PLAY 대기 중 STOP 시 재생 없음, dispose 후 재생 가능, History 장르명 config 우선 | 통과 (PLAY 연타 경쟁 상태는 수정 전 재현 → 수정 후 해소) |
| 2026-10-02 | headless 한계: 오디오 장치가 없어 `ended` 이벤트가 오지 않으므로 "STOP이 실제 소리를 끊는지"는 관찰 불가 | 수동 확인 필요 |
| 2026-10-02 | **미확인**: 실제 소리 출력(PLAY 청취), WAV 파일 재생, 눈으로 본 레이아웃·모바일 화면, 실제 창 resize 시 waveform 재렌더, 실제 다운로드 동작, Chrome 동작 | 수동 확인 필요 |
