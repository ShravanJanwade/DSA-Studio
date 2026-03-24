import { useState } from 'react';
import { Eye, Cpu, Sparkles } from 'lucide-react';
import { VizPanel } from '@/components/panels/Widgets';
import VizEngine from '@/components/viz-engine/VizEngine';

export default function VizSection({ vizHtml, code, intuition, stepsText, approachType }) {
  const [tab, setTab] = useState(vizHtml ? 'html' : 'engine');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexShrink: 0, alignItems: 'center' }}>
        {vizHtml && <TabBtn active={tab === 'html'} onClick={() => setTab('html')} icon={Eye} label="Uploaded Viz" />}
        <TabBtn active={tab === 'engine'} onClick={() => setTab('engine')} icon={Cpu} label="Viz Engine" />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#2a2a33' }}>
          <Sparkles size={10} />
          {tab === 'engine' ? 'Executes your code step-by-step' : 'Custom HTML visualization'}
        </div>
      </div>
      {tab === 'html' && vizHtml && (
        <div style={{
          background: '#0e0e12', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', flex: 1,
        }}>
          <VizPanel html={vizHtml} />
        </div>
      )}
      {tab === 'engine' && (
        <div style={{
          background: '#0e0e12', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)', padding: 18, flex: 1, overflowY: 'auto',
        }}>
          <VizEngine code={code} intuition={intuition} stepsText={stepsText} approachType={approachType} />
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 8,
      background: active ? 'rgba(79,143,247,0.12)' : 'transparent',
      border: `1px solid ${active ? 'rgba(79,143,247,0.25)' : 'rgba(255,255,255,0.06)'}`,
      color: active ? '#93c5fd' : '#52525b', fontSize: 12, fontWeight: active ? 650 : 500,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
    }}><Icon size={13} /> {label}</button>
  );
}
