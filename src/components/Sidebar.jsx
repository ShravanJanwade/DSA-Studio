import { useState, useRef } from 'react';
import {
  ChevronDown, ChevronLeft, Plus, Search, Menu, Zap, Trash2,
  FolderOpen, Network, Brain, LayoutList, Crosshair, GitBranch, Type, Triangle,
  Upload, GripVertical, TrendingUp, Layers,
} from 'lucide-react';
import { IconButton } from '@/components/ui/Primitives';
import { STATUSES, DIFFICULTIES } from '@/lib/constants';

const ICON_MAP = {
  graph: Network, dp: Brain, array: LayoutList, search: Crosshair,
  tree: GitBranch, string: Type, heap: Triangle, stack: Layers, folder: FolderOpen,
};

// Icon background colors per category
const ICON_BG = {
  graph: 'rgba(34,211,238,0.12)', dp: 'rgba(167,139,250,0.12)', array: 'rgba(79,143,247,0.12)',
  search: 'rgba(251,191,36,0.12)', tree: 'rgba(52,211,153,0.12)', string: 'rgba(248,113,113,0.12)',
  heap: 'rgba(251,191,36,0.12)', stack: 'rgba(167,139,250,0.12)', folder: 'rgba(79,143,247,0.12)',
};
const ICON_COLOR = {
  graph: '#22d3ee', dp: '#a78bfa', array: '#4f8ff7', search: '#fbbf24',
  tree: '#34d399', string: '#f87171', heap: '#fbbf24', stack: '#a78bfa', folder: '#4f8ff7',
};

// ── Drag & Drop ──
function useDragReorder(items, onReorder) {
  const dragIdx = useRef(null);
  const dragOverIdx = useRef(null);

  const onDragStart = (idx) => (e) => {
    dragIdx.current = idx;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.4'; }, 0);
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    if (dragIdx.current !== null && dragOverIdx.current !== null && dragIdx.current !== dragOverIdx.current) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragIdx.current, 1);
      reordered.splice(dragOverIdx.current, 0, moved);
      onReorder(reordered.map((item) => item.id));
    }
    dragIdx.current = null;
    dragOverIdx.current = null;
  };

  const onDragOver = (idx) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverIdx.current = idx;
  };

  return { onDragStart, onDragEnd, onDragOver };
}

// ── Action Button ──
function ActionBtn({ icon: Icon, onClick, title, hoverColor = '#a1a1aa', danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: 5, borderRadius: 6, border: 'none', cursor: 'pointer',
        background: hov ? (danger ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.07)') : 'transparent',
        color: hov ? (danger ? '#f87171' : hoverColor) : '#35353d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
      }}
    >
      <Icon size={14} />
    </button>
  );
}

// ── SIDEBAR ──
export default function Sidebar({
  topics, selectedProblemId, onSelectProblem, onAddTopic, onAddSubtopic,
  onAddProblem, expandedTopics, expandedSubs, toggleTopic, toggleSub,
  search, setSearch, collapsed, setCollapsed, stats, onBulkUpload,
  onDeleteTopic, onDeleteSubtopic, onDeleteProblem,
  onReorderTopics, onReorderSubtopics, onReorderProblems,
}) {
  const topicDrag = useDragReorder(topics, onReorderTopics);

  return (
    <div
      className="flex flex-col h-full shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 56 : 300,
        background: '#09090d',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* ── Logo header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: collapsed ? '15px 12px' : '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        minHeight: 60, flexShrink: 0,
      }}>
        {!collapsed && (
          <>
            <div style={{
              width: 36, height: 36, borderRadius: 11, flexShrink: 0,
              background: 'linear-gradient(135deg, #4f8ff7 0%, #a78bfa 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(79,143,247,0.3)',
            }}>
              <Zap size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fafaf9', letterSpacing: '-0.04em', lineHeight: 1.2 }}>
                DSA Studio
              </div>
              <div style={{ fontSize: 10.5, color: '#3f3f46', letterSpacing: '0.04em', marginTop: 1, fontWeight: 500 }}>
                Interview Prep
              </div>
            </div>
          </>
        )}
        <IconButton icon={collapsed ? Menu : ChevronLeft} onClick={() => setCollapsed(!collapsed)} size={17} />
      </div>

      {collapsed ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 16 }}>
          <IconButton icon={Search} onClick={() => setCollapsed(false)} size={17} />
          <IconButton icon={Plus} onClick={() => { setCollapsed(false); onAddTopic(); }} size={17} />
        </div>
      ) : (
        <>
          {/* Search */}
          <div style={{ padding: '12px 14px 8px', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: 10, color: '#3f3f46', pointerEvents: 'none' }} />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems..."
                style={{
                  width: '100%', background: '#111116',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
                  paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                  fontSize: 13.5, color: '#b8b8be', outline: 'none', fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Topic tree */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 8px' }}>
            {topics.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#2a2a33' }}>
                <TrendingUp size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>No topics yet</div>
                <div style={{ fontSize: 12 }}>Click "+ New topic" to get started</div>
              </div>
            )}
            {topics.map((topic, tIdx) => (
              <TopicNode
                key={topic.id}
                topic={topic} idx={tIdx}
                selectedProblemId={selectedProblemId}
                onSelectProblem={onSelectProblem}
                onAddSubtopic={onAddSubtopic}
                onAddProblem={onAddProblem}
                expanded={expandedTopics.has(topic.id)}
                expandedSubs={expandedSubs}
                toggleTopic={toggleTopic} toggleSub={toggleSub}
                search={search}
                onBulkUpload={onBulkUpload}
                onDeleteTopic={onDeleteTopic}
                onDeleteSubtopic={onDeleteSubtopic}
                onDeleteProblem={onDeleteProblem}
                onReorderSubtopics={onReorderSubtopics}
                onReorderProblems={onReorderProblems}
                topicDrag={topicDrag}
              />
            ))}
          </div>

          {/* Add topic */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            <button
              onClick={onAddTopic}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 10,
                border: '1px dashed rgba(255,255,255,0.08)', background: 'transparent',
                color: '#3f3f46', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(79,143,247,0.35)'; e.currentTarget.style.color = '#4f8ff7'; e.currentTarget.style.background = 'rgba(79,143,247,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#3f3f46'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Plus size={15} /> New topic
            </button>
          </div>

          {/* Stats */}
          {stats && stats.total > 0 && (
            <div style={{ padding: '0 14px 16px', flexShrink: 0 }}>
              <div style={{
                background: '#101014', borderRadius: 12, padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Progress</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#b8b8be', fontVariantNumeric: 'tabular-nums' }}>{stats.pct}%</span>
                </div>
                <div style={{ height: 7, background: '#1a1a22', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                  <div style={{
                    height: '100%', width: `${stats.pct}%`,
                    background: 'linear-gradient(90deg, #4f8ff7, #34d399)',
                    borderRadius: 4, transition: 'width 0.6s ease',
                    boxShadow: '0 0 10px rgba(79,143,247,0.4)',
                  }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                  {STATUSES.map((s) => (
                    <div key={s.key} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: 18, fontWeight: 800, color: s.dot,
                        fontVariantNumeric: 'tabular-nums', lineHeight: 1.2,
                      }}>{stats[s.key] || 0}</div>
                      <div style={{ fontSize: 9.5, color: '#35353d', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {s.label.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── TOPIC NODE ──
function TopicNode({
  topic, idx, selectedProblemId, onSelectProblem, onAddSubtopic, onAddProblem,
  expanded, expandedSubs, toggleTopic, toggleSub, search, onBulkUpload,
  onDeleteTopic, onDeleteSubtopic, onDeleteProblem,
  onReorderSubtopics, onReorderProblems, topicDrag,
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[topic.icon] || FolderOpen;
  const iconKey = topic.icon || 'folder';
  const cnt = (topic.subtopics || []).reduce((a, s) => a + (s.problems || []).length, 0);
  const hasMatch = (topic.subtopics || []).some((sub) =>
    (sub.problems || []).some((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
  );
  if (search && !hasMatch) return null;
  const exp = expanded || !!search;
  const subDrag = useDragReorder(topic.subtopics || [], (orderedIds) => onReorderSubtopics(topic.id, orderedIds));

  return (
    <div style={{ marginBottom: 4 }}
      draggable onDragStart={topicDrag.onDragStart(idx)}
      onDragEnd={topicDrag.onDragEnd} onDragOver={topicDrag.onDragOver(idx)}>
      <div
        onClick={() => toggleTopic(topic.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '9px 10px', borderRadius: 10, cursor: 'pointer',
          background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
          transition: 'background 0.12s',
        }}
      >
        <span style={{ color: '#2a2a33', cursor: 'grab', display: 'flex', flexShrink: 0 }}
          onMouseDown={(e) => e.stopPropagation()}>
          <GripVertical size={13} />
        </span>
        <span style={{
          color: '#3f3f46', transition: 'transform 0.15s',
          transform: exp ? 'rotate(0deg)' : 'rotate(-90deg)', display: 'flex',
        }}>
          <ChevronDown size={14} />
        </span>
        {/* Category icon with colored background */}
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: ICON_BG[iconKey] || ICON_BG.folder,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} style={{ color: ICON_COLOR[iconKey] || ICON_COLOR.folder }} />
        </div>
        <span style={{
          flex: 1, fontSize: 14.5, fontWeight: 700, color: '#e4e4e7',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
        }}>{topic.name}</span>
        <span style={{
          fontSize: 11, color: '#35353d', background: '#18181e',
          padding: '2px 8px', borderRadius: 10, fontWeight: 700,
          fontVariantNumeric: 'tabular-nums', flexShrink: 0,
        }}>{cnt}</span>
        {hovered && (
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            <ActionBtn icon={Plus} onClick={(e) => { e.stopPropagation(); onAddSubtopic(topic.id); }} title="Add subtopic" hoverColor="#4f8ff7" />
            <ActionBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); if (confirm(`Delete topic "${topic.name}" and all its contents?`)) onDeleteTopic(topic.id); }} title="Delete topic" danger />
          </div>
        )}
      </div>
      {exp && (
        <div style={{ marginLeft: 22, paddingLeft: 14, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          {(topic.subtopics || []).map((sub, sIdx) => (
            <SubtopicNode
              key={sub.id}
              sub={sub} idx={sIdx} topicId={topic.id}
              selectedProblemId={selectedProblemId}
              onSelectProblem={onSelectProblem}
              onAddProblem={onAddProblem}
              expanded={expandedSubs.has(sub.id)}
              toggleSub={toggleSub}
              search={search}
              onBulkUpload={onBulkUpload}
              onDeleteSubtopic={onDeleteSubtopic}
              onDeleteProblem={onDeleteProblem}
              onReorderProblems={onReorderProblems}
              subDrag={subDrag}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── SUBTOPIC NODE ──
function SubtopicNode({
  sub, idx, topicId, selectedProblemId, onSelectProblem, onAddProblem,
  expanded, toggleSub, search, onBulkUpload,
  onDeleteSubtopic, onDeleteProblem, onReorderProblems, subDrag,
}) {
  const [hovered, setHovered] = useState(false);
  const filtered = (sub.problems || []).filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );
  if (search && !filtered.length) return null;
  const exp = expanded || !!search;
  const probDrag = useDragReorder(filtered, (orderedIds) => onReorderProblems(sub.id, orderedIds));

  return (
    <div style={{ marginBottom: 2 }}
      draggable onDragStart={subDrag.onDragStart(idx)}
      onDragEnd={subDrag.onDragEnd} onDragOver={subDrag.onDragOver(idx)}>
      <div
        onClick={() => toggleSub(sub.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '7px 9px', borderRadius: 8, cursor: 'pointer',
          background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
          transition: 'background 0.12s',
        }}
      >
        <span style={{ color: '#2a2a33', cursor: 'grab', display: 'flex', flexShrink: 0 }}
          onMouseDown={(e) => e.stopPropagation()}>
          <GripVertical size={11} />
        </span>
        <span style={{
          color: exp ? '#52525b' : '#3f3f46', transition: 'transform 0.15s',
          transform: exp ? 'rotate(0deg)' : 'rotate(-90deg)', display: 'flex',
        }}>
          <ChevronDown size={12} />
        </span>
        <span style={{
          flex: 1, fontSize: 13.5, color: '#7c7c85', fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{sub.name}</span>
        <span style={{
          fontSize: 10, color: '#2a2a33', background: '#14141a',
          padding: '1px 6px', borderRadius: 8, fontWeight: 600,
          fontVariantNumeric: 'tabular-nums', flexShrink: 0,
        }}>{filtered.length}</span>
        {hovered && (
          <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <ActionBtn icon={Upload} onClick={(e) => { e.stopPropagation(); onBulkUpload(topicId, sub.id); }} title="Bulk upload" hoverColor="#4f8ff7" />
            <ActionBtn icon={Plus} onClick={(e) => { e.stopPropagation(); onAddProblem(topicId, sub.id); }} title="Add problem" hoverColor="#34d399" />
            <ActionBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); if (confirm(`Delete subtopic "${sub.name}"?`)) onDeleteSubtopic(sub.id); }} title="Delete subtopic" danger />
          </div>
        )}
      </div>
      {exp && (
        <div style={{ marginLeft: 10 }}>
          {filtered.map((prob, pIdx) => (
            <ProblemItem
              key={prob.id}
              prob={prob} idx={pIdx}
              active={selectedProblemId === prob.id}
              topicId={topicId} subId={sub.id}
              onSelectProblem={onSelectProblem}
              onDeleteProblem={onDeleteProblem}
              probDrag={probDrag}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── PROBLEM ITEM ──
function ProblemItem({ prob, idx, active, topicId, subId, onSelectProblem, onDeleteProblem, probDrag }) {
  const [hovered, setHovered] = useState(false);
  const status = STATUSES.find((s) => s.key === prob.status) || STATUSES[0];
  const diff = DIFFICULTIES[prob.difficulty] || DIFFICULTIES.Easy;

  return (
    <div
      draggable
      onDragStart={probDrag.onDragStart(idx)}
      onDragEnd={probDrag.onDragEnd}
      onDragOver={probDrag.onDragOver(idx)}
      onClick={() => onSelectProblem(prob.id, topicId, subId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
        transition: 'all 0.15s', marginBottom: 2,
        background: active
          ? 'rgba(79,143,247,0.12)'
          : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: active
          ? '1px solid rgba(79,143,247,0.25)'
          : '1px solid transparent',
        boxShadow: active ? '0 0 0 1px rgba(79,143,247,0.05)' : 'none',
      }}
    >
      <span style={{ color: '#1a1a20', cursor: 'grab', display: 'flex', flexShrink: 0 }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#3f3f46'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#1a1a20'; }}>
        <GripVertical size={11} />
      </span>
      {/* Status dot */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%', background: status.dot, flexShrink: 0,
        boxShadow: active ? `0 0 0 2px #0c0c10, 0 0 0 3px ${status.ring}` : `0 0 0 2px #0c0c10, 0 0 0 3px ${status.ring}55`,
      }} />
      {/* Name */}
      <span style={{
        flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        color: active ? '#93c5fd' : hovered ? '#c4c4c9' : '#a1a1aa',
        fontWeight: active ? 700 : 400,
      }}>{prob.name}</span>
      {/* Difficulty */}
      <span style={{
        fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 8, flexShrink: 0,
        color: diff.color, background: diff.bg, border: `1px solid ${diff.border}`,
      }}>{prob.difficulty[0]}</span>
      {hovered && (
        <ActionBtn icon={Trash2}
          onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${prob.name}"?`)) onDeleteProblem(prob.id); }}
          title="Delete" danger />
      )}
    </div>
  );
}
