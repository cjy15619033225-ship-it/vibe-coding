import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { quizQuestions } from '../../data/quiz-questions';
import { buildUserVector } from '../../utils/match-algorithm';
import { saveQuizResult } from '../../store/quiz-store';

export default function Quiz() {
  const navigate = useNavigate();
  const total = quizQuestions.length;
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [leaving, setLeaving] = useState(false);
  const [imgReady, setImgReady] = useState(true);

  const q = quizQuestions[current];
  const prevQ = quizQuestions[prevIdx];
  const selected = answers[current];
  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = (answeredCount / total) * 100;
  const allDone = answers.every((a) => a !== null);

  function animateTo(idx) {
    setLeaving(true);
    setPrevIdx(current);
    setImgReady(false);
    setTimeout(() => {
      setCurrent(idx);
      setLeaving(false);
      // 让新图片开始淡入
      requestAnimationFrame(() => setImgReady(true));
    }, 220);
  }

  function selectChoice(optIdx) {
    const next = [...answers];
    next[current] = { type: 'choice', optionIndex: optIdx, questionId: q.id, weights: q.options[optIdx].weights };
    setAnswers(next);
    if (current < total - 1) {
      setTimeout(() => animateTo(current + 1), 300);
    }
  }

  function setSliderValue(value) {
    const next = [...answers];
    next[current] = { type: 'slider', questionId: q.id, value, leftWeights: q.leftWeights, rightWeights: q.rightWeights };
    setAnswers(next);
  }

  function setRankOrder(order) {
    const next = [...answers];
    next[current] = { type: 'rank', questionId: q.id, order };
    setAnswers(next);
  }

  function goTo(idx) {
    if (idx < 0 || idx >= total) return;
    animateTo(idx);
  }

  function submit() {
    const userVector = buildUserVector(answers);
    saveQuizResult({ answers, userVector });
    navigate('/quiz/result', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in bg-[var(--color-bg)]">
      {/* ── Scene Image (Crossfade) ── */}
      <div className="relative h-48 overflow-hidden">
        {/* 上一张图（淡出底层） */}
        <img
          src={prevQ.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 当前图（淡入顶层） */}
        <img
          src={q.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          style={{ opacity: imgReady ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white" />
        {/* Back button & progress */}
        <div className="absolute top-0 left-0 right-0 pt-12 px-4 flex items-center justify-between">
          <button
            onClick={() => (current === 0 ? navigate(-1) : goTo(current - 1))}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
          <span className="text-sm font-semibold text-white/90 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
            {current + 1} / {total}
          </span>
          <div className="w-9" />
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="px-5 -mt-1">
        <div className="h-1 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Question Content ── */}
      <div className={`flex-1 px-5 pt-5 pb-4 transition-all duration-200 ${leaving ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
        <h2 className="text-xl font-bold leading-snug mb-1">{q.question}</h2>
        {q.subtitle && <p className="text-xs text-[var(--color-text-dim)] mb-3">{q.subtitle}</p>}

        {/* Choice type */}
        {q.type === 'choice' && (
          <div className="space-y-2.5 mt-4">
            {q.options.map((opt, i) => {
              const isSelected = selected?.optionIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => selectChoice(i)}
                  className={`w-full text-left rounded-2xl p-4 transition-all duration-200 active:scale-[0.98] flex items-center gap-3
                    ${isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-md'
                      : 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)]'
                    }`}
                >
                  <span className="text-2xl shrink-0">{opt.emoji}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Slider type */}
        {q.type === 'slider' && (
          <SliderQuestion
            question={q}
            value={selected?.value ?? 50}
            onChange={setSliderValue}
          />
        )}

        {/* Rank type */}
        {q.type === 'rank' && (
          <RankQuestion
            question={q}
            order={selected?.order ?? null}
            onChange={setRankOrder}
          />
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <div className="px-5 pb-6 pt-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          {quizQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? 'w-5 bg-[var(--color-primary)]'
                  : answers[i] !== null
                    ? 'w-1.5 bg-[var(--color-text-dim)]'
                    : 'w-1.5 bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>
        {current < total - 1 ? (
          <button
            onClick={() => goTo(current + 1)}
            disabled={selected === null}
            className="btn-primary text-sm !py-2.5 !px-5 disabled:opacity-20"
          >
            下一题
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!allDone}
            className="btn-primary text-sm !py-2.5 !px-5 disabled:opacity-20"
          >
            <Sparkles size={14} /> 查看结果
          </button>
        )}
      </div>
    </div>
  );
}

/** 滑动量表组件 */
function SliderQuestion({ question, value, onChange }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <span className="text-2xl block">{question.leftEmoji}</span>
          <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">{question.leftLabel}</span>
        </div>
        <div className="text-center">
          <span className="text-2xl block">{question.rightEmoji}</span>
          <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">{question.rightLabel}</span>
        </div>
      </div>
      <div className="relative px-1">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-bg-secondary)]"
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${value}%, var(--color-border) ${value}%, var(--color-border) 100%)`,
          }}
        />
      </div>
      <div className="text-center mt-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-bg-secondary)] text-sm font-medium">
          {value <= 30 ? '偏向独处' : value >= 70 ? '偏向社交' : '两者兼顾'}
        </span>
      </div>
    </div>
  );
}

/** 拖拽排序组件（支持触摸拖拽 + 点击上下移动） */
function RankQuestion({ question, order, onChange }) {
  const items = order || question.items;
  const listRef = useRef(null);
  const dragState = useRef(null);
  const [draggingIdx, setDraggingIdx] = useState(-1);
  const [offsetY, setOffsetY] = useState(0);

  const moveUp = useCallback((idx) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  }, [items, onChange]);

  const moveDown = useCallback((idx) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  }, [items, onChange]);

  // 首次进入时自动设置默认排序
  if (!order) {
    setTimeout(() => onChange([...question.items]), 0);
  }

  // ── Touch drag handlers ──
  const ITEM_H = 64; // approx item height + gap

  function handleTouchStart(e, idx) {
    const touch = e.touches[0];
    dragState.current = { idx, startY: touch.clientY, moved: false };
    setDraggingIdx(idx);
    setOffsetY(0);
  }

  function handleTouchMove(e, idx) {
    if (!dragState.current || dragState.current.idx !== idx) return;
    const touch = e.touches[0];
    const dy = touch.clientY - dragState.current.startY;
    dragState.current.moved = true;
    setOffsetY(dy);

    // 如果拖动超过一个 item 高度，交换
    if (Math.abs(dy) > ITEM_H * 0.6) {
      const dir = dy > 0 ? 1 : -1;
      const newIdx = idx + dir;
      if (newIdx >= 0 && newIdx < items.length) {
        const next = [...items];
        [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
        onChange(next);
        dragState.current.idx = newIdx;
        dragState.current.startY = touch.clientY;
        setDraggingIdx(newIdx);
        setOffsetY(0);
      }
    }
  }

  function handleTouchEnd() {
    dragState.current = null;
    setDraggingIdx(-1);
    setOffsetY(0);
  }

  const rankColors = [
    'bg-[var(--color-accent)] text-white',
    'bg-[var(--color-primary)] text-white',
    'bg-[#6b7280] text-white',
    'bg-[#9ca3af] text-white',
    'bg-[#d1d5db] text-[#6b7280]',
  ];

  return (
    <div className="mt-4 space-y-2" ref={listRef}>
      {items.map((item, idx) => {
        const isDragging = draggingIdx === idx;
        return (
          <div
            key={item.label}
            className={`flex items-center gap-2.5 rounded-2xl p-3 transition-shadow ${
              isDragging
                ? 'bg-white shadow-lg scale-[1.02] z-10 relative'
                : 'bg-[var(--color-bg-secondary)]'
            }`}
            style={isDragging ? { transform: `translateY(${offsetY}px) scale(1.02)`, transition: 'box-shadow 0.2s' } : {}}
          >
            {/* 拖拽把手 */}
            <div
              className="touch-none cursor-grab active:cursor-grabbing p-1 shrink-0 text-[var(--color-text-dim)]"
              onTouchStart={(e) => handleTouchStart(e, idx)}
              onTouchMove={(e) => handleTouchMove(e, idx)}
              onTouchEnd={handleTouchEnd}
            >
              <GripVertical size={18} />
            </div>

            {/* 排名数字 */}
            <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${rankColors[idx] || rankColors[4]}`}>
              {idx + 1}
            </span>

            <span className="text-xl shrink-0">{item.emoji}</span>
            <span className="text-sm font-medium flex-1">{item.label}</span>

            {/* 上下按钮 */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="w-8 h-8 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center disabled:opacity-20 active:scale-90 active:bg-[var(--color-bg-secondary)] transition-all shadow-sm"
              >
                <ChevronUp size={16} className="text-[var(--color-primary)]" />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === items.length - 1}
                className="w-8 h-8 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center disabled:opacity-20 active:scale-90 active:bg-[var(--color-bg-secondary)] transition-all shadow-sm"
              >
                <ChevronDown size={16} className="text-[var(--color-primary)]" />
              </button>
            </div>
          </div>
        );
      })}
      <p className="text-center text-[10px] text-[var(--color-text-dim)] mt-1">拖拽左侧 ⠿ 或点击右侧箭头调整顺序</p>
    </div>
  );
}
