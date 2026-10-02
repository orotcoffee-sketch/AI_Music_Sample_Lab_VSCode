/*
 * config.js — 변경 가능한 설정값만 모은다. (로직 금지)
 * 장르/BPM/세부장르/샘플 유형/생성 개수/저장 키/History 최대 개수.
 * 노출 이름: window.SampleLab.Config
 */
(function (global) {
  "use strict";

  const SampleLab = (global.SampleLab = global.SampleLab || {});

  SampleLab.Config = {
    // localStorage
    STORAGE_KEY: "sampleLabHistory",
    MAX_HISTORY: 60,

    // 오디오 (샘플 하나의 길이/품질)
    SAMPLE_DURATION: 15, // seconds
    SAMPLE_RATE: 22050,

    // 장르 추가/수정은 이 배열만 고치면 된다.
    // id: 저장 데이터와 필터에 쓰는 값 (한 번 정하면 바꾸지 않는 것을 권장)
    // bpm / baseFreq / swingHz: audio-engine.js가 소리를 만들 때 사용
    GENRES: [
      {
        id: "ukg",
        name: "UK GARAGE",
        bpm: 136,
        baseFreq: 98,
        swingHz: 3.4,
        subgenres: ["2-STEP", "GARAGE HOUSE", "SPEED GARAGE"]
      },
      {
        id: "rnb",
        name: "R&B",
        bpm: 72,
        baseFreq: 82.41,
        swingHz: 2.2,
        subgenres: ["ALT R&B", "NEO SOUL", "INDIE R&B"]
      },
      {
        id: "house",
        name: "HOUSE",
        bpm: 124,
        baseFreq: 110,
        swingHz: 2.2,
        subgenres: ["DEEP HOUSE", "GARAGE HOUSE", "MINIMAL HOUSE"]
      }
    ],

    SAMPLE_TYPES: [
      { id: "hook", name: "HOOK" },
      { id: "intro", name: "INTRO" },
      { id: "groove", name: "GROOVE" }
    ],

    COUNTS: [3, 5, 8],
    DEFAULT_COUNT: 5
  };
})(window);
