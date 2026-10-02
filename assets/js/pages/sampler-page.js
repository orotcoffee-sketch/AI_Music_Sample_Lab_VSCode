/*
 * sampler-page.js — pages/sampler.html 전용 컨트롤러.
 * select 초기화, GENERATE 이벤트, 샘플 카드 렌더링, core 모듈 연결만 담당한다.
 * 의존: Config, Utils, Storage, AudioEngine (core → page 방향 의존 금지)
 */
(function (global) {
  "use strict";

  const { Config, Utils, Storage, AudioEngine } = global.SampleLab;

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

  // 화면에 떠 있는 카드: id -> { item, buffer, card, canvas, favoriteButton }
  const cards = new Map();

  /* ---------- select 초기화 ---------- */

  function fillSelect(select, options, selectedValue) {
    select.replaceChildren();
    options.forEach(({ value, label }) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = label;
      option.selected = String(value) === String(selectedValue);
      select.appendChild(option);
    });
  }

  function fillSubgenres() {
    const genre = Config.GENRES.find((entry) => entry.id === genreSelect.value);
    const names = genre ? genre.subgenres : [];
    fillSelect(subgenreSelect, names.map((name) => ({ value: name, label: name })));
  }

  function initControls() {
    fillSelect(genreSelect, Config.GENRES.map((g) => ({ value: g.id, label: g.name })));
    fillSelect(sampleTypeSelect, Config.SAMPLE_TYPES.map((t) => ({ value: t.id, label: t.name })));
    fillSelect(
      countSelect,
      Config.COUNTS.map((n) => ({ value: n, label: String(n) })),
      Config.DEFAULT_COUNT
    );
    fillSubgenres();
    genreSelect.addEventListener("change", fillSubgenres);
  }

  /* ---------- 상태 표시 ---------- */

  function setStatus(message, progress) {
    statusText.textContent = message;
    progressBar.style.width = `${progress}%`;
    progressTrack.setAttribute("aria-valuenow", String(progress));
  }

  function showEmptyState() {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "조건을 선택하고 GENERATE를 눌러주세요.";
    sampleGrid.replaceChildren(emptyState);
  }

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

  /* ---------- 카드 ---------- */

  function renderFavorite(entry) {
    const { item, card, favoriteButton } = entry;
    card.classList.toggle("favorite", item.favorite);
    favoriteButton.classList.toggle("active", item.favorite);
    favoriteButton.textContent = item.favorite ? "★" : "☆";
    favoriteButton.setAttribute("aria-label", item.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가");
    favoriteButton.setAttribute("aria-pressed", String(item.favorite));
  }

  function drawEntryWaveform(entry) {
    if (!entry.canvas.isConnected) return;
    try {
      AudioEngine.drawWaveform(entry.canvas, entry.buffer);
    } catch (error) {
      entry.canvas.replaceWith(document.createTextNode(error.message));
    }
  }

  function downloadWav(item, buffer) {
    const url = URL.createObjectURL(AudioEngine.toWavBlob(buffer));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.id}.wav`;
    link.click();
    global.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function createActionButton(className, label) {
    const button = document.createElement("button");
    button.className = `small-btn ${className}`;
    button.type = "button";
    button.textContent = label;
    return button;
  }

  function createSampleCard(item, buffer) {
    const card = document.createElement("article");
    card.className = "sample-card";
    card.dataset.id = item.id;

    const head = document.createElement("div");
    head.className = "sample-head";
    const heading = document.createElement("div");
    const id = document.createElement("div");
    id.className = "sample-id";
    id.textContent = item.id;
    const meta = document.createElement("div");
    meta.className = "sample-meta";
    meta.textContent = `${item.genreName} / ${item.subgenre} / ${item.type.toUpperCase()} / ${Config.SAMPLE_DURATION} SEC`;
    heading.append(id, meta);

    const favoriteButton = createActionButton("favorite-btn", "☆");
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
    const playButton = createActionButton("play-btn", "▶ PLAY");
    const stopButton = createActionButton("stop-btn", "■ STOP");
    const downloadButton = createActionButton("download-btn", "↓ WAV");
    actions.append(playButton, stopButton, downloadButton);
    card.append(head, canvas, prompt, actions);

    const entry = { item, buffer, card, canvas, favoriteButton };
    cards.set(item.id, entry);
    renderFavorite(entry);
    requestAnimationFrame(() => drawEntryWaveform(entry));

    playButton.addEventListener("click", async () => {
      try {
        await AudioEngine.play(buffer);
      } catch (error) {
        setStatus(`PLAYBACK ERROR: ${error.message}`, 100);
      }
    });
    stopButton.addEventListener("click", AudioEngine.stop);
    downloadButton.addEventListener("click", () => downloadWav(item, buffer));
    favoriteButton.addEventListener("click", () => toggleFavorite(entry));

    return card;
  }

  function toggleFavorite(entry) {
    const next = !entry.item.favorite;
    try {
      // History에서 지워졌거나 최대 개수 밖으로 밀린 샘플이면 다시 기록한다.
      if (!Storage.setFavorite(entry.item.id, next)) {
        Storage.upsert({ ...entry.item, favorite: next });
      }
      entry.item.favorite = next;
      renderFavorite(entry);
    } catch (error) {
      setStatus(`SAVE ERROR: ${error.message}`, 100);
    }
  }

  /* ---------- GENERATE ---------- */

  async function generateSamples() {
    AudioEngine.stop();
    generateBtn.disabled = true;
    clearBtn.disabled = true;
    sampleGrid.replaceChildren();
    cards.clear();
    setStatus("GENERATING...", 0);

    const count = Number(countSelect.value);
    const genre = genreSelect.value;
    const genreName = genreSelect.options[genreSelect.selectedIndex].textContent;
    const subgenre = subgenreSelect.value;
    const type = sampleTypeSelect.value;
    const prompt = promptInput.value.trim();
    const batchId = Utils.createBatchId();

    try {
      for (let i = 0; i < count; i++) {
        const seed = Date.now() + i * 31 + Math.random() * 1000;
        const buffer = AudioEngine.createSampleBuffer(genre, type, seed);
        const item = {
          id: Utils.createSampleId(batchId, i),
          genre,
          genreName,
          subgenre,
          type,
          prompt,
          favorite: false,
          createdAt: new Date().toISOString()
        };
        Storage.upsert(item);
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

  /* ---------- History와 favorite 동기화 / resize ---------- */

  // History 페이지에서 바뀐 favorite를 화면의 카드에 반영한다.
  function syncFavorites() {
    if (!cards.size) return;
    try {
      const stored = new Map(Storage.readAll().map((entry) => [entry.id, entry]));
      cards.forEach((entry) => {
        const record = stored.get(entry.item.id);
        if (record && Boolean(record.favorite) !== entry.item.favorite) {
          entry.item.favorite = Boolean(record.favorite);
          renderFavorite(entry);
        }
      });
    } catch (error) {
      console.warn("favorite 동기화 실패:", error.message);
    }
  }

  let resizeTimer = null;
  function redrawWaveforms() {
    cards.forEach(drawEntryWaveform);
  }

  /* ---------- 시작 ---------- */

  initControls();
  generateBtn.addEventListener("click", generateSamples);
  clearBtn.addEventListener("click", () => {
    AudioEngine.stop();
    cards.clear();
    showEmptyState();
    setStatus("READY", 0);
  });

  global.addEventListener("resize", () => {
    global.clearTimeout(resizeTimer);
    resizeTimer = global.setTimeout(redrawWaveforms, 150);
  });
  global.addEventListener("focus", syncFavorites);
  global.addEventListener("pageshow", syncFavorites);
  global.addEventListener("storage", syncFavorites);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncFavorites();
  });
  global.addEventListener("pagehide", AudioEngine.dispose);
})(window);
