const HISTORY_KEY = "sampleLabHistory";
const genreNames = {
  ukg: "UK GARAGE",
  rnb: "R&B",
  house: "HOUSE"
};

const grid = document.querySelector("#historyGrid");
const countText = document.querySelector("#historyCount");
const filter = document.querySelector("#historyFilter");
const clearBtn = document.querySelector("#clearHistoryBtn");

function getHistory() {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];
  const items = JSON.parse(stored);
  if (!Array.isArray(items)) {
    throw new Error("저장된 샘플 기록 형식이 올바르지 않습니다.");
  }
  return items;
}

function saveHistory(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

function formatDate(iso) {
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

function createHistoryCard(item) {
  const card = document.createElement("article");
  card.className = `history-card${item.favorite ? " favorite" : ""}`;

  const head = document.createElement("div");
  head.className = "sample-head";
  const heading = document.createElement("div");
  const id = document.createElement("div");
  id.className = "sample-id";
  id.textContent = item.id || "UNKNOWN SAMPLE";
  const meta = document.createElement("div");
  meta.className = "sample-meta";
  const genreName = item.genreName || genreNames[item.genre] || String(item.genre || "UNKNOWN").toUpperCase();
  meta.textContent = `${genreName} / ${item.subgenre || "-"} / ${String(item.type || "-").toUpperCase()} / 15 SEC`;
  heading.append(id, meta);

  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  favoriteButton.className = `small-btn favorite-toggle${item.favorite ? " active" : ""}`;
  favoriteButton.dataset.id = item.id || "";
  favoriteButton.textContent = item.favorite ? "★" : "☆";
  favoriteButton.setAttribute("aria-label", item.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가");
  favoriteButton.setAttribute("aria-pressed", String(Boolean(item.favorite)));
  head.append(heading, favoriteButton);

  const prompt = document.createElement("div");
  prompt.className = "sample-meta prompt-value";
  prompt.textContent = item.prompt || "NO EXTRA PROMPT";
  const date = document.createElement("div");
  date.className = "sample-meta";
  date.textContent = formatDate(item.createdAt);
  const actions = document.createElement("div");
  actions.className = "sample-actions";
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "small-btn delete-btn";
  deleteButton.dataset.id = item.id || "";
  deleteButton.textContent = "DELETE";
  actions.appendChild(deleteButton);

  card.append(head, prompt, date, actions);
  return card;
}

function render() {
  try {
    const all = getHistory();
    let items = all;

    if (filter.value === "favorite") {
      items = all.filter((item) => item.favorite);
    } else if (filter.value !== "all") {
      items = all.filter((item) => item.genre === filter.value);
    }

    countText.textContent = `${items.length} SAMPLES`;
    grid.replaceChildren();
    if (!items.length) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = all.length
        ? "선택한 조건에 해당하는 샘플이 없습니다."
        : "저장된 샘플 기록이 없습니다.";
      grid.appendChild(emptyState);
      return;
    }
    items.forEach((item) => grid.appendChild(createHistoryCard(item)));
  } catch (error) {
    countText.textContent = "HISTORY ERROR";
    grid.replaceChildren();
    const errorState = document.createElement("div");
    errorState.className = "empty-state";
    errorState.textContent = `기록을 불러오지 못했습니다: ${error.message}`;
    grid.appendChild(errorState);
  }
}

filter.addEventListener("change", render);

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  try {
    const history = getHistory();
    const target = history.find((item) => item.id === button.dataset.id);
    if (!target) return;

    if (button.classList.contains("favorite-toggle")) {
      target.favorite = !target.favorite;
    } else if (button.classList.contains("delete-btn")) {
      saveHistory(history.filter((item) => item.id !== target.id));
      render();
      return;
    } else {
      return;
    }

    saveHistory(history);
    render();
  } catch (error) {
    const errorState = document.createElement("div");
    errorState.className = "empty-state";
    errorState.textContent = `변경 사항을 저장하지 못했습니다: ${error.message}`;
    grid.prepend(errorState);
  }
});

clearBtn.addEventListener("click", () => {
  if (!window.confirm("모든 생성 기록을 삭제할까요?")) return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    render();
  } catch (error) {
    countText.textContent = `CLEAR ERROR: ${error.message}`;
  }
});

render();
