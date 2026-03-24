import {
  GitBranch, Share2, ArrowRight, List, Triangle, Hash,
  Layers, AlignJustify, Grid, GitMerge, ChevronDown,
  GitCommit, Columns, LayoutGrid, Workflow,
} from 'lucide-react';

// ═══════════════════════════════════════════════
// DATA STRUCTURE TEMPLATES — Auto-draw on canvas
// Each template assigns a groupId so elements move together
// ═══════════════════════════════════════════════

const NODE_RADIUS = 20;
const NODE_COLOR = '#4f8ff7';
const EDGE_COLOR = '#52525b';
const LABEL_COLOR = '#e4e4e7';
const CELL_W = 48;
const CELL_H = 34;

// ── Primitive builders ──

function makeNode(x, y, label, color = NODE_COLOR) {
  return [
    { type: 'circle', x: x - NODE_RADIUS, y: y - NODE_RADIUS, w: NODE_RADIUS * 2, h: NODE_RADIUS * 2, color, strokeWidth: 2 },
    { type: 'text', x: x - (label.length > 2 ? 9 : label.length > 1 ? 7 : 4), y: y + 5, text: label, color: LABEL_COLOR, fontSize: 14 },
  ];
}

function makeEdge(x1, y1, x2, y2, directed = false) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const sx = x1 + NODE_RADIUS * Math.cos(angle);
  const sy = y1 + NODE_RADIUS * Math.sin(angle);
  const ex = x2 - NODE_RADIUS * Math.cos(angle);
  const ey = y2 - NODE_RADIUS * Math.sin(angle);
  return [{ type: directed ? 'arrow' : 'line', x1: sx, y1: sy, x2: ex, y2: ey, color: EDGE_COLOR, strokeWidth: 1.5 }];
}

function makeArrayCell(x, y, value, index, color = NODE_COLOR) {
  return [
    { type: 'rect', x, y, w: CELL_W, h: CELL_H, color, strokeWidth: 1.5 },
    { type: 'text', x: x + CELL_W / 2 - (String(value).length > 1 ? 7 : 4), y: y + CELL_H / 2 + 5, text: String(value), color: LABEL_COLOR, fontSize: 14 },
    { type: 'text', x: x + CELL_W / 2 - (String(index).length > 1 ? 5 : 3), y: y + CELL_H + 14, text: String(index), color: '#52525b', fontSize: 10 },
  ];
}

function makeLLNode(x, y, value, color = '#a78bfa') {
  return [
    { type: 'rect', x, y, w: 60, h: 30, color, strokeWidth: 1.5 },
    { type: 'line', x1: x + 40, y1: y, x2: x + 40, y2: y + 30, color: '#52525b', strokeWidth: 1 },
    { type: 'text', x: x + 12, y: y + 19, text: String(value), color: LABEL_COLOR, fontSize: 13 },
    { type: 'filledCircle', x: x + 44, y: y + 11, w: 8, h: 8, color: '#71717a' },
  ];
}

function makeTitle(x, y, text) {
  return [{ type: 'text', x, y, text, color: '#71717a', fontSize: 12 }];
}

// ── Template generators ──

function generateBST(offsetX = 80, offsetY = 40) {
  const els = [];
  const nodes = [
    { x: 200, y: 40, label: '8' },
    { x: 120, y: 100, label: '3' },
    { x: 280, y: 100, label: '10' },
    { x: 80, y: 160, label: '1' },
    { x: 160, y: 160, label: '6' },
    { x: 320, y: 160, label: '14' },
    { x: 130, y: 220, label: '4' },
    { x: 190, y: 220, label: '7' },
    { x: 290, y: 220, label: '13' },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[4,6],[4,7],[5,8]];
  edges.forEach(([a,b]) => els.push(...makeEdge(nodes[a].x+offsetX, nodes[a].y+offsetY, nodes[b].x+offsetX, nodes[b].y+offsetY)));
  nodes.forEach((n) => els.push(...makeNode(n.x+offsetX, n.y+offsetY, n.label)));
  els.push(...makeTitle(offsetX + 150, offsetY - 14, 'Binary Search Tree'));
  return els;
}

function generateDirectedGraph(offsetX = 80, offsetY = 40) {
  const els = [];
  const nodes = [
    { x: 60, y: 60, label: '0' },
    { x: 180, y: 40, label: '1' },
    { x: 300, y: 60, label: '2' },
    { x: 120, y: 150, label: '3' },
    { x: 240, y: 160, label: '4' },
    { x: 180, y: 240, label: '5' },
  ];
  const edges = [[0,1],[1,2],[0,3],[1,4],[3,5],[4,5],[2,4]];
  edges.forEach(([a,b]) => els.push(...makeEdge(nodes[a].x+offsetX, nodes[a].y+offsetY, nodes[b].x+offsetX, nodes[b].y+offsetY, true)));
  nodes.forEach((n) => els.push(...makeNode(n.x+offsetX, n.y+offsetY, n.label, '#22d3ee')));
  els.push(...makeTitle(offsetX + 100, offsetY - 14, 'Directed Graph'));
  return els;
}

function generateUndirectedGraph(offsetX = 80, offsetY = 40) {
  const els = [];
  const nodes = [
    { x: 80, y: 60, label: 'A' },
    { x: 200, y: 40, label: 'B' },
    { x: 300, y: 80, label: 'C' },
    { x: 60, y: 170, label: 'D' },
    { x: 200, y: 200, label: 'E' },
    { x: 320, y: 180, label: 'F' },
  ];
  const edges = [[0,1],[1,2],[0,3],[3,4],[4,5],[2,5],[1,4],[0,4]];
  edges.forEach(([a,b]) => els.push(...makeEdge(nodes[a].x+offsetX, nodes[a].y+offsetY, nodes[b].x+offsetX, nodes[b].y+offsetY, false)));
  nodes.forEach((n) => els.push(...makeNode(n.x+offsetX, n.y+offsetY, n.label, '#34d399')));
  els.push(...makeTitle(offsetX + 100, offsetY - 14, 'Undirected Graph'));
  return els;
}

function generateLinkedList(offsetX = 50, offsetY = 80) {
  const els = [];
  const values = [1, 4, 7, 9, 12];
  values.forEach((v, i) => {
    const x = offsetX + i * 100;
    els.push(...makeLLNode(x, offsetY, v));
    if (i < values.length - 1) {
      els.push({ type: 'arrow', x1: x + 56, y1: offsetY + 15, x2: x + 100, y2: offsetY + 15, color: EDGE_COLOR, strokeWidth: 1.5 });
    }
  });
  els.push({ type: 'text', x: offsetX + values.length * 100 - 6, y: offsetY + 19, text: 'NULL', color: '#f87171', fontSize: 11 });
  els.push({ type: 'text', x: offsetX + 12, y: offsetY - 10, text: 'head', color: '#a78bfa', fontSize: 11 });
  els.push({ type: 'arrow', x1: offsetX + 30, y1: offsetY - 4, x2: offsetX + 30, y2: offsetY, color: '#a78bfa', strokeWidth: 1 });
  els.push(...makeTitle(offsetX + 100, offsetY - 24, 'Linked List'));
  return els;
}

function generateDoublyLinkedList(offsetX = 50, offsetY = 80) {
  const els = [];
  const values = [1, 4, 7, 9, 12];
  const nodeW = 68, nodeH = 32, gap = 22;

  values.forEach((v, i) => {
    const x = offsetX + i * (nodeW + gap);
    els.push({ type: 'rect', x, y: offsetY, w: nodeW, h: nodeH, color: '#a78bfa', strokeWidth: 1.5 });
    els.push({ type: 'line', x1: x + 18, y1: offsetY, x2: x + 18, y2: offsetY + nodeH, color: '#52525b', strokeWidth: 1 });
    els.push({ type: 'line', x1: x + nodeW - 18, y1: offsetY, x2: x + nodeW - 18, y2: offsetY + nodeH, color: '#52525b', strokeWidth: 1 });
    els.push({ type: 'text', x: x + nodeW/2 - (String(v).length > 1 ? 7 : 4), y: offsetY + nodeH/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 13 });

    if (i > 0) {
      els.push({ type: 'filledCircle', x: x + 4, y: offsetY + nodeH/2 - 4, w: 8, h: 8, color: '#f87171' });
    } else {
      els.push({ type: 'text', x: x + 3, y: offsetY + nodeH/2 + 5, text: 'N', color: '#f87171', fontSize: 9 });
    }
    if (i < values.length - 1) {
      els.push({ type: 'filledCircle', x: x + nodeW - 13, y: offsetY + nodeH/2 - 4, w: 8, h: 8, color: '#34d399' });
    } else {
      els.push({ type: 'text', x: x + nodeW - 16, y: offsetY + nodeH/2 + 5, text: 'N', color: '#f87171', fontSize: 9 });
    }
  });

  // Forward arrows
  values.forEach((_, i) => {
    if (i < values.length - 1) {
      const x1 = offsetX + i * (nodeW + gap) + nodeW - 9;
      const x2 = offsetX + (i + 1) * (nodeW + gap) + 3;
      els.push({ type: 'arrow', x1, y1: offsetY + nodeH/2 - 7, x2, y2: offsetY + nodeH/2 - 7, color: '#34d399', strokeWidth: 1 });
    }
  });
  // Backward arrows
  values.forEach((_, i) => {
    if (i > 0) {
      const x1 = offsetX + i * (nodeW + gap) + 3;
      const x2 = offsetX + (i - 1) * (nodeW + gap) + nodeW - 9;
      els.push({ type: 'arrow', x1, y1: offsetY + nodeH/2 + 7, x2, y2: offsetY + nodeH/2 + 7, color: '#f87171', strokeWidth: 1 });
    }
  });

  els.push(...makeTitle(offsetX + 90, offsetY - 14, 'Doubly Linked List'));
  return els;
}

function generateStack(offsetX = 80, offsetY = 30) {
  const els = [];
  const values = [9, 2, 5, 3, 7];
  const sW = 80, cH = 34;
  const baseY = offsetY + values.length * (cH + 2) + 10;

  values.forEach((v, i) => {
    const y = baseY - i * (cH + 2) - cH;
    els.push({ type: 'rect', x: offsetX, y, w: sW, h: cH, color: '#a78bfa', strokeWidth: 1.5 });
    els.push({ type: 'text', x: offsetX + sW/2 - (String(v).length > 1 ? 7 : 4), y: y + cH/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 14 });
    if (i === values.length - 1) {
      els.push({ type: 'arrow', x1: offsetX + sW + 5, y1: y + cH/2, x2: offsetX + sW + 30, y2: y + cH/2, color: '#a78bfa', strokeWidth: 1.5 });
      els.push({ type: 'text', x: offsetX + sW + 34, y: y + cH/2 + 5, text: 'top', color: '#a78bfa', fontSize: 11 });
    }
  });
  // Floor
  els.push({ type: 'line', x1: offsetX - 6, y1: baseY + 4, x2: offsetX + sW + 6, y2: baseY + 4, color: EDGE_COLOR, strokeWidth: 2 });
  els.push({ type: 'text', x: offsetX + sW + 34, y: baseY + 10, text: 'push↑  pop↓', color: '#52525b', fontSize: 10 });
  els.push(...makeTitle(offsetX + 10, offsetY - 6, 'Stack (LIFO)'));
  return els;
}

function generateQueue(offsetX = 40, offsetY = 80) {
  const els = [];
  const values = [1, 5, 3, 8, 2];
  const cW = 52, cH = 38;

  values.forEach((v, i) => {
    const x = offsetX + i * (cW + 2);
    els.push({ type: 'rect', x, y: offsetY, w: cW, h: cH, color: '#22d3ee', strokeWidth: 1.5 });
    els.push({ type: 'text', x: x + cW/2 - (String(v).length > 1 ? 7 : 4), y: offsetY + cH/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 14 });
  });

  // Enqueue arrow (right side)
  const endX = offsetX + values.length * (cW + 2);
  els.push({ type: 'arrow', x1: endX + 30, y1: offsetY + cH/2, x2: endX + 5, y2: offsetY + cH/2, color: '#34d399', strokeWidth: 1.5 });
  els.push({ type: 'text', x: endX + 34, y: offsetY + cH/2 + 5, text: 'enqueue', color: '#34d399', fontSize: 10 });

  // Dequeue arrow (left side)
  els.push({ type: 'arrow', x1: offsetX - 5, y1: offsetY + cH/2, x2: offsetX - 30, y2: offsetY + cH/2, color: '#f87171', strokeWidth: 1.5 });
  els.push({ type: 'text', x: offsetX - 58, y: offsetY + cH/2 + 5, text: 'dequeue', color: '#f87171', fontSize: 10 });

  els.push(...makeTitle(offsetX + 80, offsetY - 16, 'Queue (FIFO)'));
  return els;
}

function generateHeap(offsetX = 80, offsetY = 40) {
  const els = [];
  const nodes = [
    { x: 200, y: 40, label: '1' },
    { x: 120, y: 110, label: '3' },
    { x: 280, y: 110, label: '5' },
    { x: 80, y: 180, label: '7' },
    { x: 160, y: 180, label: '9' },
    { x: 240, y: 180, label: '8' },
    { x: 320, y: 180, label: '12' },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  edges.forEach(([a,b]) => els.push(...makeEdge(nodes[a].x+offsetX, nodes[a].y+offsetY, nodes[b].x+offsetX, nodes[b].y+offsetY)));
  nodes.forEach((n) => els.push(...makeNode(n.x+offsetX, n.y+offsetY, n.label, '#fbbf24')));
  els.push(...makeTitle(offsetX + 150, offsetY - 14, 'Min Heap'));
  const arr = [1,3,5,7,9,8,12];
  arr.forEach((v, i) => els.push(...makeArrayCell(offsetX + 40 + i * (CELL_W+2), offsetY + 240, v, i, '#fbbf24')));
  els.push({ type: 'text', x: offsetX + 38, y: offsetY + 232, text: 'Array:', color: '#52525b', fontSize: 10 });
  return els;
}

function generateMaxHeap(offsetX = 80, offsetY = 40) {
  const els = [];
  const nodes = [
    { x: 200, y: 40, label: '15' },
    { x: 120, y: 110, label: '12' },
    { x: 280, y: 110, label: '10' },
    { x: 80, y: 180, label: '8' },
    { x: 160, y: 180, label: '9' },
    { x: 240, y: 180, label: '6' },
    { x: 320, y: 180, label: '7' },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  edges.forEach(([a,b]) => els.push(...makeEdge(nodes[a].x+offsetX, nodes[a].y+offsetY, nodes[b].x+offsetX, nodes[b].y+offsetY)));
  nodes.forEach((n) => els.push(...makeNode(n.x+offsetX, n.y+offsetY, n.label, '#fb923c')));
  els.push(...makeTitle(offsetX + 150, offsetY - 14, 'Max Heap'));
  return els;
}

function generateArray(offsetX = 50, offsetY = 80) {
  const els = [];
  const values = [3, 7, 1, 9, 4, 6, 2, 8, 5];
  values.forEach((v, i) => els.push(...makeArrayCell(offsetX + i * (CELL_W + 2), offsetY, v, i)));
  els.push(...makeTitle(offsetX, offsetY - 16, 'Array'));
  els.push({ type: 'text', x: offsetX + 18, y: offsetY + CELL_H + 32, text: 'i', color: '#f87171', fontSize: 13 });
  els.push({ type: 'arrow', x1: offsetX + 22, y1: offsetY + CELL_H + 22, x2: offsetX + 22, y2: offsetY + CELL_H + 4, color: '#f87171', strokeWidth: 1.5 });
  els.push({ type: 'text', x: offsetX + (CELL_W+2)*4+18, y: offsetY + CELL_H + 32, text: 'j', color: '#34d399', fontSize: 13 });
  els.push({ type: 'arrow', x1: offsetX + (CELL_W+2)*4+22, y1: offsetY + CELL_H + 22, x2: offsetX + (CELL_W+2)*4+22, y2: offsetY + CELL_H + 4, color: '#34d399', strokeWidth: 1.5 });
  return els;
}

function generateTwoPointer(offsetX = 50, offsetY = 80) {
  const els = [];
  const values = [1, 3, 5, 7, 9, 11, 13];
  values.forEach((v, i) => {
    const x = offsetX + i * (CELL_W + 2);
    const isL = i === 0, isR = i === values.length - 1;
    const color = isL ? '#f87171' : isR ? '#34d399' : '#4f8ff7';
    els.push({ type: 'rect', x, y: offsetY, w: CELL_W, h: CELL_H, color, strokeWidth: isL || isR ? 2.5 : 1.5 });
    els.push({ type: 'text', x: x + CELL_W/2 - (String(v).length > 1 ? 7 : 4), y: offsetY + CELL_H/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 13 });
  });
  els.push({ type: 'arrow', x1: offsetX + CELL_W/2, y1: offsetY + CELL_H + 26, x2: offsetX + CELL_W/2, y2: offsetY + CELL_H + 5, color: '#f87171', strokeWidth: 2 });
  els.push({ type: 'text', x: offsetX + CELL_W/2 - 4, y: offsetY + CELL_H + 40, text: 'L', color: '#f87171', fontSize: 14 });
  const rx = offsetX + (values.length - 1) * (CELL_W + 2) + CELL_W / 2;
  els.push({ type: 'arrow', x1: rx, y1: offsetY + CELL_H + 26, x2: rx, y2: offsetY + CELL_H + 5, color: '#34d399', strokeWidth: 2 });
  els.push({ type: 'text', x: rx - 5, y: offsetY + CELL_H + 40, text: 'R', color: '#34d399', fontSize: 14 });
  els.push(...makeTitle(offsetX + 90, offsetY - 16, 'Two Pointer'));
  return els;
}

function generateSlidingWindow(offsetX = 50, offsetY = 80) {
  const els = [];
  const values = [2, 1, 5, 1, 3, 2, 4, 3];
  const winStart = 1, winSize = 3;

  values.forEach((v, i) => {
    const x = offsetX + i * (CELL_W + 2);
    const inWin = i >= winStart && i < winStart + winSize;
    const color = inWin ? '#fbbf24' : '#4f8ff7';
    els.push({ type: 'rect', x, y: offsetY, w: CELL_W, h: CELL_H, color, strokeWidth: inWin ? 2.5 : 1.5 });
    els.push({ type: 'text', x: x + CELL_W/2 - (String(v).length > 1 ? 7 : 4), y: offsetY + CELL_H/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 13 });
  });

  const wX1 = offsetX + winStart * (CELL_W + 2) - 3;
  const wX2 = offsetX + (winStart + winSize) * (CELL_W + 2) - 5;
  els.push({ type: 'line', x1: wX1, y1: offsetY - 6, x2: wX2, y2: offsetY - 6, color: '#fbbf24', strokeWidth: 2 });
  els.push({ type: 'line', x1: wX1, y1: offsetY - 6, x2: wX1, y2: offsetY, color: '#fbbf24', strokeWidth: 2 });
  els.push({ type: 'line', x1: wX2, y1: offsetY - 6, x2: wX2, y2: offsetY, color: '#fbbf24', strokeWidth: 2 });
  els.push({ type: 'text', x: wX1 + 14, y: offsetY - 10, text: 'window', color: '#fbbf24', fontSize: 10 });
  els.push(...makeTitle(offsetX + 80, offsetY - 28, 'Sliding Window'));
  return els;
}

function generateMatrix(offsetX = 50, offsetY = 50) {
  const els = [];
  const grid = [[1,2,3,4],[5,6,7,8],[9,10,11,12]];
  const cW = 42, cH = 34;

  grid.forEach((row, r) => {
    row.forEach((val, c) => {
      const x = offsetX + c * (cW + 1);
      const y = offsetY + r * (cH + 1);
      const isBorder = r === 0 || c === 0 || r === grid.length-1 || c === row.length-1;
      els.push({ type: 'rect', x, y, w: cW, h: cH, color: isBorder ? '#4f8ff7' : '#2a4a8a', strokeWidth: 1.5 });
      els.push({ type: 'text', x: x + cW/2 - (String(val).length > 1 ? 7 : 4), y: y + cH/2 + 5, text: String(val), color: LABEL_COLOR, fontSize: 12 });
    });
  });

  grid[0].forEach((_, c) => {
    els.push({ type: 'text', x: offsetX + c*(cW+1) + cW/2 - 4, y: offsetY - 8, text: String(c), color: '#52525b', fontSize: 10 });
  });
  grid.forEach((_, r) => {
    els.push({ type: 'text', x: offsetX - 14, y: offsetY + r*(cH+1) + cH/2 + 5, text: String(r), color: '#52525b', fontSize: 10 });
  });
  els.push(...makeTitle(offsetX + 50, offsetY - 22, '2D Matrix / Grid'));
  return els;
}

function generateHashMap(offsetX = 50, offsetY = 30) {
  const els = [];
  const entries = [
    { key: '"apple"', val: '5', slot: 0 },
    { key: '"bat"',   val: '3', slot: 1 },
    { key: '"cat"',   val: '8', slot: 2 },
    { key: '"dog"',   val: '1', slot: 3 },
    { key: '"egg"',   val: '6', slot: 4 },
  ];
  const bW = 40, bH = 30, kvW = 130;

  entries.forEach(({ key, val }, i) => {
    const y = offsetY + i * (bH + 4);
    els.push({ type: 'rect', x: offsetX, y, w: bW, h: bH, color: '#52525b', strokeWidth: 1 });
    els.push({ type: 'text', x: offsetX + bW/2 - 5, y: y + bH/2 + 5, text: String(i), color: '#71717a', fontSize: 12 });
    els.push({ type: 'arrow', x1: offsetX + bW + 2, y1: y + bH/2, x2: offsetX + bW + 16, y2: y + bH/2, color: '#52525b', strokeWidth: 1 });
    els.push({ type: 'rect', x: offsetX + bW + 18, y, w: kvW, h: bH, color: '#4f8ff7', strokeWidth: 1.5 });
    els.push({ type: 'line', x1: offsetX + bW + 18 + kvW/2, y1: y, x2: offsetX + bW + 18 + kvW/2, y2: y + bH, color: '#3a5a8a', strokeWidth: 1 });
    els.push({ type: 'text', x: offsetX + bW + 22, y: y + bH/2 + 5, text: key, color: '#93c5fd', fontSize: 11 });
    els.push({ type: 'text', x: offsetX + bW + 18 + kvW/2 + 8, y: y + bH/2 + 5, text: val, color: LABEL_COLOR, fontSize: 12 });
  });

  els.push({ type: 'text', x: offsetX + 4, y: offsetY - 8, text: 'idx', color: '#52525b', fontSize: 10 });
  els.push({ type: 'text', x: offsetX + bW + 30, y: offsetY - 8, text: 'key', color: '#93c5fd', fontSize: 10 });
  els.push({ type: 'text', x: offsetX + bW + 18 + kvW/2 + 10, y: offsetY - 8, text: 'value', color: LABEL_COLOR, fontSize: 10 });
  els.push(...makeTitle(offsetX + 60, offsetY - 22, 'Hash Map'));
  return els;
}

function generateMonotonicStack(offsetX = 50, offsetY = 30) {
  const els = [];
  const arr = [6, 2, 4, 1, 8, 3];
  const inStack = new Set([1, 4]);
  const cW = 44, cH = 32;

  arr.forEach((v, i) => {
    const x = offsetX + i * (cW + 2);
    const hilit = inStack.has(v);
    els.push({ type: 'rect', x, y: offsetY, w: cW, h: cH, color: hilit ? '#fbbf24' : '#4f8ff7', strokeWidth: hilit ? 2 : 1.5 });
    els.push({ type: 'text', x: x + cW/2 - (String(v).length > 1 ? 7 : 4), y: offsetY + cH/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 13 });
  });
  els.push({ type: 'text', x: offsetX, y: offsetY - 8, text: 'Input:', color: '#71717a', fontSize: 10 });

  const sX = offsetX + 30, sW = 56, sCH = 32;
  const stack = [1, 4];
  const sBaseY = offsetY + 90 + stack.length * (sCH + 2);
  stack.forEach((v, i) => {
    const y = sBaseY - i * (sCH + 2) - sCH;
    els.push({ type: 'rect', x: sX, y, w: sW, h: sCH, color: '#fbbf24', strokeWidth: 1.5 });
    els.push({ type: 'text', x: sX + sW/2 - (String(v).length > 1 ? 7 : 4), y: y + sCH/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 13 });
    if (i === stack.length - 1) {
      els.push({ type: 'text', x: sX + sW + 6, y: y + sCH/2 + 5, text: '← top', color: '#fbbf24', fontSize: 10 });
    }
  });
  els.push({ type: 'line', x1: sX - 4, y1: sBaseY + 2, x2: sX + sW + 4, y2: sBaseY + 2, color: EDGE_COLOR, strokeWidth: 2 });
  els.push({ type: 'text', x: sX - 6, y: offsetY + 80, text: 'Mono Stack:', color: '#71717a', fontSize: 10 });
  els.push(...makeTitle(offsetX + 80, offsetY - 18, 'Monotonic Stack'));
  return els;
}

function generateTrie(offsetX = 50, offsetY = 30) {
  const els = [];
  const r = 18;
  const nodes = [
    { x: 200, y: 30,  label: 'root', isEnd: false, isRoot: true },
    { x: 100, y: 90,  label: 'c',    isEnd: false },
    { x: 300, y: 90,  label: 'b',    isEnd: false },
    { x: 100, y: 155, label: 'a',    isEnd: false },
    { x: 300, y: 155, label: 'a',    isEnd: false },
    { x: 46,  y: 215, label: 't',    isEnd: true },
    { x: 100, y: 215, label: 'r',    isEnd: true },
    { x: 154, y: 215, label: 'n',    isEnd: true },
    { x: 266, y: 215, label: 't',    isEnd: true },
    { x: 340, y: 215, label: 'd',    isEnd: true },
  ];
  const edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[3,6],[3,7],[4,8],[4,9]];

  edges.forEach(([a,b]) => {
    const na = nodes[a], nb = nodes[b];
    els.push(...makeEdge(na.x+offsetX, na.y+offsetY, nb.x+offsetX, nb.y+offsetY));
  });
  nodes.forEach(({ x, y, label, isEnd, isRoot }) => {
    const color = isRoot ? '#4f8ff7' : isEnd ? '#34d399' : '#22d3ee';
    const nr = isRoot ? 24 : r;
    els.push({ type: 'circle', x: x+offsetX-nr, y: y+offsetY-nr, w: nr*2, h: nr*2, color, strokeWidth: isEnd ? 2.5 : 1.5 });
    const fw = label.length > 3 ? -14 : label.length > 2 ? -9 : label.length > 1 ? -6 : -4;
    els.push({ type: 'text', x: x+offsetX+fw, y: y+offsetY+5, text: label, color: LABEL_COLOR, fontSize: isRoot ? 11 : 13 });
    if (isEnd) {
      els.push({ type: 'circle', x: x+offsetX-nr-4, y: y+offsetY-nr-4, w: (nr+4)*2, h: (nr+4)*2, color: '#34d399', strokeWidth: 1 });
    }
  });
  els.push(...makeTitle(offsetX + 140, offsetY - 14, 'Trie / Prefix Tree'));
  return els;
}

function generateDeque(offsetX = 40, offsetY = 80) {
  const els = [];
  const values = [4, 1, 7, 3, 9];
  const cW = 52, cH = 38;

  values.forEach((v, i) => {
    const x = offsetX + i * (cW + 2);
    const isEdge = i === 0 || i === values.length - 1;
    els.push({ type: 'rect', x, y: offsetY, w: cW, h: cH, color: isEdge ? '#fb923c' : '#4f8ff7', strokeWidth: isEdge ? 2 : 1.5 });
    els.push({ type: 'text', x: x + cW/2 - (String(v).length > 1 ? 7 : 4), y: offsetY + cH/2 + 5, text: String(v), color: LABEL_COLOR, fontSize: 14 });
  });

  // Front double-arrow
  els.push({ type: 'arrow', x1: offsetX - 5, y1: offsetY + cH/2 - 7, x2: offsetX - 30, y2: offsetY + cH/2 - 7, color: '#fb923c', strokeWidth: 1.5 });
  els.push({ type: 'arrow', x1: offsetX - 30, y1: offsetY + cH/2 + 7, x2: offsetX - 5, y2: offsetY + cH/2 + 7, color: '#fb923c', strokeWidth: 1.5 });
  els.push({ type: 'text', x: offsetX - 34, y: offsetY + cH/2 + 18, text: 'front', color: '#fb923c', fontSize: 10 });

  // Rear double-arrow
  const endX = offsetX + values.length * (cW + 2);
  els.push({ type: 'arrow', x1: endX + 5, y1: offsetY + cH/2 - 7, x2: endX + 30, y2: offsetY + cH/2 - 7, color: '#fb923c', strokeWidth: 1.5 });
  els.push({ type: 'arrow', x1: endX + 30, y1: offsetY + cH/2 + 7, x2: endX + 5, y2: offsetY + cH/2 + 7, color: '#fb923c', strokeWidth: 1.5 });
  els.push({ type: 'text', x: endX + 14, y: offsetY + cH/2 + 18, text: 'rear', color: '#fb923c', fontSize: 10 });

  els.push(...makeTitle(offsetX + 90, offsetY - 16, 'Deque (Double-Ended Queue)'));
  return els;
}

// ── TEMPLATES registry ──

const TEMPLATES = [
  { key: 'bst',        label: 'BST',           icon: GitBranch,   generate: generateBST,              color: '#4f8ff7' },
  { key: 'dgraph',     label: 'Digraph',        icon: Share2,      generate: generateDirectedGraph,    color: '#22d3ee' },
  { key: 'ugraph',     label: 'Graph',          icon: Share2,      generate: generateUndirectedGraph,  color: '#34d399' },
  { key: 'stack',      label: 'Stack',          icon: Layers,      generate: generateStack,            color: '#a78bfa' },
  { key: 'queue',      label: 'Queue',          icon: AlignJustify,generate: generateQueue,            color: '#22d3ee' },
  { key: 'deque',      label: 'Deque',          icon: Columns,     generate: generateDeque,            color: '#fb923c' },
  { key: 'llist',      label: 'Linked List',    icon: ArrowRight,  generate: generateLinkedList,       color: '#a78bfa' },
  { key: 'dllist',     label: 'Doubly LL',      icon: GitMerge,    generate: generateDoublyLinkedList, color: '#a78bfa' },
  { key: 'heap',       label: 'Min Heap',       icon: Triangle,    generate: generateHeap,             color: '#fbbf24' },
  { key: 'maxheap',    label: 'Max Heap',       icon: ChevronDown, generate: generateMaxHeap,          color: '#fb923c' },
  { key: 'array',      label: 'Array',          icon: Hash,        generate: generateArray,            color: '#4f8ff7' },
  { key: 'twoptr',     label: 'Two Pointer',    icon: List,        generate: generateTwoPointer,       color: '#f87171' },
  { key: 'sliding',    label: 'Sliding Win.',   icon: LayoutGrid,  generate: generateSlidingWindow,    color: '#fbbf24' },
  { key: 'matrix',     label: 'Matrix',         icon: Grid,        generate: generateMatrix,           color: '#4f8ff7' },
  { key: 'hashmap',    label: 'Hash Map',       icon: Hash,        generate: generateHashMap,          color: '#4f8ff7' },
  { key: 'monostack',  label: 'Mono Stack',     icon: Workflow,    generate: generateMonotonicStack,   color: '#fbbf24' },
  { key: 'trie',       label: 'Trie',           icon: GitCommit,   generate: generateTrie,             color: '#22d3ee' },
];

// ── Component ──

export default function DSTemplates({ canvasAPI }) {
  if (!canvasAPI) return null;

  const handleInsert = (template) => {
    const groupId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const elements = template.generate().map((el) => ({ ...el, groupId }));
    canvasAPI.addElements(elements);
  };

  return (
    <div style={{
      display: 'flex', gap: 4, padding: '8px 10px', flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.015)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: '#4e4e58',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'flex', alignItems: 'center', marginRight: 4, whiteSpace: 'nowrap',
      }}>
        Insert DS
      </span>
      {TEMPLATES.map((t) => {
        const Icon = t.icon;
        return (
          <button key={t.key} onClick={() => handleInsert(t)} title={`Insert ${t.label} (drag to move after selecting)`} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 9px', borderRadius: 6,
            background: `${t.color}10`, border: `1px solid ${t.color}22`,
            color: t.color, fontSize: 11, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${t.color}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${t.color}10`; }}
          >
            <Icon size={10} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}
