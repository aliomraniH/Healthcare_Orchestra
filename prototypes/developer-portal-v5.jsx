import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// HEALTHCARE ORCHESTRA - DEVELOPER PORTAL v5.0
// Features: App Simulation, Settings/MCP, Credentials, Compliance Center
// ============================================================================

const LAYERS = {
  'L-1': { id: 'L-1', name: 'Discovery Layer', short: 'Discovery', emoji: '🔍', color: 'violet' },
  'L0': { id: 'L0', name: 'Meta Layer', short: 'Meta', emoji: '🔮', color: 'cyan' },
  'L3': { id: 'L3', name: 'Payer Layer', short: 'Payer', emoji: '🏢', color: 'emerald' },
  'L4': { id: 'L4', name: 'Admin Layer', short: 'Admin', emoji: '🏥', color: 'blue' },
  'L5': { id: 'L5', name: 'Provider Layer', short: 'Provider', emoji: '👨‍⚕️', color: 'orange' },
  'L6': { id: 'L6', name: 'Patient Layer', short: 'Patient', emoji: '👤', color: 'pink' },
  'agents': { id: 'agents', name: 'Agents Layer', short: 'Agents', emoji: '🤖', color: 'yellow' },
  'context': { id: 'context', name: 'Context Layer', short: 'Context', emoji: '📚', color: 'purple' },
  'data': { id: 'data', name: 'Data Layer', short: 'Data', emoji: '🗄️', color: 'slate' }
};

const TEMPLATES = [
  { id: 'patient-portal', name: 'Patient Portal', layer: 'L6', desc: 'Mobile-first patient engagement', features: ['Visit status', 'Cost estimates', 'Care gaps'], apis: ['Patient', 'Appointment', 'Coverage'], agents: ['gap', 'cost'], complexity: 'Starter', time: '2-3 hrs', stars: 847 },
  { id: 'ambient-scribe', name: 'Ambient Scribe', layer: 'L5', desc: 'AI clinical documentation', features: ['Transcription', 'SOAP generation', 'Auto-coding'], apis: ['Encounter', 'Condition', 'Transcription'], agents: ['doc', 'code', 'awv'], complexity: 'Advanced', time: '6-8 hrs', stars: 1243 },
  { id: 'rx-assistant', name: 'Rx Assistant', layer: 'L5', desc: 'Medication management', features: ['Drug interactions', 'Formulary check', 'E-prescribe'], apis: ['MedicationRequest', 'AllergyIntolerance'], agents: ['drug'], complexity: 'Intermediate', time: '4-5 hrs', stars: 632 },
  { id: 'quality-dashboard', name: 'Quality Dashboard', layer: 'L4', desc: 'HEDIS/Stars tracking', features: ['HEDIS measures', 'Stars tracking', 'Care gaps'], apis: ['MeasureReport', 'DenialRisk'], agents: ['quality', 'denial', 'gap'], complexity: 'Intermediate', time: '5-6 hrs', stars: 521 },
  { id: 'prior-auth', name: 'Prior Auth Portal', layer: 'L3', desc: 'Automated prior authorization', features: ['Auto-justification', 'Status tracking', 'Appeals'], apis: ['Claim', 'PriorAuth'], agents: ['pa', 'appeal'], complexity: 'Advanced', time: '6-8 hrs', stars: 934 },
  { id: 'claims-intelligence', name: 'Claims Intelligence', layer: 'L3', desc: 'Claims management', features: ['Auto-adjudication', 'Denial prediction'], apis: ['Claim', 'Adjudicate'], agents: ['denial', 'quality'], complexity: 'Expert', time: '10-12 hrs', stars: 412 }
];

const EXAMPLE_APPS = [
  { id: 'demo-patient', name: 'MyHealth Portal', template: 'patient-portal', layer: 'L6', screenshot: '🏥', status: 'live', metrics: { users: '12,847', sessions: '45.2K/mo', satisfaction: '4.8/5' }, version: 'v2.4.1', uptime: '99.97%' },
  { id: 'demo-scribe', name: 'AmbientDoc Pro', template: 'ambient-scribe', layer: 'L5', screenshot: '🎙️', status: 'live', metrics: { encounters: '8,432', accuracy: '97.2%', timeSaved: '2.3 hrs/day' }, version: 'v3.1.0', uptime: '99.99%' },
  { id: 'demo-auth', name: 'AuthFlow', template: 'prior-auth', layer: 'L3', screenshot: '📋', status: 'live', metrics: { requests: '3,291', approvalRate: '94.1%', avgTime: '1.2 days' }, version: 'v1.8.3', uptime: '99.95%' },
  { id: 'demo-quality', name: 'QualityPulse', template: 'quality-dashboard', layer: 'L4', screenshot: '📊', status: 'live', metrics: { measures: '47', providers: '234', starsScore: '4.2★' }, version: 'v2.0.5', uptime: '99.98%' },
  { id: 'demo-rx', name: 'RxGuard', template: 'rx-assistant', layer: 'L5', screenshot: '💊', status: 'live', metrics: { prescriptions: '15,672', interactions: '847', formularyHits: '92%' }, version: 'v1.5.2', uptime: '99.96%' },
  { id: 'demo-claims', name: 'ClaimsSmart', template: 'claims-intelligence', layer: 'L3', screenshot: '💰', status: 'beta', metrics: { claims: '28,493', cleanRate: '96.8%', denialReduction: '34%' }, version: 'v0.9.1', uptime: '99.91%' }
];

const AGENTS = [
  { id: 'doc', name: 'Documentation Agent', desc: 'Generates SOAP notes', status: 'active', accuracy: '97.2%', layer: 'L5', calls: '12.4K/day', latency: '234ms' },
  { id: 'code', name: 'Code Assist', desc: 'ICD-10/CPT suggestions', status: 'active', accuracy: '95.8%', layer: 'L5', calls: '8.7K/day', latency: '178ms' },
  { id: 'awv', name: 'AWV Compliance', desc: 'AWV component tracking', status: 'active', accuracy: '98.5%', layer: 'L5', calls: '2.1K/day', latency: '89ms' },
  { id: 'pa', name: 'PA Automator', desc: 'Prior auth justifications', status: 'active', accuracy: '94.1%', layer: 'L3', calls: '5.3K/day', latency: '312ms' },
  { id: 'denial', name: 'Denial Predictor', desc: 'Claim denial prediction', status: 'active', accuracy: '91.3%', layer: 'L4', calls: '15.2K/day', latency: '145ms' },
  { id: 'gap', name: 'Care Gap Agent', desc: 'Patient care gaps', status: 'active', accuracy: '93.7%', layer: 'L6', calls: '6.8K/day', latency: '156ms' },
  { id: 'quality', name: 'Quality Measures', desc: 'HEDIS/Stars metrics', status: 'active', accuracy: '96.4%', layer: 'L4', calls: '4.2K/day', latency: '198ms' },
  { id: 'cost', name: 'Cost Calculator', desc: 'Cost estimation', status: 'active', accuracy: '89.2%', layer: 'L6', calls: '9.1K/day', latency: '156ms' },
  { id: 'drug', name: 'Drug Interaction', desc: 'Medication interactions', status: 'active', accuracy: '99.1%', layer: 'L5', calls: '7.4K/day', latency: '67ms' },
  { id: 'appeal', name: 'Appeal Writer', desc: 'Denial appeal letters', status: 'beta', accuracy: '87.5%', layer: 'L3', calls: '1.2K/day', latency: '456ms' }
];

const APIS = {
  'L6': [{ name: 'Patient', method: 'GET', path: '/fhir/Patient/{id}' }, { name: 'Appointment', method: 'GET', path: '/fhir/Appointment' }, { name: 'CareGaps', method: 'GET', path: '/api/v1/care-gaps' }],
  'L5': [{ name: 'Encounter', method: 'POST', path: '/fhir/Encounter' }, { name: 'Transcription', method: 'POST', path: '/api/v1/transcribe' }, { name: 'CodeSuggest', method: 'POST', path: '/api/v1/code-suggest' }],
  'L4': [{ name: 'MeasureReport', method: 'GET', path: '/fhir/MeasureReport' }, { name: 'DenialRisk', method: 'POST', path: '/api/v1/denial-risk' }],
  'L3': [{ name: 'Claim', method: 'POST', path: '/fhir/Claim' }, { name: 'PriorAuth', method: 'POST', path: '/api/v1/prior-auth' }, { name: 'Adjudicate', method: 'POST', path: '/api/v1/adjudicate' }]
};

const INTEGRATIONS = {
  ehr: [{ id: 'epic', name: 'Epic MyChart', icon: '🏥', status: 'connected', desc: 'EHR via FHIR R4' }, { id: 'cerner', name: 'Oracle Cerner', icon: '🔷', status: 'available', desc: 'Millennium FHIR' }],
  payer: [{ id: 'availity', name: 'Availity', icon: '🔗', status: 'connected', desc: 'Multi-payer connectivity' }, { id: 'changehc', name: 'Change Healthcare', icon: '🔄', status: 'available', desc: 'Claims clearinghouse' }],
  mcp: [{ id: 'mcp-fhir', name: 'FHIR MCP Server', icon: '🔥', status: 'connected', desc: 'MCP for FHIR resources' }, { id: 'mcp-ehr', name: 'EHR MCP Bridge', icon: '🌉', status: 'connected', desc: 'Bidirectional EHR sync' }, { id: 'mcp-claims', name: 'Claims MCP', icon: '📄', status: 'available', desc: 'Real-time claims' }],
  analytics: [{ id: 'snowflake', name: 'Snowflake', icon: '❄️', status: 'connected', desc: 'Data warehouse' }, { id: 'databricks', name: 'Databricks', icon: '🧱', status: 'available', desc: 'Lakehouse' }]
};

const AUDIT_LOGS = [
  { id: '1', timestamp: '2025-01-30 14:32:15', user: 'dr.martinez@clinic.com', action: 'PHI_ACCESS', resource: 'Patient/MCH-2024-7892', ip: '192.168.1.45', status: 'success' },
  { id: '2', timestamp: '2025-01-30 14:28:03', user: 'nurse.chen@clinic.com', action: 'RECORD_UPDATE', resource: 'Observation/vitals-123', ip: '192.168.1.67', status: 'success' },
  { id: '3', timestamp: '2025-01-30 14:15:42', user: 'system@orchestra.ai', action: 'AUTO_CODE', resource: 'Encounter/enc-456', ip: 'internal', status: 'success' },
  { id: '4', timestamp: '2025-01-30 13:58:21', user: 'billing@clinic.com', action: 'CLAIM_SUBMIT', resource: 'Claim/clm-789', ip: '192.168.1.23', status: 'success' },
  { id: '5', timestamp: '2025-01-30 13:45:08', user: 'dr.martinez@clinic.com', action: 'PHI_EXPORT', resource: 'Patient/MCH-2024-7892', ip: '192.168.1.45', status: 'flagged' }
];

const COMPLIANCE_REPORTS = [
  { id: '1', name: 'HIPAA Compliance Summary', type: 'hipaa', date: '2025-01-30', status: 'passed', score: 98, items: 47 },
  { id: '2', name: 'PHI Access Audit', type: 'phi', date: '2025-01-29', status: 'passed', score: 100, items: 234 },
  { id: '3', name: 'Security Controls Review', type: 'security', date: '2025-01-28', status: 'passed', score: 95, items: 32 }
];

const getColor = (color) => {
  const colors = {
    violet: { bg: 'bg-violet-500/20', border: 'border-violet-500/50', text: 'text-violet-400', solid: 'bg-violet-500', gradient: 'from-violet-500 to-violet-600' },
    cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', solid: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-600' },
    emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', solid: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600' },
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', solid: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
    orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', solid: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
    pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400', solid: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600' },
    yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', solid: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600' },
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', solid: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
    slate: { bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-400', solid: 'bg-slate-500', gradient: 'from-slate-500 to-slate-600' },
    green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', solid: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
    red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', solid: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
    gray: { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400', solid: 'bg-gray-500', gradient: 'from-gray-500 to-gray-600' }
  };
  return colors[color] || colors.gray;
};

// UI Components
const Badge = ({ children, color = 'gray', size = 'sm', dot }) => {
  const c = getColor(color);
  const sizes = { xs: 'px-1.5 py-0.5 text-[9px]', sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-1 text-xs' };
  return <span className={`${c.bg} ${c.text} border ${c.border} ${sizes[size]} rounded-full font-medium inline-flex items-center gap-1`}>{dot && <span className={`w-1.5 h-1.5 rounded-full ${c.solid}`} />}{children}</span>;
};

const Button = ({ children, variant = 'primary', size = 'md', disabled, onClick, className = '' }) => {
  const variants = { primary: 'bg-violet-500 hover:bg-violet-600 text-white', secondary: 'bg-gray-700 hover:bg-gray-600 text-white', outline: 'bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300', ghost: 'bg-transparent hover:bg-gray-800 text-gray-400', gradient: 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white', success: 'bg-green-500 hover:bg-green-600 text-white', danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50' };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return <button onClick={onClick} disabled={disabled} className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-all disabled:opacity-50 ${className}`}>{children}</button>;
};

const Card = ({ children, className = '', hover = false, onClick, selected = false }) => (
  <div onClick={onClick} className={`bg-gray-800/50 rounded-xl border ${selected ? 'border-violet-500' : 'border-gray-700'} ${hover ? 'hover:border-gray-600 cursor-pointer' : ''} transition-all ${className}`}>{children}</div>
);

const Input = ({ value, onChange, placeholder, className = '', icon, type = 'text' }) => (
  <div className="relative">
    {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 ${icon ? 'pl-10' : ''} ${className}`} />
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex border-b border-gray-800">
    {tabs.map(tab => (
      <button key={tab.id} onClick={() => onChange(tab.id)} className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${active === tab.id ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}`}>
        {tab.icon && <span>{tab.icon}</span>}{tab.label}
        {tab.badge && <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[9px] rounded-full">{tab.badge}</span>}
      </button>
    ))}
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button onClick={() => onChange(!enabled)} className="flex items-center">
    <div className={`w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-violet-500' : 'bg-gray-700'} relative`}>
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${enabled ? 'left-5' : 'left-1'}`} />
    </div>
  </button>
);

const LayerItem = ({ layer, active, onClick, collapsed }) => {
  const config = LAYERS[layer];
  const c = getColor(config.color);
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${active ? `${c.bg} border ${c.border}` : 'hover:bg-gray-800/50'}`}>
      <span className="text-lg">{config.emoji}</span>
      {!collapsed && <span className={`text-sm font-medium ${active ? c.text : 'text-gray-300'}`}>{config.short}</span>}
    </button>
  );
};

const TemplateCard = ({ template, selected, onSelect }) => {
  const layer = LAYERS[template.layer];
  const c = getColor(layer.color);
  const complexityColor = { Starter: 'green', Intermediate: 'yellow', Advanced: 'orange', Expert: 'red' };
  return (
    <Card hover onClick={() => onSelect(template)} selected={selected} className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{layer.emoji}</span>
          <div><h3 className={`font-semibold ${selected ? c.text : 'text-white'}`}>{template.name}</h3><p className="text-gray-500 text-xs">{layer.name}</p></div>
        </div>
        <Badge color={complexityColor[template.complexity]}>{template.complexity}</Badge>
      </div>
      <p className="text-gray-400 text-sm mb-3">{template.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">{template.features.slice(0, 3).map(f => <Badge key={f} color="gray" size="xs">{f}</Badge>)}</div>
      <div className="flex items-center justify-between text-xs text-gray-500"><span>{template.agents.length} agents</span><span>⭐ {template.stars}</span></div>
    </Card>
  );
};

const AgentCard = ({ agent, compact = false }) => {
  const layer = LAYERS[agent.layer];
  const c = getColor(layer.color);
  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${c.border} ${c.bg}`}>
        <span className="text-xl">🤖</span>
        <div className="flex-1"><div className="text-white font-medium text-sm">{agent.name}</div><div className="text-gray-500 text-xs">{agent.accuracy} accuracy</div></div>
        <Badge color={agent.status === 'active' ? 'green' : 'yellow'} size="xs" dot>{agent.status}</Badge>
      </div>
    );
  }
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center text-xl`}>🤖</div>
          <div><h4 className="text-white font-medium">{agent.name}</h4><p className="text-gray-500 text-xs">{agent.desc}</p></div>
        </div>
        <Badge color={agent.status === 'active' ? 'green' : 'yellow'} dot>{agent.status}</Badge>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center p-2 bg-gray-900/50 rounded"><div className="text-green-400 font-semibold text-sm">{agent.accuracy}</div><div className="text-gray-500 text-[10px]">Accuracy</div></div>
        <div className="text-center p-2 bg-gray-900/50 rounded"><div className={`font-semibold text-sm ${c.text}`}>{layer.short}</div><div className="text-gray-500 text-[10px]">Layer</div></div>
        <div className="text-center p-2 bg-gray-900/50 rounded"><div className="text-blue-400 font-semibold text-sm">{agent.calls}</div><div className="text-gray-500 text-[10px]">Usage</div></div>
        <div className="text-center p-2 bg-gray-900/50 rounded"><div className="text-purple-400 font-semibold text-sm">{agent.latency}</div><div className="text-gray-500 text-[10px]">Latency</div></div>
      </div>
      <Button variant="outline" size="sm" className="w-full">Configure</Button>
    </Card>
  );
};

// App Simulation Component
const AppSimulation = ({ app, onBack }) => {
  const [simData, setSimData] = useState({ activeUsers: 247, requestsPerSec: 12.4, avgLatency: 89, errorRate: 0.02, cpuUsage: 34, memoryUsage: 67 });
  const [activityLog, setActivityLog] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const layer = LAYERS[app.layer];
  const c = getColor(layer.color);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSimData(prev => ({
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 20 - 10)),
        requestsPerSec: Math.max(5, +(prev.requestsPerSec + (Math.random() * 4 - 2)).toFixed(1)),
        avgLatency: Math.max(50, prev.avgLatency + Math.floor(Math.random() * 20 - 10)),
        errorRate: Math.max(0, Math.min(1, +(prev.errorRate + (Math.random() * 0.02 - 0.01)).toFixed(2))),
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + Math.floor(Math.random() * 10 - 5))),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + Math.floor(Math.random() * 6 - 3)))
      }));
      const actions = [
        { type: 'api', msg: 'GET /fhir/Patient/123 → 200 OK (45ms)' },
        { type: 'agent', msg: 'Care Gap Agent → Analyzed patient MCH-2024' },
        { type: 'api', msg: 'POST /api/v1/cost-estimate → 200 OK (156ms)' },
        { type: 'auth', msg: 'User dr.martinez@clinic.com authenticated' },
        { type: 'cache', msg: 'Cache HIT for patient demographics' }
      ];
      setActivityLog(prev => [{ time: new Date().toLocaleTimeString(), ...actions[Math.floor(Math.random() * actions.length)] }, ...prev].slice(0, 20));
    }, 1500);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl`}>{app.screenshot}</div>
            <div><h1 className="text-2xl font-bold text-white">{app.name}</h1><p className="text-gray-400">{app.version} • Live Simulation</p></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge color={isRunning ? 'green' : 'gray'} dot>{isRunning ? 'Running' : 'Paused'}</Badge>
          <Button variant={isRunning ? 'danger' : 'success'} onClick={() => setIsRunning(!isRunning)}>{isRunning ? '⏸ Pause' : '▶ Resume'}</Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-6">
          <Card className="p-6">
            <h2 className="text-white font-semibold mb-4">Real-time Metrics</h2>
            <div className="grid grid-cols-6 gap-4">
              <div className="text-center p-4 bg-gray-900/50 rounded-xl"><div className="text-3xl font-bold text-green-400">{simData.activeUsers}</div><div className="text-gray-500 text-sm mt-1">Active Users</div></div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl"><div className="text-3xl font-bold text-blue-400">{simData.requestsPerSec}</div><div className="text-gray-500 text-sm mt-1">Requests/sec</div></div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl"><div className="text-3xl font-bold text-cyan-400">{simData.avgLatency}ms</div><div className="text-gray-500 text-sm mt-1">Avg Latency</div></div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl"><div className="text-3xl font-bold text-yellow-400">{simData.errorRate}%</div><div className="text-gray-500 text-sm mt-1">Error Rate</div></div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl"><div className="text-3xl font-bold text-purple-400">{simData.cpuUsage}%</div><div className="text-gray-500 text-sm mt-1">CPU</div></div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl"><div className="text-3xl font-bold text-orange-400">{simData.memoryUsage}%</div><div className="text-gray-500 text-sm mt-1">Memory</div></div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-white font-semibold">Live Activity Stream</h2><Badge color="green" dot>Live</Badge></div>
            <div className="bg-gray-900 rounded-lg p-4 max-h-[300px] overflow-y-auto font-mono text-sm space-y-1">
              {activityLog.map((log, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded ${i === 0 ? 'bg-violet-500/10' : ''}`}>
                  <span className="text-gray-500 text-xs w-20">{log.time}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === 'api' ? 'bg-blue-500/20 text-blue-400' : log.type === 'agent' ? 'bg-yellow-500/20 text-yellow-400' : log.type === 'auth' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{log.type.toUpperCase()}</span>
                  <span className="text-gray-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-gray-400 text-xs font-medium mb-3">APP INFO</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge color="green" dot>Live</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Version</span><span className="text-white">{app.version}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Uptime</span><span className="text-green-400">{app.uptime}</span></div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-400 text-xs font-medium mb-3">ACTIVE AGENTS</h3>
            <div className="space-y-2">
              {AGENTS.filter(a => a.layer === app.layer).slice(0, 3).map(agent => (
                <div key={agent.id} className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg">
                  <span className="text-yellow-400">🤖</span>
                  <div className="flex-1"><div className="text-white text-xs">{agent.name}</div><div className="text-gray-500 text-[10px]">{agent.accuracy}</div></div>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-400 text-xs font-medium mb-3">QUICK ACTIONS</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">📊 Analytics</Button>
              <Button variant="outline" size="sm" className="w-full">📋 Logs</Button>
              <Button variant="gradient" size="sm" className="w-full">🚀 Clone App</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Settings Page
const SettingsPage = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('integrations');
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggleConnection = (category, id) => {
    setIntegrations(prev => ({ ...prev, [category]: prev[category].map(item => item.id === id ? { ...item, status: item.status === 'connected' ? 'available' : 'connected' } : item) }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <div><h1 className="text-2xl font-bold text-white">Settings</h1><p className="text-gray-400">Manage integrations, APIs, MCPs, and tokens</p></div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="space-y-1">
          {[{ id: 'integrations', label: 'Integrations', icon: '🔗' }, { id: 'mcp', label: 'MCP Servers', icon: '🌉' }, { id: 'tokens', label: 'API Tokens', icon: '🔑' }].map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeSection === item.id ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-gray-400 hover:bg-gray-800'}`}><span>{item.icon}</span><span className="font-medium">{item.label}</span></button>
          ))}
        </div>
        <div className="col-span-3">
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              {[{ key: 'ehr', title: 'EHR Systems' }, { key: 'payer', title: 'Payer Connections' }, { key: 'analytics', title: 'Analytics' }].map(section => (
                <Card key={section.key} className="p-6">
                  <div className="flex items-center justify-between mb-4"><h2 className="text-white font-semibold">{section.title}</h2><Badge color="blue">{integrations[section.key].filter(i => i.status === 'connected').length} Connected</Badge></div>
                  <div className="space-y-3">
                    {integrations[section.key].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-4"><span className="text-2xl">{item.icon}</span><div><div className="text-white font-medium">{item.name}</div><div className="text-gray-500 text-sm">{item.desc}</div></div></div>
                        <div className="flex items-center gap-3"><Badge color={item.status === 'connected' ? 'green' : 'gray'} dot>{item.status}</Badge><Button variant={item.status === 'connected' ? 'danger' : 'primary'} size="sm" onClick={() => toggleConnection(section.key, item.id)}>{item.status === 'connected' ? 'Disconnect' : 'Connect'}</Button></div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
          {activeSection === 'mcp' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4"><h2 className="text-white font-semibold">Model Context Protocol (MCP) Servers</h2><Button variant="gradient" size="sm">+ Add MCP</Button></div>
                <div className="space-y-3">
                  {integrations.mcp.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-4"><span className="text-2xl">{item.icon}</span><div><div className="text-white font-medium">{item.name}</div><div className="text-gray-500 text-sm">{item.desc}</div></div></div>
                      <div className="flex items-center gap-3"><Badge color={item.status === 'connected' ? 'green' : 'gray'} dot>{item.status}</Badge><Button variant="outline" size="sm">Configure</Button><Button variant={item.status === 'connected' ? 'danger' : 'success'} size="sm" onClick={() => toggleConnection('mcp', item.id)}>{item.status === 'connected' ? 'Disable' : 'Enable'}</Button></div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-white font-semibold mb-4">MCP Configuration</h3>
                <div className="space-y-4">
                  <div><label className="text-gray-400 text-sm mb-2 block">Server URL</label><Input placeholder="https://mcp.your-server.com" /></div>
                  <div><label className="text-gray-400 text-sm mb-2 block">Auth Token</label><Input type="password" placeholder="••••••••" /></div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"><div><div className="text-white font-medium">Auto-reconnect</div><div className="text-gray-500 text-sm">Reconnect on connection loss</div></div><Toggle enabled={true} onChange={() => {}} /></div>
                </div>
              </Card>
            </div>
          )}
          {activeSection === 'tokens' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-white font-semibold">API Tokens</h2><Button variant="gradient" size="sm">+ Create Token</Button></div>
              <div className="space-y-3">
                {[{ name: 'Production API Key', key: 'ho_prod_****7892', lastUsed: '2 mins ago', status: 'active' }, { name: 'Sandbox API Key', key: 'ho_sand_****3456', lastUsed: '1 hour ago', status: 'active' }, { name: 'CI/CD Pipeline', key: 'ho_cicd_****9012', lastUsed: '3 days ago', status: 'active' }].map((token, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-4"><span className="text-2xl">🔑</span><div><div className="text-white font-medium">{token.name}</div><div className="text-gray-500 text-sm font-mono">{token.key}</div></div></div>
                    <div className="flex items-center gap-4 text-sm"><span className="text-gray-500">Last: {token.lastUsed}</span><Badge color="green" dot>{token.status}</Badge><Button variant="ghost" size="sm">Revoke</Button></div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Compliance Center
const ComplianceCenter = ({ onBack, projectName = 'My Project' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [shareModal, setShareModal] = useState(null);
  const [generatedLinks, setGeneratedLinks] = useState([]);

  const generateShareLink = (report) => {
    const link = { id: Date.now(), url: `https://audit.orchestra.health/${Math.random().toString(36).substr(2, 9)}`, report: report.name, expires: '7 days', accessCount: 0 };
    setGeneratedLinks(prev => [link, ...prev]);
    setShareModal(link);
  };

  const tabs = [{ id: 'overview', label: 'Overview', icon: '📊' }, { id: 'reports', label: 'Reports', icon: '📋' }, { id: 'logs', label: 'Audit Logs', icon: '📜' }, { id: 'exports', label: 'Exports', icon: '📤' }, { id: 'links', label: 'Shared Links', icon: '🔗' }];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4"><Button variant="ghost" onClick={onBack}>← Back</Button><div><h1 className="text-2xl font-bold text-white">Compliance Center</h1><p className="text-gray-400">{projectName} • Audit & Compliance</p></div></div>
        <div className="flex gap-3"><Button variant="outline">📥 Export All</Button><Button variant="gradient">🔗 Generate Audit Link</Button></div>
      </div>
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-white font-semibold mb-4">Compliance Score</h2>
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90"><circle cx="64" cy="64" r="56" stroke="#374151" strokeWidth="8" fill="none" /><circle cx="64" cy="64" r="56" stroke="#22C55E" strokeWidth="8" fill="none" strokeDasharray="345 352" strokeLinecap="round" /></svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-bold text-white">98%</span></div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg"><div className="text-green-400 font-bold text-xl">47/48</div><div className="text-gray-400 text-sm">Controls Passed</div></div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"><div className="text-yellow-400 font-bold text-xl">1</div><div className="text-gray-400 text-sm">Needs Review</div></div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"><div className="text-blue-400 font-bold text-xl">234</div><div className="text-gray-400 text-sm">Audit Events</div></div>
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"><div className="text-purple-400 font-bold text-xl">0</div><div className="text-gray-400 text-sm">Critical Issues</div></div>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4"><h2 className="text-white font-semibold">Recent Events</h2><Button variant="ghost" size="sm" onClick={() => setActiveTab('logs')}>View All →</Button></div>
                <div className="space-y-2">
                  {AUDIT_LOGS.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-3"><span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'}`} /><span className="text-gray-500 text-xs font-mono w-20">{log.timestamp.split(' ')[1]}</span><Badge color={log.action.includes('PHI') ? 'yellow' : 'blue'} size="xs">{log.action}</Badge><span className="text-gray-300 text-sm">{log.user}</span></div>
                      <span className="text-gray-500 text-xs font-mono">{log.resource}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-gray-400 text-xs font-medium mb-3">CERTIFICATIONS</h3>
                <div className="space-y-3">
                  {[{ name: 'HIPAA', status: 'Certified', icon: '🏥' }, { name: 'SOC 2 Type II', status: 'Certified', icon: '🔒' }, { name: 'HITRUST', status: 'In Progress', icon: '🛡️' }].map(cert => (
                    <div key={cert.name} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"><div className="flex items-center gap-2"><span>{cert.icon}</span><span className="text-white text-sm">{cert.name}</span></div><Badge color={cert.status === 'Certified' ? 'green' : 'yellow'} size="xs">{cert.status}</Badge></div>
                  ))}
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-gray-400 text-xs font-medium mb-3">QUICK ACTIONS</h3>
                <div className="space-y-2"><Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('reports')}>📋 Generate Report</Button><Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('exports')}>📤 Export Data</Button><Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('links')}>🔗 Manage Links</Button></div>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-white font-semibold">Compliance Reports</h2><Button variant="gradient" size="sm">+ Generate Report</Button></div>
            <div className="space-y-3">
              {COMPLIANCE_REPORTS.map(report => (
                <Card key={report.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${report.type === 'hipaa' ? 'bg-blue-500/20' : report.type === 'phi' ? 'bg-yellow-500/20' : 'bg-purple-500/20'}`}>{report.type === 'hipaa' ? '🏥' : report.type === 'phi' ? '🔐' : '🛡️'}</div>
                      <div><div className="text-white font-medium">{report.name}</div><div className="text-gray-500 text-sm">Generated {report.date} • {report.items} items</div></div>
                    </div>
                    <div className="flex items-center gap-4"><div className="text-right"><div className="text-green-400 font-bold">{report.score}%</div><div className="text-gray-500 text-xs">Score</div></div><Badge color="green">{report.status}</Badge><Button variant="outline" size="sm">View</Button><Button variant="secondary" size="sm" onClick={() => generateShareLink(report)}>🔗 Share</Button></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-white font-semibold">Audit Logs</h2><div className="flex gap-3"><Input placeholder="Search..." icon="🔍" className="w-64" /><Button variant="outline" size="sm">📥 Export</Button></div></div>
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900/50"><tr><th className="text-left text-gray-400 text-xs p-4">Timestamp</th><th className="text-left text-gray-400 text-xs p-4">User</th><th className="text-left text-gray-400 text-xs p-4">Action</th><th className="text-left text-gray-400 text-xs p-4">Resource</th><th className="text-left text-gray-400 text-xs p-4">IP</th><th className="text-left text-gray-400 text-xs p-4">Status</th></tr></thead>
                <tbody>
                  {AUDIT_LOGS.map(log => (
                    <tr key={log.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                      <td className="p-4 text-gray-300 text-sm font-mono">{log.timestamp}</td>
                      <td className="p-4 text-gray-300 text-sm">{log.user}</td>
                      <td className="p-4"><Badge color={log.action.includes('PHI') ? 'yellow' : 'blue'} size="xs">{log.action}</Badge></td>
                      <td className="p-4 text-gray-400 text-sm font-mono">{log.resource}</td>
                      <td className="p-4 text-gray-500 text-sm font-mono">{log.ip}</td>
                      <td className="p-4"><span className={`w-2 h-2 rounded-full inline-block ${log.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'}`} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {activeTab === 'exports' && (
          <Card className="p-6">
            <h2 className="text-white font-semibold mb-4">Export Data for Auditors</h2>
            <div className="grid grid-cols-2 gap-4">
              {[{ name: 'Full Audit Log', desc: 'Complete audit trail', icon: '📜', format: 'CSV' }, { name: 'HIPAA Package', desc: 'HIPAA documentation', icon: '🏥', format: 'ZIP' }, { name: 'PHI Access Report', desc: 'PHI access events', icon: '🔐', format: 'PDF' }, { name: 'Security Evidence', desc: 'Security configurations', icon: '🛡️', format: 'ZIP' }].map((exp, i) => (
                <Card key={i} hover className="p-4">
                  <div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="text-3xl">{exp.icon}</span><div><div className="text-white font-medium">{exp.name}</div><div className="text-gray-500 text-sm">{exp.desc}</div></div></div><Badge color="gray" size="xs">{exp.format}</Badge></div>
                  <div className="flex gap-2 mt-4"><Button variant="outline" size="sm" className="flex-1">Preview</Button><Button variant="primary" size="sm" className="flex-1">📥 Export</Button></div>
                </Card>
              ))}
            </div>
          </Card>
        )}
        {activeTab === 'links' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4"><div><h2 className="text-white font-semibold">Shared Audit Links</h2><p className="text-gray-500 text-sm">Secure links for auditors</p></div><Button variant="gradient" size="sm">+ Create Link</Button></div>
            {generatedLinks.length === 0 ? (
              <div className="text-center py-12"><span className="text-6xl mb-4 block">🔗</span><p className="text-gray-400">No shared links. Generate a report and share it.</p></div>
            ) : (
              <div className="space-y-3">
                {generatedLinks.map(link => (
                  <div key={link.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div><div className="text-white font-medium">{link.report}</div><div className="text-cyan-400 text-sm font-mono">{link.url}</div><div className="text-gray-500 text-xs mt-1">Expires: {link.expires}</div></div>
                    <div className="flex items-center gap-2"><Button variant="outline" size="sm">📋 Copy</Button><Button variant="danger" size="sm">Revoke</Button></div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
      {shareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-white font-semibold">🔗 Audit Link Generated</h2><button onClick={() => setShareModal(null)} className="text-gray-500 hover:text-white">✕</button></div>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="text-gray-400 text-xs mb-2">Share this link:</div>
              <div className="flex items-center gap-2"><input type="text" value={shareModal.url} readOnly className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-cyan-400 font-mono text-sm" /><Button variant="primary" size="sm">📋 Copy</Button></div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"><span className="text-gray-400 text-sm">Report</span><span className="text-white text-sm">{shareModal.report}</span></div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"><span className="text-gray-400 text-sm">Expires</span><span className="text-white text-sm">{shareModal.expires}</span></div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"><span className="text-gray-400 text-sm">Access</span><span className="text-white text-sm">View Only</span></div>
            </div>
            <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setShareModal(null)}>Close</Button><Button variant="gradient" className="flex-1">📧 Email</Button></div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Credentials Manager
const CredentialsManager = ({ onBack, projectName = 'My Project' }) => {
  const [credentials] = useState([
    { id: '1', name: 'Epic FHIR Client Secret', type: 'oauth', env: 'production', lastRotated: '2025-01-15' },
    { id: '2', name: 'Availity API Key', type: 'api_key', env: 'production', lastRotated: '2025-01-10' },
    { id: '3', name: 'Snowflake Connection', type: 'database', env: 'production', lastRotated: '2025-01-20' },
    { id: '4', name: 'AWS KMS Key', type: 'encryption', env: 'all', lastRotated: '2025-01-25' }
  ]);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4"><Button variant="ghost" onClick={onBack}>← Back</Button><div><h1 className="text-2xl font-bold text-white">Credentials</h1><p className="text-gray-400">{projectName} • Secrets & Keys</p></div></div>
        <Button variant="gradient" onClick={() => setShowAdd(true)}>+ Add Credential</Button>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center"><div className="text-2xl font-bold text-white">{credentials.length}</div><div className="text-gray-500 text-sm">Total</div></Card>
        <Card className="p-4 text-center"><div className="text-2xl font-bold text-green-400">{credentials.filter(c => c.env === 'production').length}</div><div className="text-gray-500 text-sm">Production</div></Card>
        <Card className="p-4 text-center"><div className="text-2xl font-bold text-yellow-400">0</div><div className="text-gray-500 text-sm">Expiring</div></Card>
        <Card className="p-4 text-center"><div className="text-2xl font-bold text-blue-400">AES-256</div><div className="text-gray-500 text-sm">Encryption</div></Card>
      </div>
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-800"><div className="flex items-center justify-between"><h2 className="text-white font-semibold">Stored Credentials</h2><Input placeholder="Search..." icon="🔍" className="w-64" /></div></div>
        <table className="w-full">
          <thead className="bg-gray-900/50"><tr><th className="text-left text-gray-400 text-xs p-4">Name</th><th className="text-left text-gray-400 text-xs p-4">Type</th><th className="text-left text-gray-400 text-xs p-4">Environment</th><th className="text-left text-gray-400 text-xs p-4">Last Rotated</th><th className="text-left text-gray-400 text-xs p-4">Actions</th></tr></thead>
          <tbody>
            {credentials.map(cred => (
              <tr key={cred.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                <td className="p-4"><div className="flex items-center gap-3"><span className="text-xl">{cred.type === 'oauth' ? '🔐' : cred.type === 'api_key' ? '🔑' : cred.type === 'database' ? '🗄️' : '🔒'}</span><span className="text-white font-medium">{cred.name}</span></div></td>
                <td className="p-4"><Badge color={cred.type === 'oauth' ? 'purple' : cred.type === 'api_key' ? 'blue' : cred.type === 'database' ? 'cyan' : 'yellow'} size="xs">{cred.type.replace('_', ' ')}</Badge></td>
                <td className="p-4"><Badge color={cred.env === 'production' ? 'green' : 'gray'} size="xs">{cred.env}</Badge></td>
                <td className="p-4 text-gray-400 text-sm">{cred.lastRotated}</td>
                <td className="p-4"><div className="flex gap-2"><Button variant="ghost" size="sm">View</Button><Button variant="ghost" size="sm">Rotate</Button><Button variant="ghost" size="sm" className="text-red-400">Delete</Button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-4 mt-6 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-center gap-3"><span className="text-2xl">🔒</span><div><div className="text-white font-medium">Encrypted at Rest</div><div className="text-gray-400 text-sm">AES-256 encryption with AWS KMS</div></div></div>
      </Card>
      {showAdd && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <h2 className="text-white font-semibold mb-4">Add New Credential</h2>
            <div className="space-y-4">
              <div><label className="text-gray-400 text-sm mb-2 block">Name</label><Input placeholder="e.g., Epic FHIR Client Secret" /></div>
              <div><label className="text-gray-400 text-sm mb-2 block">Type</label><select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"><option>API Key</option><option>OAuth Client Secret</option><option>Database Connection</option><option>Encryption Key</option></select></div>
              <div><label className="text-gray-400 text-sm mb-2 block">Value</label><Input type="password" placeholder="Enter secret value" /></div>
              <div><label className="text-gray-400 text-sm mb-2 block">Environment</label><div className="flex gap-2"><Button variant="outline" size="sm">Sandbox</Button><Button variant="primary" size="sm">Production</Button><Button variant="outline" size="sm">All</Button></div></div>
            </div>
            <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button><Button variant="gradient" className="flex-1">Save</Button></div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Wizard with Agents List
const Wizard = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      const t = template || TEMPLATES[0];
      const templateAgents = AGENTS.filter(a => t.agents.includes(a.id));
      setPlan({ layers: [t.layer, 'data', 'agents', 'context'], apis: APIS[t.layer] || [], agents: templateAgents, compliance: ['HIPAA Audit Logging', 'PHI Encryption', 'Access Controls'], time: t.time });
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const steps = [{ n: 1, l: 'Describe' }, { n: 2, l: 'Template' }, { n: 3, l: 'Review' }, { n: 4, l: 'Create' }];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > s.n ? 'bg-green-500 text-white' : step === s.n ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{step > s.n ? '✓' : s.n}</div><span className={`text-sm ${step >= s.n ? 'text-white' : 'text-gray-500'}`}>{s.l}</span></div>
            {i < steps.length - 1 && <div className={`w-12 h-0.5 ${step > s.n ? 'bg-green-500' : 'bg-gray-700'}`} />}
          </React.Fragment>
        ))}
      </div>
      <Card className="p-6">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">What do you want to build?</h2>
            <p className="text-gray-400 text-sm mb-6">Describe your healthcare application.</p>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Example: Build a patient portal with appointment scheduling..." className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none" />
            {prompt.length > 20 && (
              <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2"><span className="text-violet-400">✨</span><span className="text-violet-400 font-medium">AI Enhancement</span></div>
                <p className="text-gray-300 text-sm">Adding HIPAA-compliant logging and Healthcare Orchestra integrations.</p>
              </div>
            )}
            <div className="flex justify-between mt-6"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button onClick={() => setStep(2)} disabled={prompt.length < 10}>Next →</Button></div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Choose a Template</h2>
            <p className="text-gray-400 text-sm mb-6">Select a template that matches your use case.</p>
            <div className="grid grid-cols-2 gap-4 mb-6 max-h-[400px] overflow-y-auto">{TEMPLATES.map(t => <TemplateCard key={t.id} template={t} selected={template?.id === t.id} onSelect={setTemplate} />)}</div>
            <div className="flex justify-between"><Button variant="ghost" onClick={() => setStep(1)}>← Back</Button><Button onClick={generatePlan} disabled={!template || loading}>{loading ? 'Generating...' : 'Generate →'}</Button></div>
          </div>
        )}
        {step === 3 && plan && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Review Configuration</h2>
            <p className="text-gray-400 text-sm mb-6">AI has generated this configuration.</p>
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
              <div className="p-4 bg-gray-900/50 rounded-xl">
                <h3 className="text-gray-400 text-xs font-medium mb-3">LAYERS</h3>
                <div className="flex flex-wrap gap-2">{plan.layers.map(l => { const layer = LAYERS[l]; const c = getColor(layer?.color || 'slate'); return <span key={l} className={`px-3 py-1.5 ${c.bg} ${c.text} rounded-lg text-sm flex items-center gap-2`}>{layer?.emoji} {layer?.short || l}</span>; })}</div>
              </div>
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h3 className="text-yellow-400 text-xs font-medium mb-3 flex items-center gap-2"><span>🤖</span> AI AGENTS ({plan.agents.length} included)</h3>
                <div className="space-y-2">{plan.agents.map(agent => <AgentCard key={agent.id} agent={agent} compact={true} />)}</div>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-xl">
                <h3 className="text-gray-400 text-xs font-medium mb-3">APIs ({plan.apis.length})</h3>
                <div className="grid grid-cols-2 gap-2">{plan.apis.slice(0, 6).map(api => (<div key={api.name} className="text-sm flex items-center gap-2 p-2 bg-gray-800/50 rounded"><span className={`text-[10px] font-mono font-bold ${api.method === 'GET' ? 'text-green-400' : 'text-blue-400'}`}>{api.method}</span><span className="text-gray-300">{api.name}</span></div>))}</div>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-3"><span className="text-amber-400">⚠️</span><h3 className="text-amber-400 font-medium">Compliance Checkpoint</h3></div>
                <p className="text-gray-300 text-sm mb-3">PHI protection auto-enabled:</p>
                <div className="flex flex-wrap gap-2">{plan.compliance.map(c => <Badge key={c} color="green">✓ {c}</Badge>)}</div>
              </div>
            </div>
            <div className="flex justify-between"><Button variant="ghost" onClick={() => setStep(2)}>← Modify</Button><Button onClick={() => setStep(4)}>Approve →</Button></div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Name Your Project</h2>
            <p className="text-gray-400 text-sm mb-6">Choose a name and create your project.</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-healthcare-app" className="text-lg py-4" />
            <Card className="p-4 mt-6">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Template</span><span className="text-white">{template?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Agents</span><span className="text-yellow-400">{plan?.agents.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Est. Setup</span><span className="text-green-400">{plan?.time}</span></div>
              </div>
            </Card>
            <div className="flex justify-between mt-6"><Button variant="ghost" onClick={() => setStep(3)}>← Back</Button><Button variant="gradient" onClick={() => onComplete({ name, template, plan })} disabled={!name}>🚀 Create Project</Button></div>
          </div>
        )}
      </Card>
    </div>
  );
};

// Main Application
export default function HealthcareOrchestraDeveloperPortal() {
  const [view, setView] = useState('home');
  const [tab, setTab] = useState('code');
  const [layer, setLayer] = useState('L5');
  const [project, setProject] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Welcome to Healthcare Orchestra! 👋\n\nI can help you:\n• Generate code for any layer\n• Explain APIs and data models\n• Configure AI agents\n• Debug issues\n\nWhat would you like to build?' }]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  const handleCreate = (p) => { setProject(p); setLayer(p.template.layer); setView('workspace'); };

  const handleChat = (msg) => {
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setTyping(true);
    setTimeout(() => {
      const l = LAYERS[layer];
      let response = '';
      if (msg.toLowerCase().includes('api')) {
        const apis = APIS[layer] || [];
        response = `APIs for ${l.name}:\n\n${apis.map(a => `• ${a.method} ${a.path}`).join('\n')}`;
      } else if (msg.toLowerCase().includes('agent')) {
        const agents = AGENTS.filter(a => a.layer === layer);
        response = `Agents for ${l.name}:\n\n${agents.map(a => `• ${a.name} (${a.accuracy})`).join('\n')}`;
      } else {
        response = `I can help with:\n• Code Generation\n• API Reference\n• Agent Setup\n\nJust ask!`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setTyping(false);
    }, 1200);
  };

  const tabs = [{ id: 'code', label: 'Code', icon: '💻' }, { id: 'apis', label: 'APIs', icon: '🔌', badge: APIS[layer]?.length }, { id: 'agents', label: 'Agents', icon: '🤖', badge: AGENTS.filter(a => a.layer === layer).length }, { id: 'data', label: 'Data', icon: '📊' }, { id: 'deploy', label: 'Deploy', icon: '🚀' }];

  if (view === 'settings') return <SettingsPage onBack={() => setView('workspace')} />;
  if (view === 'compliance') return <ComplianceCenter onBack={() => setView('workspace')} projectName={project?.name || 'My Project'} />;
  if (view === 'credentials') return <CredentialsManager onBack={() => setView('workspace')} projectName={project?.name || 'My Project'} />;
  if (view === 'simulation' && selectedApp) return <AppSimulation app={selectedApp} onBack={() => { setView('examples'); setSelectedApp(null); }} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <header className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}><span className="text-2xl">🎼</span><div><h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">Healthcare Orchestra</h1><p className="text-gray-500 text-[10px]">Developer Portal v5.0</p></div></div>
            {view !== 'home' && <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-700"><button onClick={() => setView('home')} className="text-gray-400 hover:text-white text-sm">Home</button><span className="text-gray-600">/</span><span className="text-white text-sm capitalize">{view === 'examples' ? 'Example Apps' : view}</span></div>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('examples')} className="px-3 py-2 text-sm text-gray-400 hover:text-white">📱 Examples</button>
            <button onClick={() => setView('settings')} className="px-3 py-2 text-sm text-gray-400 hover:text-white">⚙️ Settings</button>
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold">D</div>
          </div>
        </div>
      </header>

      {view === 'home' && (
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12"><h2 className="text-4xl font-bold text-white mb-4">Build Healthcare Applications</h2><p className="text-gray-400 text-lg max-w-2xl mx-auto">Create compliant healthcare apps with AI-assisted development.</p></div>
            <div className="grid grid-cols-4 gap-6 mb-12">
              <Card hover onClick={() => setView('create')} className="p-6 bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-500/30"><span className="text-4xl mb-4 block">✨</span><h3 className="text-xl font-semibold text-white mb-2">New Project</h3><p className="text-gray-400 text-sm">Start with a prompt or template</p></Card>
              <Card hover onClick={() => setView('examples')} className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/30"><span className="text-4xl mb-4 block">📱</span><h3 className="text-xl font-semibold text-white mb-2">Example Apps</h3><p className="text-gray-400 text-sm">Browse and simulate live apps</p></Card>
              <Card hover onClick={() => setView('settings')} className="p-6"><span className="text-4xl mb-4 block">⚙️</span><h3 className="text-xl font-semibold text-white mb-2">Settings</h3><p className="text-gray-400 text-sm">Integrations, MCPs & APIs</p></Card>
              <Card hover className="p-6"><span className="text-4xl mb-4 block">📚</span><h3 className="text-xl font-semibold text-white mb-2">Documentation</h3><p className="text-gray-400 text-sm">API reference & guides</p></Card>
            </div>
            <div className="mb-12"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-semibold text-white">Popular Templates</h3><Button variant="ghost" onClick={() => setView('create')}>View All →</Button></div><div className="grid grid-cols-3 gap-4">{TEMPLATES.slice(0, 3).map(t => <TemplateCard key={t.id} template={t} onSelect={() => setView('create')} />)}</div></div>
          </div>
        </div>
      )}

      {view === 'examples' && (
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8"><div><h2 className="text-3xl font-bold text-white mb-2">Example Apps</h2><p className="text-gray-400">Explore and simulate live applications</p></div><Button variant="gradient" onClick={() => setView('create')}>+ Create New</Button></div>
            <div className="grid grid-cols-3 gap-6">
              {EXAMPLE_APPS.map(app => {
                const layer = LAYERS[app.layer];
                const c = getColor(layer.color);
                return (
                  <Card key={app.id} className="overflow-hidden">
                    <div className={`h-32 bg-gradient-to-br ${c.gradient} flex items-center justify-center relative`}><span className="text-5xl">{app.screenshot}</span><div className="absolute top-3 right-3"><Badge color={app.status === 'live' ? 'green' : 'yellow'} dot>{app.status}</Badge></div></div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold">{app.name}</h3>
                      <div className="grid grid-cols-3 gap-2 my-3">{Object.entries(app.metrics).map(([key, value]) => (<div key={key} className="text-center p-2 bg-gray-900/50 rounded"><div className="text-white font-semibold text-sm">{value}</div><div className="text-gray-500 text-[9px] capitalize">{key}</div></div>))}</div>
                      <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1">View Code</Button><Button variant="primary" size="sm" className="flex-1" onClick={() => { setSelectedApp(app); setView('simulation'); }}>▶ Simulate</Button></div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'create' && <div className="p-8"><Wizard onComplete={handleCreate} onCancel={() => setView('home')} /></div>}

      {view === 'workspace' && (
        <div className="flex h-[calc(100vh-57px)]">
          <div className={`${collapsed ? 'w-16' : 'w-56'} border-r border-gray-800 p-3 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">{!collapsed && <span className="text-gray-500 text-xs font-medium">LAYERS</span>}<button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-white p-1">{collapsed ? '→' : '←'}</button></div>
            <div className="space-y-1 flex-1 overflow-y-auto">{Object.keys(LAYERS).map(id => <LayerItem key={id} layer={id} active={layer === id} onClick={() => setLayer(id)} collapsed={collapsed} />)}</div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs tabs={tabs} active={tab} onChange={setTab} />
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto">
                {tab === 'code' && <div><h2 className="text-xl font-semibold text-white mb-4">Code Editor</h2><div className="bg-gray-900 rounded-xl border border-gray-800 p-4 font-mono text-sm"><div className="text-gray-500">// {project?.name || 'index'}.ts</div><div className="text-violet-400">const</div> client = initOrchestra({'{'}<div className="pl-4 text-green-400">apiKey: process.env.HO_API_KEY</div>{'}'});</div></div>}
                {tab === 'apis' && <div><h2 className="text-xl font-semibold text-white mb-4">{LAYERS[layer].emoji} {LAYERS[layer].name} APIs</h2><div className="space-y-3">{(APIS[layer] || []).map(api => (<div key={api.name} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800"><div className="flex items-center gap-3"><span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${api.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{api.method}</span><span className="text-white text-sm font-mono">{api.path}</span></div><Button variant="outline" size="sm">Try It</Button></div>))}</div></div>}
                {tab === 'agents' && <div><h2 className="text-xl font-semibold text-white mb-4">AI Agents</h2><div className="grid grid-cols-2 gap-4">{AGENTS.filter(a => a.layer === layer || layer === 'agents').map(a => <AgentCard key={a.id} agent={a} />)}</div></div>}
                {tab === 'data' && <div><h2 className="text-xl font-semibold text-white mb-4">Data Sources</h2><div className="grid grid-cols-3 gap-4">{[{ name: 'FHIR R4', count: '50+', icon: '🔥' }, { name: 'ICD-10', count: '72K+', icon: '🏷️' }, { name: 'RxNorm', count: '200K+', icon: '💊' }, { name: 'SNOMED', count: '350K+', icon: '🔬' }, { name: 'LOINC', count: '96K+', icon: '🧪' }, { name: 'HEDIS', count: '90+', icon: '⭐' }].map(d => (<Card key={d.name} hover className="p-4"><span className="text-3xl">{d.icon}</span><h3 className="text-white font-medium mt-3">{d.name}</h3><p className="text-violet-400 text-sm">{d.count}</p></Card>))}</div></div>}
                {tab === 'deploy' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Deployment</h2>
                    <div className="space-y-4">
                      {[{ name: 'Sandbox', status: 'Active', color: 'yellow', desc: 'Development with synthetic data' }, { name: 'Staging', status: 'Available', color: 'blue', desc: 'Pre-production testing' }, { name: 'Production', status: 'Requires Approval', color: 'green', desc: 'HIPAA-compliant', disabled: true }].map(env => (
                        <Card key={env.name} className={`p-4 ${env.disabled ? 'opacity-60' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4"><div className={`w-3 h-3 rounded-full ${getColor(env.color).solid}`} /><div><div className="flex items-center gap-2"><span className="text-white font-medium text-lg">{env.name}</span><Badge color={env.color}>{env.status}</Badge></div><p className="text-gray-400 text-sm">{env.desc}</p></div></div>
                            {!env.disabled && <Button variant="outline" size="sm">{env.name === 'Sandbox' ? 'View Logs' : 'Deploy'}</Button>}
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-6">
                      <h3 className="text-gray-400 text-sm font-medium mb-4">PROJECT MANAGEMENT</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <Card hover className="p-4" onClick={() => setView('compliance')}><div className="flex items-center gap-3"><span className="text-2xl">🛡️</span><div><div className="text-white font-medium">Compliance Center</div><div className="text-gray-500 text-sm">Reports, logs, auditor links</div></div></div></Card>
                        <Card hover className="p-4" onClick={() => setView('credentials')}><div className="flex items-center gap-3"><span className="text-2xl">🔑</span><div><div className="text-white font-medium">Credentials</div><div className="text-gray-500 text-sm">Secrets & API keys</div></div></div></Card>
                        <Card hover className="p-4" onClick={() => setView('settings')}><div className="flex items-center gap-3"><span className="text-2xl">⚙️</span><div><div className="text-white font-medium">Settings</div><div className="text-gray-500 text-sm">Integrations & MCPs</div></div></div></Card>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {showChat && (
                <div className="w-80 border-l border-gray-800 flex flex-col bg-gray-900/50">
                  <div className="flex items-center justify-between p-3 border-b border-gray-800"><div className="flex items-center gap-2"><span className="text-violet-400 text-lg">✨</span><span className="text-white font-medium">AI Assistant</span></div><button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-white p-1">✕</button></div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-xl p-3 ${msg.role === 'user' ? 'bg-violet-500/20 text-white' : 'bg-gray-800 text-gray-300'}`}>{msg.role === 'assistant' && <div className="flex items-center gap-1.5 mb-2"><span className="text-violet-400">✨</span><span className="text-violet-400 text-xs font-medium">AI</span></div>}<div className="text-sm whitespace-pre-wrap">{msg.content}</div></div></div>))}
                    {typing && <div className="flex justify-start"><div className="bg-gray-800 rounded-xl p-3 flex gap-1"><span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div>}
                    <div ref={endRef} />
                  </div>
                  {messages.length === 1 && <div className="px-4 pb-2 flex flex-wrap gap-2">{['Show APIs', 'Generate code', 'How do agents work?'].map(s => <button key={s} onClick={() => handleChat(s)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-xs text-gray-400 hover:text-white">{s}</button>)}</div>}
                  <form onSubmit={(e) => { e.preventDefault(); const input = e.target.elements.chat; if (input.value.trim()) { handleChat(input.value); input.value = ''; } }} className="p-3 border-t border-gray-800"><div className="flex gap-2"><input name="chat" placeholder="Ask anything..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500" /><Button>Send</Button></div></form>
                </div>
              )}
            </div>
          </div>
          {!showChat && <button onClick={() => setShowChat(true)} className="fixed right-6 bottom-6 w-14 h-14 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-105 transition-transform">✨</button>}
        </div>
      )}
    </div>
  );
}
