import { useState } from 'react';
import { getClubs, updateClub } from '../../../store/club-store';

export default function ClubEdit() {
  const [clubs, setClubs] = useState(getClubs);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  function startEdit(club) {
    setEditingId(club.id);
    setDraft({ slogan: club.slogan, description: club.description, recruiting: club.recruiting });
  }

  function save() {
    updateClub(editingId, draft);
    setClubs(getClubs());
    setEditingId(null);
  }

  function cancel() {
    setEditingId(null);
    setDraft({});
  }

  return (
    <div className="animate-fade-in pb-4">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">社团管理</h1>
        <p className="text-xs text-[var(--color-text-dim)] mt-1">编辑社团信息</p>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {clubs.map((club) => {
          const isEditing = editingId === club.id;
          return (
            <div key={club.id} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-lg bg-[var(--color-bg-secondary)] shrink-0">{club.logo}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{club.name}</p>
                  <p className="text-[10px] text-[var(--color-text-dim)]">{club.category} · {club.memberCount} 人</p>
                </div>
                {!isEditing ? (
                  <button onClick={() => startEdit(club)} className="text-xs font-medium text-[var(--color-primary)]">编辑</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={save} className="text-xs font-medium text-[var(--color-success)]">保存</button>
                    <button onClick={cancel} className="text-xs text-[var(--color-text-dim)]">取消</button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-[var(--color-text-dim)] mb-1 block">Slogan</label>
                    <input type="text" value={draft.slogan} onChange={(e) => setDraft((d) => ({ ...d, slogan: e.target.value }))} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--color-text-dim)] mb-1 block">简介</label>
                    <textarea value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} rows={3} className="form-input text-xs resize-none" />
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={draft.recruiting} onChange={(e) => setDraft((d) => ({ ...d, recruiting: e.target.checked }))} className="accent-[var(--color-primary)]" />
                    正在招新
                  </label>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[var(--color-text-secondary)]">{club.slogan}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${club.recruiting ? 'bg-green-50 text-green-600' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-dim)]'}`}>
                      {club.recruiting ? '招新中' : '已停止'}
                    </span>
                    {club.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-dim)]">{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
