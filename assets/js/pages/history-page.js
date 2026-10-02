/*
 * history-page.js — pages/history.html 전용 컨트롤러.
 * History 렌더링, 필터, Favorite, 개별/전체 삭제만 담당한다.
 * 의존: Config, Utils, Storage (오디오 모듈은 사용하지 않는다)
 */
(function (global) {
  "use strict";

  const { Config, Utils, Storage } = global.SampleLab;

  const grid = document.querySelector("#historyGrid");
  const countText = document.querySelector("#historyCount");
  const filter = document.querySelector("#historyFilter");
  const clearBtn = document.querySelector("#clearHistoryBtn");

  /* ---------- 필터 초기화 ---------- */

  function initFilter() {
    const options = [
      { value: "all", label: "ALL" },
      { value: "favorite", label: "FAVORITES" },
      ...Config.GENRES.map((genre) => ({ value: genre.id, label: genre.name }))
    ];
    filter.replaceChildren();
    options.forEach(({ value, label }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      filter.appendChild(option);
    });
  }

  /* ---------- 렌더링 ---------- */

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
    const known = Config.GENRES.find((genre) => genre.id === item.genre);
    const genreName =
      item.genreName || (known && known.name) || String(item.genre || "UNKNOWN").toUpperCase();
    meta.textContent = `${genreName} / ${item.subgenre || "-"} / ${String(item.type || "-").toUpperCase()} / ${Config.SAMPLE_DURATION} SEC`;
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
    date.textContent = Utils.formatDateTime(item.createdAt);
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

  function filterItems(all) {
    if (filter.value === "favorite") return all.filter((item) => item.favorite);
    if (filter.value !== "all") return all.filter((item) => item.genre === filter.value);
    return all;
  }

  function showMessage(message) {
    const state = document.createElement("div");
    state.className = "empty-state";
    state.textContent = message;
    return state;
  }

  function render() {
    try {
      const all = Storage.readAll();
      const items = filterItems(all);

      countText.textContent = `${items.length} SAMPLES`;
      grid.replaceChildren();
      if (!items.length) {
        grid.appendChild(
          showMessage(
            all.length ? "선택한 조건에 해당하는 샘플이 없습니다." : "저장된 샘플 기록이 없습니다."
          )
        );
        return;
      }
      items.forEach((item) => grid.appendChild(createHistoryCard(item)));
    } catch (error) {
      countText.textContent = "HISTORY ERROR";
      grid.replaceChildren(showMessage(`기록을 불러오지 못했습니다: ${error.message}`));
    }
  }

  /* ---------- 이벤트 ---------- */

  filter.addEventListener("change", render);

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !button.dataset.id) return;

    try {
      if (button.classList.contains("favorite-toggle")) {
        Storage.toggleFavorite(button.dataset.id);
      } else if (button.classList.contains("delete-btn")) {
        Storage.remove(button.dataset.id);
      } else {
        return;
      }
      render();
    } catch (error) {
      grid.prepend(showMessage(`변경 사항을 저장하지 못했습니다: ${error.message}`));
    }
  });

  clearBtn.addEventListener("click", () => {
    if (!global.confirm("모든 생성 기록을 삭제할까요?")) return;
    try {
      Storage.clear();
      render();
    } catch (error) {
      countText.textContent = `CLEAR ERROR: ${error.message}`;
    }
  });

  initFilter();
  render();
})(window);
