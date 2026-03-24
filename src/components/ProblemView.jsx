import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen, PenTool, BarChart3, Edit2, ExternalLink,
  Lightbulb, List, Eye, Code2, Info, Footprints,
  Youtube, Keyboard, Sparkles, Zap, ChevronLeft, ChevronRight,
  Maximize2, X, Video,
} from 'lucide-react';
import { IconButton, DifficultyBadge, Select } from '@/components/ui/Primitives';
import CodePanel from '@/components/panels/CodePanel';
import MarkdownRenderer from '@/components/panels/MarkdownRenderer';
import { InterviewTimer, VizPanel, HintsPanel, ComplexityChart } from '@/components/panels/Widgets';
import VideoPlayer from '@/components/panels/VideoPlayer';
import DrawingCanvas from '@/components/panels/DrawingCanvas';
import DSTemplates from '@/components/panels/DSTemplates';
import { STATUSES, APPROACHES } from '@/lib/constants';
import VizSection from '@/components/viz-engine/VizSection';

// ── Helper ──
function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// ── TAB DEFINITIONS ──
const TABS = [
  { key: 'video',      label: 'Video',      icon: Youtube,    shortcut: '1', color: '#f87171' },
  { key: 'problem',    label: 'Problem',    icon: BookOpen,   shortcut: '2', color: '#4f8ff7' },
  { key: 'intuition',  label: 'Intuition',  icon: Lightbulb,  shortcut: '3', color: '#fbbf24' },
  { key: 'steps',      label: 'Steps',      icon: Footprints, shortcut: '4', color: '#a78bfa' },
  { key: 'algorithm',  label: 'Algorithm',  icon: List,       shortcut: '5', color: '#4f8ff7' },
  { key: 'code',       label: 'Code',       icon: Code2,      shortcut: '6', color: '#34d399' },
  { key: 'dryrun',     label: 'Dry Run',    icon: Eye,        shortcut: '7', color: '#a78bfa' },
  { key: 'notes',      label: 'Notes',      icon: PenTool,    shortcut: '8', color: '#fb923c' },
  { key: 'complexity', label: 'Complexity', icon: BarChart3,  shortcut: '9', color: '#22d3ee' },
];

// ── MAIN ──
export default function ProblemView({
  problem, onEdit, onStatusChange, onNotesChange,
  onVideoNotesChange, onVideoTimestampChange,
}) {
  const [solIdx, setSolIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('video');
  const [canvasAPI, setCanvasAPI] = useState(null);
  const [notesVideoOpen, setNotesVideoOpen] = useState(false);
  const [notesVideoH, setNotesVideoH] = useState(280);
  const notesVideoResizing = useRef(false);

  useEffect(() => { setSolIdx(0); setActiveTab('video'); setNotesVideoOpen(false); }, [problem?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (!problem) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9 && num <= TABS.length) { e.preventDefault(); switchTab(TABS[num - 1].key); return; }
      if (e.key === '[') { e.preventDefault(); const i = TABS.findIndex(t => t.key === activeTab); if (i > 0) switchTab(TABS[i-1].key); }
      if (e.key === ']') { e.preventDefault(); const i = TABS.findIndex(t => t.key === activeTab); if (i < TABS.length-1) switchTab(TABS[i+1].key); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, problem]);

  const switchTab = useCallback((key) => { setActiveTab(key); }, []);

  // Video resize in notes tab
  const onNotesVideoResizeStart = (e) => {
    e.preventDefault();
    notesVideoResizing.current = true;
    const startY = e.clientY, startH = notesVideoH;
    const onMove = (ev) => { if (notesVideoResizing.current) setNotesVideoH(Math.max(140, Math.min(520, startH + ev.clientY - startY))); };
    const onUp = () => { notesVideoResizing.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── EMPTY STATE ──
  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#0c0c10' }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 24, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(79,143,247,0.08), rgba(167,139,250,0.08))',
            border: '1px solid rgba(79,143,247,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={38} style={{ color: '#4f8ff7', opacity: 0.4 }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#e4e4e7', letterSpacing: '-0.03em', marginBottom: 8 }}>
            DSA Studio
          </div>
          <div style={{ fontSize: 14, color: '#52525b', marginBottom: 28, lineHeight: 1.7 }}>
            Select a problem from the sidebar to begin. Keyboard shortcuts available for fast navigation.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            {[['1–9', 'Switch tabs'], ['[ ]', 'Prev / Next tab']].map(([k, d]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#3f3f46' }}>
                <kbd style={kbdStyle}>{k}</kbd>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const solutions = problem.solutions || [];
  const sol = solutions[solIdx];

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: '#0c0c10' }}>
      {/* ── HEADER ── */}
      <div style={{
        padding: '14px 28px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
        flexShrink: 0,
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <h1 style={{
              fontSize: 22, fontWeight: 800, color: '#fafaf9',
              letterSpacing: '-0.035em', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{problem.name}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 6, marginRight: 6 }}>
              {problem.leetcode_url && (
                <a href={problem.leetcode_url} target="_blank" rel="noopener noreferrer" style={linkStyle('#fb923c')}>
                  <ExternalLink size={10} /> LC
                </a>
              )}
              {problem.gfg_url && (
                <a href={problem.gfg_url} target="_blank" rel="noopener noreferrer" style={linkStyle('#34d399')}>
                  <ExternalLink size={10} /> GFG
                </a>
              )}
              {problem.youtube_url && (
                <a href={problem.youtube_url} target="_blank" rel="noopener noreferrer" style={linkStyle('#f87171')}>
                  <Youtube size={10} /> YT
                </a>
              )}
            </div>
            <Select
              value={problem.status}
              onChange={onStatusChange}
              options={STATUSES.map((s) => ({ value: s.key, label: s.label }))}
            />
            <InterviewTimer />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />
            <IconButton icon={Edit2} onClick={onEdit} title="Edit problem" />
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 1, marginBottom: -1 }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                title={`${tab.label} (${tab.shortcut})`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: '8px 8px 0 0',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: active ? tab.color : '#4e4e58',
                  borderBottom: active ? `2px solid ${tab.color}` : '2px solid transparent',
                  transition: 'all 0.15s',
                  boxShadow: active ? `0 -1px 0 0 ${tab.color}15 inset` : 'none',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = '#4e4e58'; e.currentTarget.style.background = 'transparent'; } }}
              >
                <Icon size={14} style={{ opacity: active ? 1 : 0.55 }} />
                {tab.label}
                <span style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  padding: '1px 4px', borderRadius: 3,
                  color: active ? tab.color : '#35353d',
                  background: active ? `${tab.color}15` : 'transparent',
                  transition: 'all 0.15s',
                }}>{tab.shortcut}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Solution selector */}
      {solutions.length > 1 && ['intuition','steps','algorithm','code','dryrun'].includes(activeTab) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          padding: '7px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(255,255,255,0.015)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, color: '#3f3f46', fontWeight: 700, marginRight: 10, letterSpacing: '0.06em' }}>APPROACH</span>
          {solutions.map((s, i) => {
            const c = APPROACHES[s.approach_type] || APPROACHES.Optimal;
            const active = i === solIdx;
            return (
              <button key={s.id || i} onClick={() => setSolIdx(i)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 7,
                background: active ? c.bg : 'transparent',
                border: `1px solid ${active ? c.border : 'transparent'}`,
                color: active ? c.color : '#52525b',
                fontSize: 12.5, fontWeight: active ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, opacity: active ? 1 : 0.3 }} />
                {s.approach_type}
                {s.time_complexity && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.7 }}>{s.time_complexity}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── TAB CONTENT ── */}
      <div className="flex-1 overflow-hidden" style={{ position: 'relative' }}>
        <div className="tab-content-enter" key={activeTab} style={{ height: '100%', overflow: 'auto', animation: 'tabFadeIn 0.18s ease-out' }}>

          {/* VIDEO */}
          {activeTab === 'video' && (
            <VideoPlayer
              url={problem.youtube_url}
              videoNotes={problem.video_notes || []}
              onVideoNotesChange={onVideoNotesChange}
              videoTimestamp={problem.video_timestamp || 0}
              onVideoTimestampChange={onVideoTimestampChange}
              notes={problem.notes}
              onNotesChange={onNotesChange}
              solution={sol}
            />
          )}

          {/* PROBLEM */}
          {activeTab === 'problem' && (
            <div style={{ padding: 32, maxWidth: 920 }}>
              {problem.description && (
                <ContentSection icon={BookOpen} iconColor="#4f8ff7" iconBg="rgba(79,143,247,0.1)" title="Problem Statement">
                  <MarkdownRenderer content={problem.description} />
                </ContentSection>
              )}
              {problem.in_depth_explanation && (
                <ContentSection icon={Info} iconColor="#22d3ee" iconBg="rgba(34,211,238,0.1)" title="In-depth Explanation" style={{ marginTop: 28 }}>
                  <MarkdownRenderer content={problem.in_depth_explanation} />
                </ContentSection>
              )}
              {!problem.description && !problem.in_depth_explanation && (
                <EmptyTabState icon={BookOpen} message="No problem statement added yet" sub="Edit the problem to add a description" />
              )}
            </div>
          )}

          {/* INTUITION */}
          {activeTab === 'intuition' && (
            <div style={{ padding: 32, maxWidth: 920 }}>
              {sol?.intuition ? (
                <ContentSection icon={Lightbulb} iconColor="#fbbf24" iconBg="rgba(251,191,36,0.1)" title="Intuition">
                  <MarkdownRenderer content={sol.intuition} />
                </ContentSection>
              ) : (
                <EmptyTabState icon={Lightbulb} message="No intuition written yet" sub={solutions.length === 0 ? 'Add a solution first' : 'Edit the solution to add intuition'} />
              )}
              {sol?.hints?.length > 0 && <div style={{ marginTop: 28 }}><HintsPanel hints={sol.hints} /></div>}
            </div>
          )}

          {/* STEPS */}
          {activeTab === 'steps' && (
            <div style={{ padding: 32, maxWidth: 920 }}>
              {sol?.in_depth_intuition ? (
                <ContentSection icon={Footprints} iconColor="#a78bfa" iconBg="rgba(167,139,250,0.1)" title="Step-by-Step Walkthrough">
                  <MarkdownRenderer content={sol.in_depth_intuition} />
                </ContentSection>
              ) : (
                <EmptyTabState icon={Footprints} message="No step-by-step breakdown yet" sub="Edit the solution to add a walkthrough" />
              )}
            </div>
          )}

          {/* ALGORITHM */}
          {activeTab === 'algorithm' && (
            <div style={{ padding: 32, maxWidth: 920 }}>
              {sol?.algorithm ? (
                <ContentSection icon={List} iconColor="#4f8ff7" iconBg="rgba(79,143,247,0.1)" title="Algorithm">
                  <MarkdownRenderer content={sol.algorithm} />
                </ContentSection>
              ) : (
                <EmptyTabState icon={List} message="No algorithm documented yet" sub="Edit the solution to add the algorithm" />
              )}
            </div>
          )}

          {/* CODE */}
          {activeTab === 'code' && (
            <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {sol?.code ? (
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <CodePanel code={sol.code} language={sol.language || 'java'} visible onToggle={() => {}} />
                </div>
              ) : (
                <EmptyTabState icon={Code2} message="No code solution yet" sub="Edit the solution to add code" />
              )}
            </div>
          )}

          {/* DRY RUN */}
          {activeTab === 'dryrun' && (
            <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {sol?.visualization_html || sol?.code ? (
                <div style={{ flex: 1, minHeight: 0 }}>
                  <VizSection
                    vizHtml={sol.visualization_html}
                    code={sol.code}
                    intuition={sol.intuition}
                    stepsText={sol.in_depth_intuition}
                    approachType={sol.approach_type}
                  />
                </div>
              ) : (
                <EmptyTabState icon={Eye} message="No code or visualization available" sub="Edit the solution to add code for the viz engine" />
              )}
            </div>
          )}

          {/* NOTES — enhanced with optional video pane */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

              {/* Collapsible video panel */}
              {notesVideoOpen && problem.youtube_url && (
                <>
                  <div style={{ flexShrink: 0, height: notesVideoH, background: '#000', position: 'relative' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(problem.youtube_url)}?rel=0&modestbranding=1&enablejsapi=1&start=${Math.floor(problem.video_timestamp || 0)}`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <button
                      onClick={() => setNotesVideoOpen(false)}
                      title="Close video"
                      style={{
                        position: 'absolute', top: 8, right: 10,
                        padding: '4px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                        background: 'rgba(0,0,0,0.7)', color: '#a1a1aa', fontSize: 11,
                        display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit',
                      }}
                    >
                      <X size={11} /> Close
                    </button>
                  </div>
                  {/* Resize handle */}
                  <div
                    onMouseDown={onNotesVideoResizeStart}
                    style={{
                      height: 8, cursor: 'row-resize', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      background: 'rgba(255,255,255,0.01)',
                    }}
                  >
                    <div style={{ width: 32, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
                  </div>
                </>
              )}

              {/* Notes + Canvas split */}
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: Text notes */}
                <div style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{
                    padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.015)', flexShrink: 0,
                  }}>
                    <PenTool size={13} style={{ color: '#fb923c' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#a1a1aa' }}>Text Notes</span>
                    <span style={{ fontSize: 10, color: '#3f3f46', marginLeft: 'auto' }}>Markdown</span>

                    {/* Watch video toggle */}
                    {problem.youtube_url && (
                      <button
                        onClick={() => setNotesVideoOpen(!notesVideoOpen)}
                        title={notesVideoOpen ? 'Hide video' : 'Watch video while noting'}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                          background: notesVideoOpen ? 'rgba(248,113,113,0.15)' : 'rgba(248,113,113,0.08)',
                          color: notesVideoOpen ? '#f87171' : '#71717a',
                          fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                          transition: 'all 0.15s',
                          boxShadow: notesVideoOpen ? 'inset 0 0 0 1px rgba(248,113,113,0.25)' : 'none',
                        }}
                      >
                        <Video size={11} />
                        {notesVideoOpen ? 'Hide Video' : 'Watch + Note'}
                      </button>
                    )}
                  </div>
                  <textarea
                    value={problem.notes || ''}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Write notes, patterns, edge cases, mistakes to avoid...&#10;&#10;Tips:&#10;• Use ## for headings&#10;• Use ``` for code blocks&#10;• Use - for bullet points&#10;• Press 'Watch + Note' to watch video here"
                    style={{
                      flex: 1, width: '100%', background: 'transparent',
                      border: 'none', padding: '16px 18px', fontSize: 14, color: '#c4c4c9',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      resize: 'none', outline: 'none', lineHeight: 2,
                    }}
                  />
                </div>

                {/* Right: Drawing canvas */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{
                    padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.015)', flexShrink: 0,
                  }}>
                    <Eye size={13} style={{ color: '#a78bfa' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#a1a1aa' }}>Drawing Canvas</span>
                    <span style={{ fontSize: 10, color: '#3f3f46', marginLeft: 'auto' }}>
                      Select tool to move • Insert DS templates below
                    </span>
                  </div>
                  <DSTemplates canvasAPI={canvasAPI} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <DrawingCanvas onTemplateReady={setCanvasAPI} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPLEXITY */}
          {activeTab === 'complexity' && (
            <div style={{ overflow: 'auto', height: '100%' }}>
              {solutions.length > 0 ? (
                <ComplexityChart solutions={solutions} />
              ) : (
                <EmptyTabState icon={BarChart3} message="No solutions to compare" sub="Add solutions with time/space complexity" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.01)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 11, color: '#3f3f46' }}>
            {solutions.length} solution{solutions.length !== 1 ? 's' : ''}
          </span>
          {sol && (
            <span style={{ fontSize: 11, color: '#3f3f46' }}>
              {sol.approach_type} · {sol.time_complexity || '—'} / {sol.space_complexity || '—'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Keyboard size={10} style={{ color: '#2a2a33' }} />
          <span style={{ fontSize: 10, color: '#2a2a33' }}>
            <strong style={{ color: '#3f3f46' }}>1–9</strong> switch tabs ·{' '}
            <strong style={{ color: '#3f3f46' }}>[ ]</strong> prev/next
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──

function ContentSection({ icon: Icon, iconColor, iconBg, title, children, style = {} }) {
  return (
    <section style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: iconBg,
        }}>
          <Icon size={17} style={{ color: iconColor }} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#f0f0f2', letterSpacing: '-0.025em' }}>{title}</span>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.025)', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)', padding: '24px 28px',
      }}>
        {children}
      </div>
    </section>
  );
}

function EmptyTabState({ icon: Icon, message, sub }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: 400,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Icon size={26} style={{ opacity: 0.2, color: '#a1a1aa' }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#3f3f46', marginBottom: 6 }}>{message}</div>
      <div style={{ fontSize: 13, color: '#2a2a33' }}>{sub}</div>
    </div>
  );
}

const kbdStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '3px 8px', borderRadius: 5,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#71717a', fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 700, minWidth: 24,
};

function linkStyle(color) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 11, color, textDecoration: 'none', fontWeight: 700,
    padding: '4px 9px', borderRadius: 6,
    background: `${color}12`, border: `1px solid ${color}22`,
    transition: 'all 0.15s',
  };
}
