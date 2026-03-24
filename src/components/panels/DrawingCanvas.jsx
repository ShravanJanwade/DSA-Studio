import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pencil, Circle, Square, Minus, ArrowRight, Type, Eraser,
  Undo2, Redo2, Trash2, Download, MousePointer,
} from 'lucide-react';

// ═══════════════════════════════════════════════
// DRAWING CANVAS — Freehand + shapes + moveable elements
// ═══════════════════════════════════════════════

const TOOLS = [
  { key: 'select', icon: MousePointer, label: 'Select / Move' },
  { key: 'pencil', icon: Pencil, label: 'Pencil' },
  { key: 'line', icon: Minus, label: 'Line' },
  { key: 'rect', icon: Square, label: 'Rectangle' },
  { key: 'circle', icon: Circle, label: 'Circle' },
  { key: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { key: 'text', icon: Type, label: 'Text' },
  { key: 'eraser', icon: Eraser, label: 'Eraser' },
];

const COLORS = [
  '#e4e4e7', '#93c5fd', '#a78bfa', '#34d399',
  '#fbbf24', '#f87171', '#fb923c', '#22d3ee',
  '#e879f9', '#4f8ff7',
];

const GRID_SIZE = 20;

// ── Geometry helpers ──────────────────────────────────────
function getElementBounds(el) {
  switch (el.type) {
    case 'pencil':
    case 'eraser': {
      if (!el.points?.length) return { x: 0, y: 0, w: 1, h: 1 };
      const xs = el.points.map((p) => p.x);
      const ys = el.points.map((p) => p.y);
      const minX = Math.min(...xs), minY = Math.min(...ys);
      return { x: minX, y: minY, w: Math.max(...xs) - minX + 1, h: Math.max(...ys) - minY + 1 };
    }
    case 'line':
    case 'arrow':
      return {
        x: Math.min(el.x1, el.x2), y: Math.min(el.y1, el.y2),
        w: Math.abs(el.x2 - el.x1) + 1, h: Math.abs(el.y2 - el.y1) + 1,
      };
    case 'rect':
    case 'filledRect': {
      const x = el.w < 0 ? el.x + el.w : el.x;
      const y = el.h < 0 ? el.y + el.h : el.y;
      return { x, y, w: Math.abs(el.w) + 1, h: Math.abs(el.h) + 1 };
    }
    case 'circle':
    case 'filledCircle': {
      const x = el.w < 0 ? el.x + el.w : el.x;
      const y = el.h < 0 ? el.y + el.h : el.y;
      return { x, y, w: Math.abs(el.w) + 1, h: Math.abs(el.h) + 1 };
    }
    case 'text': {
      const w = (el.text?.length || 1) * (el.fontSize || 14) * 0.62;
      const h = (el.fontSize || 14) + 4;
      return { x: el.x, y: el.y - h, w, h };
    }
    default:
      return { x: 0, y: 0, w: 1, h: 1 };
  }
}

function hitTest(x, y, el, pad = 10) {
  const b = getElementBounds(el);
  return x >= b.x - pad && x <= b.x + b.w + pad && y >= b.y - pad && y <= b.y + b.h + pad;
}

function moveElement(el, dx, dy) {
  const m = { ...el };
  switch (el.type) {
    case 'pencil':
    case 'eraser':
      m.points = el.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      break;
    case 'line':
    case 'arrow':
      m.x1 = el.x1 + dx; m.y1 = el.y1 + dy;
      m.x2 = el.x2 + dx; m.y2 = el.y2 + dy;
      break;
    case 'rect': case 'filledRect':
    case 'circle': case 'filledCircle':
      m.x = el.x + dx; m.y = el.y + dy;
      break;
    case 'text':
      m.x = el.x + dx; m.y = el.y + dy;
      break;
  }
  return m;
}

// ── Main Component ────────────────────────────────────────
export default function DrawingCanvas({ onTemplateReady }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#93c5fd');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [textInput, setTextInput] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Ref for drag (avoid React re-renders during pointer move)
  const selectDragRef = useRef(null);

  // ── History ──
  const pushHistory = useCallback((newElements) => {
    const trimmed = history.slice(0, historyIdx + 1);
    trimmed.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(trimmed);
    setHistoryIdx(trimmed.length - 1);
  }, [history, historyIdx]);

  const undo = useCallback(() => {
    setSelectedIds(new Set());
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setElements(JSON.parse(JSON.stringify(history[historyIdx - 1])));
    } else if (historyIdx === 0) {
      setHistoryIdx(-1);
      setElements([]);
    }
  }, [historyIdx, history]);

  const redo = useCallback(() => {
    setSelectedIds(new Set());
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setElements(JSON.parse(JSON.stringify(history[historyIdx + 1])));
    }
  }, [historyIdx, history]);

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
    setElements([]);
    pushHistory([]);
  }, [pushHistory]);

  // ── Expose API for DSTemplates ──
  useEffect(() => {
    if (onTemplateReady) {
      onTemplateReady({
        addElements: (newEls) => {
          setElements((prev) => {
            const merged = [...prev, ...newEls];
            pushHistory(merged);
            return merged;
          });
        },
        getCanvasSize: () => {
          const c = canvasRef.current;
          return c ? { w: c.width, h: c.height } : { w: 800, h: 600 };
        },
      });
    }
  }, [onTemplateReady, pushHistory]);

  // ── Resize ──
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current, o = overlayRef.current;
      if (!c || !o) return;
      const rect = c.parentElement.getBoundingClientRect();
      c.width = rect.width; c.height = rect.height;
      o.width = rect.width; o.height = rect.height;
      redraw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ── Redraw when state changes ──
  useEffect(() => { redraw(); }, [elements, showGrid, selectedIds]);

  // ── Draw functions ──
  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);

    // Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < c.width; x += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke();
      }
      for (let y = 0; y < c.height; y += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke();
      }
    }

    // Draw elements
    elements.forEach((el) => drawElement(ctx, el));

    // Selection indicator
    if (selectedIds.size > 0 && !selectDragRef.current?.active) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      selectedIds.forEach((idx) => {
        if (idx < elements.length) {
          const b = getElementBounds(elements[idx]);
          minX = Math.min(minX, b.x); minY = Math.min(minY, b.y);
          maxX = Math.max(maxX, b.x + b.w); maxY = Math.max(maxY, b.y + b.h);
        }
      });
      if (isFinite(minX)) {
        const pad = 10;
        ctx.strokeStyle = '#4f8ff7';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2);
        ctx.setLineDash([]);
        // Corner handles
        [[minX - pad, minY - pad], [maxX + pad, minY - pad],
         [minX - pad, maxY + pad], [maxX + pad, maxY + pad]].forEach(([hx, hy]) => {
          ctx.fillStyle = '#4f8ff7';
          ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fill();
        });
        // Move hint
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillStyle = '#4f8ff7';
        ctx.fillText('drag to move • Del to delete', minX - pad, minY - pad - 6);
      }
    }
  }, [elements, showGrid, selectedIds]);

  function drawElement(ctx, el) {
    ctx.strokeStyle = el.color || '#93c5fd';
    ctx.fillStyle = el.color || '#93c5fd';
    ctx.lineWidth = el.strokeWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (el.type) {
      case 'pencil':
        if (el.points?.length > 1) {
          ctx.beginPath();
          ctx.moveTo(el.points[0].x, el.points[0].y);
          for (let i = 1; i < el.points.length; i++) ctx.lineTo(el.points[i].x, el.points[i].y);
          ctx.stroke();
        }
        break;
      case 'line':
        ctx.beginPath(); ctx.moveTo(el.x1, el.y1); ctx.lineTo(el.x2, el.y2); ctx.stroke();
        break;
      case 'arrow': {
        ctx.beginPath(); ctx.moveTo(el.x1, el.y1); ctx.lineTo(el.x2, el.y2); ctx.stroke();
        const angle = Math.atan2(el.y2 - el.y1, el.x2 - el.x1);
        const headLen = 12;
        ctx.beginPath();
        ctx.moveTo(el.x2, el.y2);
        ctx.lineTo(el.x2 - headLen * Math.cos(angle - Math.PI / 6), el.y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(el.x2, el.y2);
        ctx.lineTo(el.x2 - headLen * Math.cos(angle + Math.PI / 6), el.y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
      case 'rect':
        ctx.strokeRect(el.x, el.y, el.w, el.h);
        break;
      case 'filledRect':
        ctx.fillRect(el.x, el.y, el.w, el.h);
        break;
      case 'circle': {
        const rx = Math.abs(el.w) / 2, ry = Math.abs(el.h) / 2;
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'filledCircle': {
        const rx2 = Math.abs(el.w) / 2, ry2 = Math.abs(el.h) / 2;
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, rx2, ry2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'text':
        ctx.font = `${el.fontSize || 14}px 'JetBrains Mono', 'Fira Code', monospace`;
        ctx.fillText(el.text, el.x, el.y);
        break;
      case 'eraser':
        if (el.points?.length > 1) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = (el.strokeWidth || 2) * 5;
          ctx.beginPath();
          ctx.moveTo(el.points[0].x, el.points[0].y);
          for (let i = 1; i < el.points.length; i++) ctx.lineTo(el.points[i].x, el.points[i].y);
          ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
        }
        break;
    }
  }

  // ── Mouse position ──
  const getPos = (e) => {
    const c = overlayRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // ── Mouse handlers ──
  const handleMouseDown = (e) => {
    const pos = getPos(e);

    if (tool === 'select') {
      // Find topmost element at click position
      let hitIdx = -1;
      for (let i = elements.length - 1; i >= 0; i--) {
        if (hitTest(pos.x, pos.y, elements[i])) { hitIdx = i; break; }
      }

      if (hitIdx !== -1) {
        const hitEl = elements[hitIdx];
        let newSel;
        if (hitEl.groupId) {
          // Select the whole group
          newSel = new Set(
            elements.map((el, i) => el.groupId === hitEl.groupId ? i : -1).filter((i) => i >= 0)
          );
        } else {
          newSel = new Set([hitIdx]);
        }
        setSelectedIds(newSel);
        selectDragRef.current = {
          active: true,
          startPos: pos,
          indices: [...newSel],
          origElements: JSON.parse(JSON.stringify(elements)),
        };
      } else {
        setSelectedIds(new Set());
        selectDragRef.current = null;
      }
      return;
    }

    setDrawing(true);
    setStartPos(pos);
    if (tool === 'pencil' || tool === 'eraser') {
      setCurrentPath([pos]);
    } else if (tool === 'text') {
      setTextInput({ x: pos.x, y: pos.y, text: '' });
      setDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    const pos = getPos(e);

    // SELECT DRAG — draw ghost on overlay
    if (tool === 'select' && selectDragRef.current?.active) {
      const { startPos, indices, origElements } = selectDragRef.current;
      const dx = pos.x - startPos.x, dy = pos.y - startPos.y;
      const o = overlayRef.current;
      if (o) {
        const ctx = o.getContext('2d');
        ctx.clearRect(0, 0, o.width, o.height);
        ctx.save();
        ctx.globalAlpha = 0.85;
        indices.forEach((idx) => drawElement(ctx, moveElement(origElements[idx], dx, dy)));
        ctx.restore();
      }
      return;
    }

    if (!drawing) return;
    const o = overlayRef.current;
    if (!o) return;
    const ctx = o.getContext('2d');
    ctx.clearRect(0, 0, o.width, o.height);

    if (tool === 'pencil' || tool === 'eraser') {
      setCurrentPath((prev) => [...prev, pos]);
      drawElement(ctx, { type: tool, points: [...currentPath, pos], color, strokeWidth });
    } else if (tool === 'line' || tool === 'arrow') {
      drawElement(ctx, { type: tool, x1: startPos.x, y1: startPos.y, x2: pos.x, y2: pos.y, color, strokeWidth });
    } else if (tool === 'rect') {
      drawElement(ctx, { type: 'rect', x: startPos.x, y: startPos.y, w: pos.x - startPos.x, h: pos.y - startPos.y, color, strokeWidth });
    } else if (tool === 'circle') {
      drawElement(ctx, { type: 'circle', x: startPos.x, y: startPos.y, w: pos.x - startPos.x, h: pos.y - startPos.y, color, strokeWidth });
    }
  };

  const handleMouseUp = (e) => {
    const pos = getPos(e);

    // SELECT DROP — commit the move
    if (tool === 'select' && selectDragRef.current?.active) {
      const { startPos, indices, origElements } = selectDragRef.current;
      const dx = pos.x - startPos.x, dy = pos.y - startPos.y;
      const o = overlayRef.current;
      if (o) o.getContext('2d').clearRect(0, 0, o.width, o.height);

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        const newEls = [...elements];
        indices.forEach((idx) => { newEls[idx] = moveElement(origElements[idx], dx, dy); });
        setElements(newEls);
        pushHistory(newEls);
      }
      selectDragRef.current = { ...selectDragRef.current, active: false };
      return;
    }

    if (!drawing) return;
    setDrawing(false);
    const o = overlayRef.current;
    if (o) o.getContext('2d').clearRect(0, 0, o.width, o.height);

    let newEl = null;
    if (tool === 'pencil' || tool === 'eraser') {
      newEl = { type: tool, points: [...currentPath, pos], color, strokeWidth };
    } else if (tool === 'line' || tool === 'arrow') {
      newEl = { type: tool, x1: startPos.x, y1: startPos.y, x2: pos.x, y2: pos.y, color, strokeWidth };
    } else if (tool === 'rect') {
      newEl = { type: 'rect', x: startPos.x, y: startPos.y, w: pos.x - startPos.x, h: pos.y - startPos.y, color, strokeWidth };
    } else if (tool === 'circle') {
      newEl = { type: 'circle', x: startPos.x, y: startPos.y, w: pos.x - startPos.x, h: pos.y - startPos.y, color, strokeWidth };
    }

    if (newEl) {
      const next = [...elements, newEl];
      setElements(next);
      pushHistory(next);
    }
    setCurrentPath([]);
    setStartPos(null);
  };

  const handleTextSubmit = () => {
    if (textInput?.text.trim()) {
      const el = { type: 'text', x: textInput.x, y: textInput.y, text: textInput.text, color, fontSize: strokeWidth * 6 + 8 };
      const next = [...elements, el];
      setElements(next);
      pushHistory(next);
    }
    setTextInput(null);
  };

  const exportPNG = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement('a');
    link.download = 'dsa-dry-run.png';
    link.href = c.toDataURL('image/png');
    link.click();
  };

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if (textInput) return;
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      // Delete selected elements
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.size > 0) {
        e.preventDefault();
        const newEls = elements.filter((_, i) => !selectedIds.has(i));
        setElements(newEls);
        pushHistory(newEls);
        setSelectedIds(new Set());
      }
      // Escape = deselect
      if (e.key === 'Escape') setSelectedIds(new Set());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, textInput, selectedIds, elements, pushHistory]);

  // ── Cursor ──
  const canvasCursor = () => {
    if (tool === 'text') return 'text';
    if (tool === 'select') return selectedIds.size > 0 ? 'move' : 'default';
    return 'crosshair';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0c', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 3, padding: '7px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)', flexShrink: 0, flexWrap: 'wrap',
      }}>
        {/* Tools */}
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const active = tool === t.key;
          return (
            <button key={t.key} onClick={() => setTool(t.key)} title={t.label} style={{
              padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: active ? 'rgba(79,143,247,0.18)' : 'transparent',
              color: active ? '#93c5fd' : '#52525b', display: 'flex', alignItems: 'center',
              gap: 4, fontSize: 11, fontWeight: active ? 650 : 400, fontFamily: 'inherit',
              transition: 'all 0.12s',
              boxShadow: active ? 'inset 0 0 0 1px rgba(79,143,247,0.3)' : 'none',
            }}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

        {/* Colors */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} style={{
              width: 16, height: 16, borderRadius: '50%',
              border: color === c ? '2px solid #fff' : '2px solid transparent',
              background: c, cursor: 'pointer', transition: 'all 0.12s',
              boxShadow: color === c ? `0 0 8px ${c}60` : 'none',
            }} />
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

        {/* Stroke width */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: '#52525b', fontWeight: 600 }}>Size</span>
          <input type="range" min={1} max={8} value={strokeWidth} onChange={(e) => setStrokeWidth(+e.target.value)}
            style={{ width: 60, accentColor: '#4f8ff7' }} />
          <span style={{ fontSize: 10, color: '#71717a', fontFamily: "'JetBrains Mono', monospace", minWidth: 16 }}>{strokeWidth}</span>
        </div>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

        {/* Actions */}
        <button onClick={undo} title="Undo (Ctrl+Z)" style={actionBtnStyle}><Undo2 size={13} /> Undo</button>
        <button onClick={redo} title="Redo (Ctrl+Y)" style={actionBtnStyle}><Redo2 size={13} /> Redo</button>
        <button onClick={clearAll} title="Clear All" style={{ ...actionBtnStyle, color: '#f87171' }}><Trash2 size={13} /> Clear</button>
        <button onClick={exportPNG} title="Export PNG" style={actionBtnStyle}><Download size={13} /> Export</button>

        <div style={{ flex: 1 }} />

        <button onClick={() => setShowGrid(!showGrid)} style={{ ...actionBtnStyle, color: showGrid ? '#93c5fd' : '#3f3f46' }}>
          Grid {showGrid ? 'On' : 'Off'}
        </button>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, position: 'relative', cursor: canvasCursor(), overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
        <canvas ref={overlayRef} style={{ position: 'absolute', inset: 0 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (drawing) handleMouseUp({ clientX: 0, clientY: 0 });
            if (selectDragRef.current?.active) {
              const o = overlayRef.current;
              if (o) o.getContext('2d').clearRect(0, 0, o.width, o.height);
              selectDragRef.current = { ...selectDragRef.current, active: false };
            }
          }}
        />
        {/* Text input overlay */}
        {textInput && (
          <input
            autoFocus
            value={textInput.text}
            onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit(); if (e.key === 'Escape') setTextInput(null); }}
            onBlur={handleTextSubmit}
            style={{
              position: 'absolute', left: textInput.x, top: textInput.y - 10,
              background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(79,143,247,0.5)',
              borderRadius: 4, color, padding: '4px 8px', fontSize: strokeWidth * 6 + 8,
              fontFamily: "'JetBrains Mono', monospace", outline: 'none', minWidth: 100,
            }}
          />
        )}
        {/* Selection hint when nothing selected */}
        {tool === 'select' && selectedIds.size === 0 && elements.length > 0 && (
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            fontSize: 11, color: '#3f3f46', background: 'rgba(0,0,0,0.5)',
            padding: '4px 12px', borderRadius: 20, pointerEvents: 'none',
          }}>
            Click a shape or diagram to select &amp; drag it
          </div>
        )}
      </div>
    </div>
  );
}

const actionBtnStyle = {
  padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
  background: 'transparent', color: '#71717a', display: 'flex', alignItems: 'center',
  gap: 4, fontSize: 11, fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.12s',
};
