/*
 * storage.js — localStorage 기록의 유일한 읽기/쓰기 창구.
 * 저장 형식이 깨져 있으면 readAll()이 Error를 던지므로 호출하는 쪽에서 처리한다.
 * 노출 이름: window.SampleLab.Storage
 * 의존: Config
 */
(function (global) {
  "use strict";

  const SampleLab = (global.SampleLab = global.SampleLab || {});
  const Config = SampleLab.Config;

  function readAll() {
    const stored = global.localStorage.getItem(Config.STORAGE_KEY);
    if (!stored) return [];
    const items = JSON.parse(stored);
    if (!Array.isArray(items)) {
      throw new Error("저장된 샘플 기록 형식이 올바르지 않습니다.");
    }
    return items;
  }

  function writeAll(items) {
    const trimmed = items.slice(0, Config.MAX_HISTORY);
    global.localStorage.setItem(Config.STORAGE_KEY, JSON.stringify(trimmed));
  }

  // 같은 id가 있으면 교체, 없으면 맨 앞에 추가
  function upsert(item) {
    const items = readAll();
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }
    writeAll(items);
  }

  // 기록이 없으면 false
  function setFavorite(id, favorite) {
    const items = readAll();
    const target = items.find((entry) => entry.id === id);
    if (!target) return false;
    target.favorite = Boolean(favorite);
    writeAll(items);
    return true;
  }

  // 바뀐 favorite 값을 돌려준다. 기록이 없으면 null
  function toggleFavorite(id) {
    const items = readAll();
    const target = items.find((entry) => entry.id === id);
    if (!target) return null;
    target.favorite = !target.favorite;
    writeAll(items);
    return target.favorite;
  }

  function remove(id) {
    writeAll(readAll().filter((entry) => entry.id !== id));
  }

  function clear() {
    global.localStorage.removeItem(Config.STORAGE_KEY);
  }

  SampleLab.Storage = {
    readAll,
    upsert,
    setFavorite,
    toggleFavorite,
    remove,
    clear
  };
})(window);
