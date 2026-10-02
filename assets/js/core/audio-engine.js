/*
 * audio-engine.js — 15초 데모 사운드 생성 / 재생 / 정지 / waveform / WAV 변환.
 * 페이지 DOM을 조회하지 않는다. (drawWaveform은 호출자가 넘긴 canvas에만 그린다.)
 * 실제 YuE2 모델이 아니라 Web Audio용 합성 데모다.
 * 노출 이름: window.SampleLab.AudioEngine
 * 의존: Config, Utils
 */
(function (global) {
  "use strict";

  const SampleLab = (global.SampleLab = global.SampleLab || {});
  const Config = SampleLab.Config;
  const Utils = SampleLab.Utils;

  const WAVEFORM_FALLBACK_COLOR = "#d8ff3e";

  let audioContext = null;
  let activeSource = null;
  let playRequestId = 0; // resume() 대기 중인 이전 PLAY 요청을 무효화하는 번호

  /* ---------- 생성 ---------- */

  function createSampleBuffer(genreId, typeId, seed) {
    const genre = Config.GENRES.find((entry) => entry.id === genreId);
    if (!genre) {
      throw new Error(`알 수 없는 장르입니다: ${genreId}`);
    }

    const sampleRate = Config.SAMPLE_RATE;
    const buffer = new AudioBuffer({
      length: sampleRate * Config.SAMPLE_DURATION,
      sampleRate,
      numberOfChannels: 1
    });
    const data = buffer.getChannelData(0);
    const beat = 60 / genre.bpm;
    const baseFreq = genre.baseFreq;

    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const beatPosition = time % beat;
      const kickEnvelope = Math.exp(-beatPosition * 30);
      const kick = Math.sin(Math.PI * 2 * (55 - 25 * beatPosition) * time) * kickEnvelope * 0.28;
      const offBeat = (time + beat / 2) % beat;
      const clapEnvelope = Math.exp(-offBeat * 55);
      const noise = (Utils.seededRandom(i + seed * 999) * 2 - 1) * clapEnvelope * 0.07;
      const movement = 1 + 0.5 * Math.sin((Math.PI * 2 * time) / (beat * 4));
      const bass = Math.sin(Math.PI * 2 * baseFreq * movement * time) * 0.12;
      const swing = Math.sin(Math.PI * 2 * genre.swingHz * time + seed) * 0.04;
      let value;

      if (genre.id === "rnb") {
        value = bass * 0.55 + kick * 0.35 + noise * 0.25 + swing;
      } else if (genre.id === "house") {
        value = bass + kick + noise * 0.45 + swing * 0.4;
      } else {
        const gate = (Math.floor(time / (beat / 2)) + seed) % 4 === 1 ? 1 : 0.55;
        value = bass * gate + kick * 0.8 + noise + swing;
      }

      if (typeId === "intro") {
        value *= Math.min(1, time / 5);
      } else if (typeId === "hook") {
        value += Math.sin(Math.PI * 2 * (220 + seed * 7) * time) * 0.025;
      }

      data[i] = Utils.clamp(value, -0.85, 0.85);
    }

    return buffer;
  }

  /* ---------- 재생 ---------- */

  function stop() {
    playRequestId++;
    if (!activeSource) return;
    activeSource.onended = null;
    try {
      activeSource.stop();
    } catch (error) {
      if (error.name !== "InvalidStateError") throw error;
    }
    activeSource.disconnect();
    activeSource = null;
  }

  // 항상 하나만 재생한다. 새로 재생하면 이전 소리는 멈춘다.
  async function play(buffer) {
    stop();
    const requestId = playRequestId;
    const AudioContextConstructor = global.AudioContext || global.webkitAudioContext;
    if (!AudioContextConstructor) {
      throw new Error("이 브라우저는 Web Audio를 지원하지 않습니다.");
    }

    const context = audioContext || new AudioContextConstructor();
    audioContext = context;
    await context.resume();
    // resume()을 기다리는 동안 STOP / 다른 PLAY / 페이지 이탈이 있었다면 재생하지 않는다.
    if (requestId !== playRequestId || context !== audioContext) return;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.onended = () => {
      if (activeSource === source) activeSource = null;
      source.disconnect();
    };
    activeSource = source;
    source.start();
  }

  // 페이지를 떠날 때 호출
  function dispose() {
    stop();
    if (audioContext && audioContext.state !== "closed") {
      audioContext.close();
    }
    audioContext = null;
  }

  /* ---------- waveform ---------- */

  // 색상은 canvas에 적용된 CSS 변수 --lime을 따른다. (tokens.css)
  function drawWaveform(canvas, buffer) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("이 브라우저에서 Canvas를 사용할 수 없습니다.");
    }

    const ratio = global.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.strokeStyle =
      global.getComputedStyle(canvas).getPropertyValue("--lime").trim() || WAVEFORM_FALLBACK_COLOR;
    context.lineWidth = ratio;
    context.beginPath();

    const data = buffer.getChannelData(0);
    const step = Math.max(1, Math.ceil(data.length / width));
    const amplitude = height / 2;

    for (let x = 0; x < width; x++) {
      let min = 1;
      let max = -1;
      for (let j = 0; j < step; j++) {
        const value = data[x * step + j] || 0;
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
      context.moveTo(x, (1 + min) * amplitude);
      context.lineTo(x, (1 + max) * amplitude);
    }
    context.stroke();
  }

  /* ---------- WAV ---------- */

  function toWavBlob(buffer) {
    const samples = buffer.getChannelData(0);
    const bytesPerSample = 2;
    const blockAlign = bytesPerSample; // mono
    const wav = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(wav);
    const writeString = (offset, value) => {
      for (let i = 0; i < value.length; i++) {
        view.setUint8(offset + i, value.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, samples.length * bytesPerSample, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const sample = Utils.clamp(samples[i], -1, 1);
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
    return new Blob([wav], { type: "audio/wav" });
  }

  SampleLab.AudioEngine = {
    createSampleBuffer,
    play,
    stop,
    dispose,
    drawWaveform,
    toWavBlob
  };
})(window);
