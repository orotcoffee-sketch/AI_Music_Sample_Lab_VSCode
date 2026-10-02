/*
 * utils.js — 순수 공통 함수. DOM / localStorage / Web Audio 사용 금지.
 * 노출 이름: window.SampleLab.Utils
 */
(function (global) {
  "use strict";

  const SampleLab = (global.SampleLab = global.SampleLab || {});

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // 같은 seed면 같은 값을 돌려주는 간단한 의사 난수 (0 이상 1 미만)
  function seededRandom(seed) {
    const value = Math.sin(seed) * 10000;
    return value - Math.floor(value);
  }

  // 한 번의 GENERATE 묶음을 구분하는 ID
  function createBatchId() {
    const time = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return time + random;
  }

  function createSampleId(batchId, index) {
    return `SMP-${batchId}-${String(index + 1).padStart(2, "0")}`;
  }

  function formatDateTime(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "날짜 정보 없음";
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  SampleLab.Utils = {
    clamp,
    seededRandom,
    createBatchId,
    createSampleId,
    formatDateTime
  };
})(window);
