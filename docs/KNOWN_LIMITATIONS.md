# KNOWN LIMITATIONS

## 제품 성격

1. **실제 AI 생성이 아니다.** 샘플은 Web Audio로 만든 동기식 합성 데모(킥/노이즈/베이스 + 장르별 BPM)이고 YuE2와 연결되어 있지 않다. 생성은 메인 스레드에서 샘플마다 즉시 계산되므로, 샘플 길이/개수를 늘리면 UI가 잠깐 멈출 수 있다.
2. **오디오는 저장되지 않는다.** localStorage에는 메타데이터만 저장한다. 새로고침하면 Sampler 카드와 오디오는 사라지고, History에서는 다시 재생·WAV 저장을 할 수 없다.
3. 같은 이유로 Sampler의 CLEAR는 화면만 비우며 History 기록은 남는다.

## 이번 리팩터링에서 처리한 항목

| 항목 | 상태 |
|---|---|
| resize 후 waveform 재렌더 | 수정함 — `sampler-page.js`가 resize(150ms debounce) 시 다시 그린다 |
| History에서 바꾼 favorite가 Sampler에 반영 안 됨 | 수정함 — `focus`/`pageshow`/`visibilitychange`/`storage` 때 `syncFavorites()` |

favorite 동기화는 headless Edge에서 `focus` 이벤트로 확인했다. resize 재렌더는 코드 검토만 했고 실제 창 크기 변경으로는 확인하지 않았다. (TEST_CHECKLIST.md 참고)

## 남아 있는 제한

- 같은 탭에서 Sampler와 History를 동시에 볼 수 없으므로 favorite 동기화는 "돌아왔을 때 갱신" 방식이다. 실시간 동기화는 아니다.
- Sampler가 열려 있는 상태에서 History 페이지가 기록을 삭제하면, 이미 화면에 있는 카드는 유지된다. 그 카드의 ★를 누르면 기록이 다시 추가된다.
- 장르별 소리 분기(`rnb`, `house`, 그 외 UKG 방식)는 `audio-engine.js`에 있다. config에 장르를 추가해도 소리는 UKG 방식으로 나온다. 새 소리가 필요하면 engine을 수정해야 한다.
- localStorage는 브라우저/프로필별이며, 용량 초과·저장 차단 시 오류 문구만 표시하고 복구하지 않는다.
- 저장 데이터가 깨진 경우(배열이 아님, JSON 오류) History는 오류 문구를 보여준다. 자동 복구 기능은 없다.
- 지원 브라우저는 최신 Chrome / Edge로 한정한다. (`new AudioBuffer()` 생성자 사용)
- 자동 테스트가 없다. 확인은 TEST_CHECKLIST.md 수동 절차에 의존한다.
