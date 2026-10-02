const HISTORY_KEY = "sampleLabHistory";
const SAMPLE_RATE = 22050;
const SAMPLE_DURATION = 15;

const genreSelect = document.querySelector("#genre");
const subgenreSelect = document.querySelector("#subgenre");
const sampleTypeSelect = document.querySelector("#sampleType");
const countSelect = document.querySelector("#count");
const promptInput = document.querySelector("#prompt");
const generateBtn = document.querySelector("#generateBtn");
const clearBtn = document.querySelector("#clearBtn");
const sampleGrid = document.querySelector("#sampleGrid");
const statusText = document.querySelector("#generationStatus span");
const progressBar = document.querySelector("#progressBar");
const progressTrack = document.querySelector(".progress-track");

const subgenres = {
  ukg: ["2-STEP", "GARAGE HOUSE", "SPEED GARAGE"],
  rnb: ["ALT R&B", "NEO SOUL", "INDIE R&B"],
  house: ["DEEP HOUSE", "GARAGE HOUSE", "MINIMAL HOUSE"]
};

let audioContext = null;
let activeSource = null;

function fillSubgenres() {
  subgenreSelect.replaceChildren();
  (subgenres[genreSelect.value] || []).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    subgenreSelect.appendChild(option);
  });
}

genreSelect.addEventListener("change", fillSubgenres);
fillSubgenres();

function seededRandom(seed) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function buildAudioBuffer(genre, type, seed) {
  const buffer = new AudioBuffer({
    length: SAMPLE_RATE * SAMPLE_DURATION,
    sampleRate: SAMPLE_RATE,
    numberOfChannels: 1
  });
  const data = buffer.getChannelData(0);
  const bpm = genre === "ukg" ? 136 : genre === "house" ? 124 : 72;
  const beat = 60 / bpm;
  const baseFreq = genre === "rnb" ? 82.41 : genre === "house" ? 110 : 98;

  for (let i = 0; i < data.length; i++) {
    const time = i / SAMPLE_RATE;
    const beatPosition = time % beat;
    const kickEnvelope = Math.exp(-beatPosition * 30);
    const kick = Math.sin(Math.PI * 2 * (55 - 25 * beatPosition) * time) * kickEnvelope * 0.28;
    const offBeat = (time + beat / 2) % beat;
    const clapEnvelope = Math.exp(-offBeat * 55);
    const noise = (seededRandom(i + seed * 999) * 2 - 1) * clapEnvelope * 0.07;
    const movement = 1 + 0.5 * Math.sin((Math.PI * 2 * time) / (beat * 4));
    const bass = Math.sin(Math.PI * 2 * baseFreq * movement * time) * 0.12;
    const swing = Math.sin(Math.PI * 2 * (genre === "ukg" ? 3.4 : 2.2) * time + seed) * 0.04;
    let value;

    if (genre === "rnb") {
      value = bass * 0.55 + kick * 0.35 + noise * 0.25 + swing;
    } else if (genre === "house") {
      value = bass + kick + noise * 0.45 + swing * 0.4;
    } else {
      const gate = (Math.floor(time / (beat / 2)) + seed) % 4 === 1 ? 1 : 0.55;
      value = bass * gate + kick * 0.8 + noise + swing;
    }

    if (type === "intro") {
      value *= Math.min(1, time / 5);
    } else if (type === "hook") {
      value += Math.sin(Math.PI * 2 * (220 + seed * 7) * time) * 0.025;
    }

    data[i] = Math.max(-0.85, Math.min(0.85, value));
  }

  return buffer;
}

function drawWaveform(canvas, buffer) {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("이 브라우저에서 Canvas를 사용할 수 없습니다.");
  }

  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.strokeStyle = "#d8ff3e";
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

function audioBufferToWav(buffer) {
  const samples = buffer.getChannelData(0);
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
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
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += bytesPerSample;
  }
  return new Blob([wav], { type: "audio/wav" });
}

function readHistory() {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];
  const history = JSON.parse(stored);
  if (!Array.isArray(history)) {
    throw new Error("저장된 샘플 기록 형식이 올바르지 않습니다.");
  }
  return history;
}

function saveHistory(item) {
  const history = readHistory();
  const existingIndex = history.findIndex((entry) => entry.id === item.id);
  if (existingIndex >= 0) {
    history[existingIndex] = item;
  } else {
    history.unshift(item);
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 60)));
}

function setStatus(message, progress) {
  statusText.textContent = message;
  progressBar.style.width = `${progress}%`;
  progressTrack.setAttribute("aria-valuenow", String(progress));
}

function stopPlayback() {
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

async function playSample(buffer) {
  stopPlayback();
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    throw new Error("이 브라우저는 Web Audio를 지원하지 않습니다.");
  }

  audioContext = audioContext || new AudioContextConstructor();
  await audioContext.resume();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.onended = () => {
    if (activeSource === source) activeSource = null;
    source.disconnect();
  };
  activeSource = source;
  source.start();
}

function createSampleCard(item, buffer) {
  const card = document.createElement("article");
  card.className = `sample-card${item.favorite ? " favorite" : ""}`;
  card.dataset.id = item.id;

  const head = document.createElement("div");
  head.className = "sample-head";
  const heading = document.createElement("div");
  const id = document.createElement("div");
  id.className = "sample-id";
  id.textContent = item.id;
  const meta = document.createElement("div");
  meta.className = "sample-meta";
  meta.textContent = `${item.genreName} / ${item.subgenre} / ${item.type.toUpperCase()} / 15 SEC`;
  heading.append(id, meta);

  const favoriteButton = document.createElement("button");
  favoriteButton.className = `small-btn favorite-btn${item.favorite ? " active" : ""}`;
  favoriteButton.type = "button";
  favoriteButton.textContent = item.favorite ? "★" : "☆";
  favoriteButton.setAttribute("aria-label", item.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가");
  favoriteButton.setAttribute("aria-pressed", String(item.favorite));
  head.append(heading, favoriteButton);

  const canvas = document.createElement("canvas");
  canvas.className = "waveform";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", `${item.id} waveform`);
  const prompt = document.createElement("div");
  prompt.className = "sample-meta prompt-value";
  prompt.textContent = item.prompt || "NO EXTRA PROMPT";
  const actions = document.createElement("div");
  actions.className = "sample-actions";

  const playButton = document.createElement("button");
  playButton.className = "small-btn play-btn";
  playButton.type = "button";
  playButton.textContent = "▶ PLAY";
  const stopButton = document.createElement("button");
  stopButton.className = "small-btn stop-btn";
  stopButton.type = "button";
  stopButton.textContent = "■ STOP";
  const downloadButton = document.createElement("button");
  downloadButton.className = "small-btn download-btn";
  downloadButton.type = "button";
  downloadButton.textContent = "↓ WAV";
  actions.append(playButton, stopButton, downloadButton);
  card.append(head, canvas, prompt, actions);

  requestAnimationFrame(() => {
    try {
      drawWaveform(canvas, buffer);
    } catch (error) {
      canvas.replaceWith(document.createTextNode(error.message));
    }
  });

  playButton.addEventListener("click", async () => {
    try {
      await playSample(buffer);
    } catch (error) {
      setStatus(`PLAYBACK ERROR: ${error.message}`, 100);
    }
  });
  stopButton.addEventListener("click", stopPlayback);
  downloadButton.addEventListener("click", () => {
    const url = URL.createObjectURL(audioBufferToWav(buffer));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.id}.wav`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  favoriteButton.addEventListener("click", () => {
    item.favorite = !item.favorite;
    try {
      saveHistory(item);
      favoriteButton.classList.toggle("active", item.favorite);
      favoriteButton.textContent = item.favorite ? "★" : "☆";
      favoriteButton.setAttribute("aria-label", item.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가");
      favoriteButton.setAttribute("aria-pressed", String(item.favorite));
      card.classList.toggle("favorite", item.favorite);
    } catch (error) {
      item.favorite = !item.favorite;
      setStatus(`SAVE ERROR: ${error.message}`, 100);
    }
  });

  return card;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function generateSamples() {
  stopPlayback();
  generateBtn.disabled = true;
  clearBtn.disabled = true;
  sampleGrid.replaceChildren();
  setStatus("GENERATING...", 0);

  const count = Number(countSelect.value);
  const genre = genreSelect.value;
  const genreName = genreSelect.options[genreSelect.selectedIndex].textContent;
  const subgenre = subgenreSelect.value;
  const type = sampleTypeSelect.value;
  const prompt = promptInput.value.trim();
  const batchId = `${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

  try {
    for (let i = 0; i < count; i++) {
      const seed = Date.now() + i * 31 + Math.random() * 1000;
      const buffer = buildAudioBuffer(genre, type, seed);
      const item = {
        id: `SMP-${batchId}-${String(i + 1).padStart(2, "0")}`,
        genre,
        genreName,
        subgenre,
        type,
        prompt,
        favorite: false,
        createdAt: new Date().toISOString()
      };
      saveHistory(item);
      sampleGrid.appendChild(createSampleCard(item, buffer));
      setStatus("GENERATING...", Math.round(((i + 1) / count) * 100));
      await nextFrame();
    }
    setStatus(`${count} SAMPLES READY`, 100);
  } catch (error) {
    setStatus(`ERROR: ${error.message}`, 100);
  } finally {
    generateBtn.disabled = false;
    clearBtn.disabled = false;
  }
}

generateBtn.addEventListener("click", generateSamples);
clearBtn.addEventListener("click", () => {
  stopPlayback();
  sampleGrid.innerHTML = '<div class="empty-state">조건을 선택하고 GENERATE를 눌러주세요.</div>';
  setStatus("READY", 0);
});

window.addEventListener("pagehide", () => {
  stopPlayback();
  if (audioContext && audioContext.state !== "closed") {
    audioContext.close();
  }
});
