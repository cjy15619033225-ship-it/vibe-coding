import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle } from 'lucide-react';
import { getClubById } from '../../store/club-store';
import { addApplication } from '../../store/application-store';

const GRADES = ['大一', '大二', '大三', '大四'];

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const club = getClubById(id);
  const [form, setForm] = useState({ name: '', phone: '', major: '', grade: GRADES[0], intro: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!club) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">社团不存在</p>
        <button onClick={() => navigate(-1)} className="btn-primary text-sm">返回</button>
      </div>
    );
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = '请输入姓名';
    if (!/^1\d{10}$/.test(form.phone)) e.phone = '请输入11位手机号';
    if (!form.major.trim()) e.major = '请输入专业';
    if (!form.intro.trim()) e.intro = '请简单介绍自己';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    addApplication({ clubId: id, ...form });
    setSubmitted(true);
  }

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 animate-bounce-in">
          <CheckCircle size={32} className="text-[var(--color-success)]" />
        </div>
        <h1 className="text-xl font-bold mb-1">报名成功！</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          你已成功报名 <strong>{club.name}</strong>，请等待审核
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={() => navigate(`/club/${id}`)} className="btn-outline flex-1 text-sm">返回详情</button>
          <button onClick={() => navigate('/profile')} className="btn-primary flex-1 text-sm">查看报名</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold">报名 {club.name}</h1>
          <p className="text-[10px] text-[var(--color-text-dim)]">填写信息提交报名</p>
        </div>
      </div>

      {/* Club card */}
      <div className="mx-5 mt-3 mb-5 card p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-lg bg-[var(--color-bg-secondary)]">{club.logo}</div>
        <div>
          <p className="text-sm font-semibold">{club.name}</p>
          <p className="text-[10px] text-[var(--color-text-dim)]">{club.slogan}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 space-y-4">
        <Field label="姓名" error={errors.name}>
          <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="请输入真实姓名" className="form-input" />
        </Field>
        <Field label="手机号" error={errors.phone}>
          <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="11位手机号" maxLength={11} className="form-input" />
        </Field>
        <Field label="专业" error={errors.major}>
          <input type="text" value={form.major} onChange={(e) => update('major', e.target.value)} placeholder="请输入你的专业" className="form-input" />
        </Field>
        <Field label="年级">
          <div className="flex gap-2">
            {GRADES.map((g) => (
              <button key={g} type="button" onClick={() => update('grade', g)}
                className={`flex-1 text-xs py-2.5 rounded-xl transition-all font-medium
                  ${form.grade === g ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
              >{g}</button>
            ))}
          </div>
        </Field>
        <Field label="自我介绍" error={errors.intro}>
          <textarea value={form.intro} onChange={(e) => update('intro', e.target.value)} placeholder="简单介绍自己，以及为什么想加入" rows={4} className="form-input resize-none" />
        </Field>
        <button type="submit" className="btn-primary w-full"><Send size={15} /> 提交报名</button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 block text-[var(--color-text-secondary)]">{label}</label>
      {children}
      {error && <p className="text-[10px] text-[var(--color-danger)] mt-1">{error}</p>}
    </div>
  );
}
