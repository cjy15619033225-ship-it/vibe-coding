/**
 * 报名申请 Store（localStorage 持久化）
 * 学生端提交报名 + 管理端审批
 */

const STORAGE_KEY = 'club_recruit_applications';

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** 提交报名申请 */
export function addApplication(app) {
  // app: { clubId, name, phone, major, grade, intro }
  const list = readAll();
  const record = {
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    ...app,
    status: 'pending', // pending | approved | rejected
    createdAt: Date.now(),
  };
  list.push(record);
  writeAll(list);
  return record;
}

/** 获取全部申请 */
export function getApplications() {
  return readAll();
}

/** 按社团 id 筛选申请 */
export function getApplicationsByClub(clubId) {
  return readAll().filter((a) => a.clubId === clubId);
}

/** 按学生姓名获取申请 */
export function getApplicationsByName(name) {
  return readAll().filter((a) => a.name === name);
}

/** 更新申请状态（审批） */
export function updateApplicationStatus(id, status) {
  const list = readAll();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  list[idx].status = status;
  list[idx].updatedAt = Date.now();
  writeAll(list);
  return list[idx];
}

/** 删除申请 */
export function deleteApplication(id) {
  const list = readAll().filter((a) => a.id !== id);
  writeAll(list);
}

/** 清除全部申请 */
export function clearApplications() {
  localStorage.removeItem(STORAGE_KEY);
}
