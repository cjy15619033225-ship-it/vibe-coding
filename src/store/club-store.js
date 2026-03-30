/**
 * 社团数据 Store（localStorage 持久化）
 * 初始数据来自 src/data/clubs.js，管理端可修改
 */
import { clubs as defaultClubs } from '../data/clubs.js';

const STORAGE_KEY = 'club_recruit_clubs';
const VERSION_KEY = 'club_recruit_clubs_v';
const CURRENT_VERSION = 2; // bump this when default data changes

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
}

/** 获取全部社团（数据版本变化时自动刷新） */
export function getClubs() {
  const storedVersion = Number(localStorage.getItem(VERSION_KEY) || 0);
  let list = readAll();
  if (!list || storedVersion < CURRENT_VERSION) {
    list = defaultClubs;
    writeAll(list);
  }
  return list;
}

/** 按 id 获取单个社团 */
export function getClubById(id) {
  return getClubs().find((c) => c.id === id) || null;
}

/** 更新单个社团（管理端用） */
export function updateClub(id, patch) {
  const list = getClubs();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list[idx];
}

/** 重置为预置数据 */
export function resetClubs() {
  writeAll(defaultClubs);
  return defaultClubs;
}
