import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// HEALTHCARE ORCHESTRA AWV SIMULATION v4.2
// Provider Layer (L5) with 3 Simultaneous Apps: Scribe, Prescribe, Follow Up
// Features: Expandable Insight Cards, Cross-Layer Activity Panels, Meta Sub-tabs
// Note: Discovery Layer has its own standalone prototype
// ============================================================================

const PATIENT_DATA = {
  name: 'Margaret Chen',
  dob: '06/22/1956',
  age: 68,
  gender: 'Female',
  mrn: 'MCH-2024-7892',
  insurance: {
    planName: 'UnitedHealthcare Medicare Advantage (HMO)',
    memberId: '1EG4-TE5-MK72',
    pcp: 'Dr. Jennifer Martinez'
  },
  medications: [
    { name: 'Metformin 500mg', dose: 'BID with meals', refills: 3 },
    { name: 'Lisinopril 10mg', dose: 'QD morning', refills: 2 },
    { name: 'Atorvastatin 20mg', dose: 'QHS', refills: 5 },
    { name: 'Alendronate 70mg', dose: 'Weekly', refills: 4 },
    { name: 'Vitamin D3 2000IU', dose: 'QD', refills: 'OTC' }
  ]
};

const ENCOUNTER_SCRIPT = [
  { time: 0, speaker: 'Dr. Martinez', text: "Good morning, Mrs. Chen! It's wonderful to see you. How have you been feeling since we last met?" },
  { time: 2500, speaker: 'Patient', text: "Good morning, doctor! I've been doing really well. The hip has been great - I'm back to my water aerobics twice a week." },
  { time: 5000, speaker: 'Dr. Martinez', text: "That's excellent news! I saw Dr. Kim's notes from your follow-up. Today is your Annual Wellness Visit, so we'll go through everything." },
  { time: 7500, speaker: 'Patient', text: "Sounds good. I do have some occasional stiffness in my left knee in the mornings, but it goes away after I move around." },
  { time: 10000, speaker: 'Dr. Martinez', text: "I'll make note of that. Let me check your vitals - blood pressure is 128 over 78, well controlled. Weight is 158 pounds, BMI 27.1." },
  { time: 12500, speaker: 'Patient', text: "I've been trying to watch what I eat. My husband and I walk every evening after dinner now." },
  { time: 15000, speaker: 'Dr. Martinez', text: "That's wonderful! Have you had any falls or balance issues since your hip surgery?" },
  { time: 17500, speaker: 'Patient', text: "No falls, thank goodness. I did feel a bit dizzy once last month when I stood up too fast." },
  { time: 20000, speaker: 'Dr. Martinez', text: "That sounds like orthostatic hypotension - common with blood pressure medications. Let me review your medications - still on Metformin, Lisinopril, Atorvastatin?" },
  { time: 22500, speaker: 'Patient', text: "Yes, I take everything as prescribed. I use a pill organizer. I've been good about taking the Alendronate on an empty stomach." },
  { time: 25000, speaker: 'Dr. Martinez', text: "Perfect compliance. Your A1c was 6.8% - right at target. I notice your bone density scan is overdue - it's been over two years." },
  { time: 27500, speaker: 'Patient', text: "Oh yes, I meant to schedule that. Is the Alendronate working? I've been worried about my bones." },
  { time: 30000, speaker: 'Dr. Martinez', text: "The DEXA scan will tell us. Now for cognitive screening - can you tell me today's date and where we are?" },
  { time: 32500, speaker: 'Patient', text: "It's January 28th, 2025, and we're at Valley Medical Group in Fresno. I know all my grandchildren's birthdays too!" },
  { time: 35000, speaker: 'Dr. Martinez', text: "Excellent memory! Depression screening - over the past two weeks, have you felt down, depressed, or hopeless?" },
  { time: 37500, speaker: 'Patient', text: "No, not at all. I've been in good spirits, especially since I can move around so much better after the surgery." },
  { time: 40000, speaker: 'Dr. Martinez', text: "Wonderful. Let me examine your hip - can you walk a few steps for me?" },
  { time: 42500, speaker: 'Dr. Martinez', text: "Excellent mobility! ROM is about 110 degrees flexion. Let me check your heart and lungs..." },
  { time: 45000, speaker: 'Patient', text: "Everything okay? My father had heart problems." },
  { time: 47500, speaker: 'Dr. Martinez', text: "Heart sounds strong and regular, lungs clear. Your cardiovascular risk is moderate given family history, but well controlled." },
  { time: 50000, speaker: 'Patient', text: "Good to know. I can do my 30-minute walks without any problems." },
  { time: 52500, speaker: 'Dr. Martinez', text: "Your mammogram from February was normal. Flu shot and COVID booster are current." },
  { time: 55000, speaker: 'Patient', text: "Should I be worried about my sister having breast cancer? She was diagnosed at 58." },
  { time: 57500, speaker: 'Dr. Martinez', text: "We'll continue annual mammograms. Based on her age, you don't meet criteria for genetic testing, but we monitor closely." },
  { time: 60000, speaker: 'Patient', text: "What about this left knee stiffness? It's not terrible, but I notice it more lately." },
  { time: 62500, speaker: 'Dr. Martinez', text: "Let me examine it... mild crepitus but good range of motion. This looks like early osteoarthritis." },
  { time: 65000, speaker: 'Patient', text: "Will I need surgery on this one too?" },
  { time: 67500, speaker: 'Dr. Martinez', text: "Not at all - this is very mild. Continue your exercises, use acetaminophen if needed. We'll monitor it." },
  { time: 70000, speaker: 'Patient', text: "That's a relief. So what's the plan going forward?" },
  { time: 72500, speaker: 'Dr. Martinez', text: "I'll order the DEXA scan, continue all medications, and see you in 6 months. Your advance directive is on file - any changes?" },
  { time: 75000, speaker: 'Patient', text: "No changes. My son David is still my healthcare proxy. Thank you, Dr. Martinez." },
  { time: 77500, speaker: 'Dr. Martinez', text: "You're doing wonderfully, Mrs. Chen. My staff will help schedule the DEXA scan. Take care!" }
];

const CLINICAL_NOTE = {
  visitType: 'Medicare Annual Wellness Visit (G0439) + Post-THA Follow-up',
  cc: 'Annual Wellness Visit with hip replacement follow-up; new complaint of left knee stiffness',
  hpi: `68-year-old female presents for Medicare AWV. 10 months status post right THA (Dr. Kim). Reports excellent functional recovery - water aerobics 2x/week and daily 30-minute walks. New complaint: morning stiffness in left knee, resolves with activity. One episode orthostatic dizziness.`,
  assessment: `1. Z00.00 - Medicare AWV\n2. Z96.641 - R hip replacement\n3. E11.9 - Type 2 DM, controlled\n4. I10 - HTN, controlled\n5. M81.0 - Osteoporosis\n6. E78.0 - Hyperlipidemia\n7. M17.11 - Primary OA, L knee`,
  plan: `1. AWV complete (8/8)\n2. Order DEXA scan\n3. Continue medications\n4. L knee: conservative, acetaminophen PRN\n5. Follow-up 6 months`
};

// ============================================================================
// LAYER CONFIGURATION (No Discovery - it has its own prototype)
// ============================================================================

const LAYER_CONFIGS = {
  meta: { name: 'L0 Meta', color: 'cyan', emoji: 'ðŸ”®' },
  provider: { name: 'L5 Provider', color: 'orange', emoji: 'ðŸ‘¨â€âš•ï¸' },
  patient: { name: 'L6 Patient', color: 'pink', emoji: 'ðŸ‘¤' },
  admin: { name: 'L4 Admin', color: 'blue', emoji: 'ðŸ¥' },
  payer: { name: 'L3 Payer', color: 'emerald', emoji: 'ðŸ¢' },
  agents: { name: 'Agents', color: 'yellow', emoji: 'ðŸ¤–' },
  context: { name: 'Context', color: 'purple', emoji: 'ðŸ“š' }
};

// ============================================================================
// COMPONENTS
// ============================================================================

const Waveform = () => (
  <div className="flex items-center justify-center gap-1 h-6">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="w-1 bg-orange-400 rounded"
        style={{
          height: `${Math.random() * 16 + 4}px`,
          animation: `waveform 0.4s ease-in-out ${i * 0.03}s infinite alternate`
        }}
      />
    ))}
    <style>{`@keyframes waveform { from { height: 4px; } to { height: 20px; } }`}</style>
  </div>
);

const StatusBadge = ({ status, color }) => {
  const colors = {
    green: 'bg-green-500/20 text-green-400 border-green-500/50',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    red: 'bg-red-500/20 text-red-400 border-red-500/50',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/50'
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs border ${colors[color]}`}>{status}</span>;
};

const TabButton = ({ id, label, emoji, active, onClick, badge }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-all relative ${
      active ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'
    }`}
  >
    {emoji} {label}
    {badge && (
      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-orange-500 text-white text-[8px] rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

// ============================================================================
// CROSS-LAYER ACTIVITY PANEL (shown at bottom of each tab)
// ============================================================================

const CrossLayerActivityPanel = ({ layerActivities, layerActivity, currentLayer }) => {
  return (
    <div className="mt-4 bg-black/20 rounded-lg border border-gray-700/50 p-3">
      <div className="text-gray-400 text-xs font-medium mb-2 flex items-center gap-2">
        <span>ðŸ”—</span> OTHER LAYERS ACTIVITY
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(LAYER_CONFIGS)
          .filter(([key]) => key !== currentLayer)
          .map(([key, config]) => {
            const isActive = layerActivity[key];
            const activities = layerActivities[key] || [];
            const last2 = activities.slice(-2).reverse();
            
            return (
              <div key={key} className={`bg-black/30 rounded-lg p-2 border ${isActive ? 'border-green-500/30' : 'border-gray-700/30'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                  <span className="text-xs font-medium" style={{ color: config.color === 'cyan' ? '#22D3EE' : config.color === 'orange' ? '#FB923C' : config.color === 'pink' ? '#F472B6' : config.color === 'blue' ? '#60A5FA' : config.color === 'emerald' ? '#34D399' : config.color === 'yellow' ? '#FACC15' : '#A78BFA' }}>
                    {config.emoji} {config.name}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {last2.length === 0 ? (
                    <div className="text-[10px] text-gray-600 italic">No activity</div>
                  ) : (
                    last2.map((activity, i) => (
                      <div key={i} className="text-[10px] text-gray-400 truncate" title={activity.title}>
                        <span className="text-gray-600">{activity.time.split(':').slice(0,2).join(':')}</span>
                        <span className="ml-1">{activity.title.substring(0, 25)}{activity.title.length > 25 ? '...' : ''}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ============================================================================
// SIDEBAR LAYER ACTIVITY PANEL
// ============================================================================

const LayerActivityPanel = ({ layerActivities, layerActivity, expanded, onToggle }) => {
  const totalActivities = Object.values(layerActivities).reduce((sum, arr) => sum + arr.length, 0);
  
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs font-medium">LAYER ACTIVITY</span>
          {totalActivities > 0 && (
            <span className="text-gray-500 text-[10px]">({totalActivities} events)</span>
          )}
        </div>
        <span className="text-gray-500 text-xs">{expanded ? 'â–¼' : 'â–¶'}</span>
      </button>
      
      {/* Compact View */}
      <div className="px-3 pb-3 space-y-1.5">
        {Object.entries(LAYER_CONFIGS).map(([key, config]) => {
          const isActive = layerActivity[key];
          const activities = layerActivities[key] || [];
          const latestActivity = activities[activities.length - 1];
          
          return (
            <div key={key} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                <span style={{ color: config.color === 'cyan' ? '#22D3EE' : config.color === 'orange' ? '#FB923C' : config.color === 'pink' ? '#F472B6' : config.color === 'blue' ? '#60A5FA' : config.color === 'emerald' ? '#34D399' : config.color === 'yellow' ? '#FACC15' : '#A78BFA' }}>
                  {config.emoji} {config.name}
                </span>
              </div>
              {latestActivity ? (
                <span className="text-gray-500 truncate max-w-[100px]" title={latestActivity.title}>
                  {latestActivity.title.substring(0, 15)}...
                </span>
              ) : (
                <span className="text-gray-600 text-[10px]">â€”</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="border-t border-gray-700 p-3 max-h-80 overflow-y-auto">
          {Object.entries(LAYER_CONFIGS).map(([key, config]) => {
            const activities = layerActivities[key] || [];
            const last5 = activities.slice(-5).reverse();
            
            return (
              <div key={key} className="mb-3 last:mb-0">
                <div className="text-xs font-medium mb-1" style={{ color: config.color === 'cyan' ? '#22D3EE' : config.color === 'orange' ? '#FB923C' : config.color === 'pink' ? '#F472B6' : config.color === 'blue' ? '#60A5FA' : config.color === 'emerald' ? '#34D399' : config.color === 'yellow' ? '#FACC15' : '#A78BFA' }}>
                  {config.emoji} {config.name} ({activities.length})
                </div>
                <div className="space-y-1 pl-4 border-l-2 border-gray-700/50 ml-1">
                  {last5.length === 0 ? (
                    <div className="text-[10px] text-gray-600 italic py-0.5">No activity yet</div>
                  ) : (
                    last5.map((activity, i) => (
                      <div key={i} className="text-xs py-0.5">
                        <span className="text-gray-500 font-mono text-[10px]">{activity.time}</span>
                        <span className="text-gray-300 ml-2">{activity.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// LIVE TRANSCRIPT PANEL
// ============================================================================

const LiveTranscriptPanel = ({ transcript, isRunning, expanded, onToggle }) => {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isRunning && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
          <span className="text-gray-400 text-xs font-medium">LIVE TRANSCRIPT</span>
          <span className="text-gray-500 text-xs">({transcript.length} turns)</span>
        </div>
        <span className="text-gray-500 text-xs">{expanded ? 'â–¼' : 'â–¶'}</span>
      </button>

      {!expanded && transcript.length > 0 && (
        <div className="px-3 pb-3">
          <div className="text-xs bg-black/30 rounded p-2">
            <span className={`font-medium ${transcript[transcript.length - 1].speaker === 'Dr. Martinez' ? 'text-orange-400' : 'text-blue-400'}`}>
              {transcript[transcript.length - 1].speaker}:
            </span>
            <span className="text-gray-400 ml-1 truncate">
              {transcript[transcript.length - 1].text.substring(0, 50)}...
            </span>
          </div>
        </div>
      )}

      {expanded && (
        <div ref={scrollRef} className="max-h-64 overflow-y-auto px-3 pb-3 space-y-2">
          {transcript.length === 0 ? (
            <div className="text-gray-500 text-xs italic">Waiting for encounter to start...</div>
          ) : (
            transcript.map((line, i) => (
              <div key={i} className="text-xs bg-black/20 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${line.speaker === 'Dr. Martinez' ? 'text-orange-400' : 'text-blue-400'}`}>
                    {line.speaker}
                  </span>
                  <span className="text-gray-600 text-[10px]">{line.timestamp}</span>
                </div>
                <div className="text-gray-300">{line.text}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// AGENT CARD
// ============================================================================

const AgentCard = ({ emoji, name, status, active, lastActivity }) => (
  <div className={`bg-black/30 rounded-lg p-2.5 border transition-all ${
    active ? 'border-green-500/50 shadow-lg shadow-green-500/10' : 'border-gray-700'
  }`}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-base">{emoji}</span>
      <span className="text-white font-medium text-xs">{name}</span>
      {active && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse ml-auto" />}
    </div>
    <div className={`text-xs ${active ? 'text-green-400' : 'text-gray-500'}`}>{status}</div>
    {lastActivity && <div className="text-[10px] text-gray-500 mt-1 truncate">{lastActivity}</div>}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HealthcareOrchestraAWVSimulation() {
  const [activeTab, setActiveTab] = useState('provider');
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Meta sub-tab state
  const [metaSubTab, setMetaSubTab] = useState('overview');
  
  // Expandable insights state (v2 feature)
  const [expandedInsights, setExpandedInsights] = useState({});
  
  // Panel states
  const [layerPanelExpanded, setLayerPanelExpanded] = useState(false);
  const [transcriptExpanded, setTranscriptExpanded] = useState(true);
  
  // Data states
  const [transcript, setTranscript] = useState([]);
  const [layerActivities, setLayerActivities] = useState({
    meta: [], provider: [], patient: [], admin: [], payer: [], agents: [], context: []
  });
  const [layerActivity, setLayerActivity] = useState({
    meta: true, provider: false, patient: false, admin: false, payer: false, agents: false, context: false
  });
  
  // Data Layer logs & stats (v2 feature)
  const [dataLayerLogs, setDataLayerLogs] = useState([]);
  const [dataLayerStats, setDataLayerStats] = useState({ reads: 0, writes: 0, apiCalls: 0, cacheHits: 0 });
  
  // UI states
  const [generatedNote, setGeneratedNote] = useState(null);
  const [awvChecklist, setAwvChecklist] = useState({
    healthRisk: false, medReview: false, functional: false, cognitive: false,
    depression: false, fallRisk: false, preventive: false, acp: false
  });
  const [detectedCodes, setDetectedCodes] = useState([]);
  const [qualityMeasures, setQualityMeasures] = useState([]);
  const [claimStatus, setClaimStatus] = useState(null);
  const [newRx, setNewRx] = useState(null);

  // Helper: Add layer activity
  const addLayerActivity = (layer, title) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLayerActivities(prev => ({
      ...prev,
      [layer]: [...(prev[layer] || []), { time, title }]
    }));
    setLayerActivity(prev => ({ ...prev, [layer]: true }));
    setTimeout(() => setLayerActivity(prev => ({ ...prev, [layer]: false })), 2000);
  };

  // Helper: Add data layer log (v2 feature)
  const addDataLog = (type, operation, details) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setDataLayerLogs(prev => [...prev, { time, type, operation, details }]);
    setDataLayerStats(prev => ({
      ...prev,
      reads: type === 'read' ? prev.reads + 1 : prev.reads,
      writes: type === 'write' ? prev.writes + 1 : prev.writes,
      apiCalls: type === 'api' ? prev.apiCalls + 1 : prev.apiCalls,
      cacheHits: type === 'cache' ? prev.cacheHits + 1 : prev.cacheHits
    }));
  };

  // Simulate encounter
  useEffect(() => {
    if (!isRunning) return;

    let currentIndex = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      while (currentIndex < ENCOUNTER_SCRIPT.length && ENCOUNTER_SCRIPT[currentIndex].time <= elapsed) {
        const line = ENCOUNTER_SCRIPT[currentIndex];
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        setTranscript(prev => [...prev, { ...line, timestamp }]);
        
        // Trigger activities based on conversation
        if (currentIndex === 0) {
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: Encounter started');
          addLayerActivity('provider', 'ðŸ’Š Rx: Loading medications');
          addLayerActivity('provider', 'ðŸ“‹ Planner: Loading care gaps');
          addLayerActivity('patient', 'Visit in progress');
          addLayerActivity('meta', 'Initializing context');
          addDataLog('read', 'Patient context loaded', 'FHIR Patient/123');
        }
        
        if (line.text.includes('water aerobics') || line.text.includes('hip')) {
          addLayerActivity('agents', 'Doc agent: THA follow-up');
          addLayerActivity('context', 'ICD-10: Z96.641');
          addDataLog('read', 'Surgical history query', 'THA records');
        }
        
        if (line.text.includes('blood pressure') || line.text.includes('vitals')) {
          setAwvChecklist(prev => ({ ...prev, healthRisk: true }));
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: Vitals captured');
          addDataLog('write', 'Vitals recorded', 'BP: 128/78');
        }
        
        if (line.text.includes('Metformin') || line.text.includes('medications')) {
          setAwvChecklist(prev => ({ ...prev, medReview: true }));
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: Med review');
          addLayerActivity('provider', 'ðŸ’Š Rx: Checking interactions');
          addLayerActivity('agents', 'Med review agent active');
          addLayerActivity('context', 'RxNorm lookup');
          addDataLog('read', 'Medication list', '5 active meds');
          addDataLog('api', 'Drug interaction check', 'No interactions');
        }
        
        if (line.text.includes('falls') || line.text.includes('balance')) {
          setAwvChecklist(prev => ({ ...prev, functional: true, fallRisk: true }));
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: Fall risk assessed');
          addLayerActivity('agents', 'Risk agent: Low fall risk');
          addDataLog('cache', 'Fall risk model', 'Cached result');
        }
        
        if (line.text.includes("today's date") || line.text.includes('cognitive')) {
          setAwvChecklist(prev => ({ ...prev, cognitive: true }));
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: Cognitive screening');
          addLayerActivity('agents', 'Cognitive: MMSE 30/30');
          addDataLog('api', 'MMSE scoring', '30/30');
        }
        
        if (line.text.includes('depressed') || line.text.includes('depression')) {
          setAwvChecklist(prev => ({ ...prev, depression: true }));
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: PHQ-2 negative');
          addLayerActivity('admin', 'Quality: Depression screen');
          addDataLog('write', 'Depression screen', 'PHQ-2: 0');
        }
        
        if (line.text.includes('mammogram') || line.text.includes('Flu shot')) {
          setAwvChecklist(prev => ({ ...prev, preventive: true }));
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: Preventive services');
          addLayerActivity('provider', 'ðŸ“‹ Planner: Preventive checklist');
          addLayerActivity('agents', 'Preventive services check');
          addLayerActivity('admin', 'Quality measures updated');
          addDataLog('api', 'HEDIS query', '3 measures');
        }
        
        if (line.text.includes('DEXA') || line.text.includes('bone density')) {
          addLayerActivity('provider', 'ðŸ“‹ Planner: DEXA gap identified');
          addLayerActivity('payer', 'DEXA coverage verified');
          addLayerActivity('agents', 'Care gap: DEXA overdue');
          addLayerActivity('meta', 'Learning: Care gap pattern');
          addDataLog('api', 'Prior auth check', 'Not required');
        }
        
        if (line.text.includes('advance directive') || line.text.includes('healthcare proxy')) {
          setAwvChecklist(prev => ({ ...prev, acp: true }));
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: ACP confirmed');
          addDataLog('read', 'ACP document', 'On file');
        }
        
        if (line.text.includes('crepitus') || line.text.includes('osteoarthritis')) {
          addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: New Dx detected');
          addLayerActivity('provider', 'ðŸ’Š Rx: Recommending PRN med');
          addLayerActivity('agents', 'Code assist: M17.11');
          addLayerActivity('context', 'ICD-10 lookup');
          setDetectedCodes(prev => [...prev, { code: 'M17.11', desc: 'Primary OA, left knee', confidence: 86 }]);
          setNewRx({ name: 'Acetaminophen 650mg', dose: 'Q6H PRN', reason: 'Knee pain' });
          addDataLog('api', 'NLP entity extraction', '4 entities');
        }

        currentIndex++;
      }

      // Complete encounter
      if (currentIndex >= ENCOUNTER_SCRIPT.length) {
        clearInterval(interval);
        setIsRunning(false);
        setIsComplete(true);
        setGeneratedNote(CLINICAL_NOTE);
        
        // Final activities
        addLayerActivity('provider', 'ðŸŽ™ï¸ Scribe: Note finalized');
        addLayerActivity('provider', 'ðŸ’Š Rx: No changes needed');
        addLayerActivity('provider', 'ðŸ“‹ Planner: DEXA ordered');
        addLayerActivity('meta', 'Learning from encounter');
        addLayerActivity('admin', 'Claim ready: G0439');
        addLayerActivity('payer', 'Pre-adjudication: PASS');
        addLayerActivity('patient', 'Summary available');
        
        // Final codes
        setDetectedCodes([
          { code: 'G0439', desc: 'Medicare AWV, subsequent', confidence: 99, primary: true },
          { code: 'Z00.00', desc: 'General adult exam', confidence: 98 },
          { code: 'Z96.641', desc: 'Right hip replacement', confidence: 97 },
          { code: 'E11.9', desc: 'Type 2 DM', confidence: 96 },
          { code: 'I10', desc: 'Hypertension', confidence: 95 },
          { code: 'M81.0', desc: 'Osteoporosis', confidence: 94 },
          { code: 'M17.11', desc: 'Primary OA, left knee', confidence: 86 }
        ]);

        // Quality measures
        setQualityMeasures([
          { measure: 'AWV Completion', status: 'Met', impact: '+1 encounter' },
          { measure: 'Osteoporosis Mgmt', status: 'Closing', impact: '+0.02 Stars' },
          { measure: 'DM Control (A1c)', status: 'Met', impact: 'Maintained' },
          { measure: 'HTN Control', status: 'Met', impact: 'Maintained' },
          { measure: 'Depression Screen', status: 'Met', impact: '+1 screen' },
          { measure: 'Fall Risk Screen', status: 'Met', impact: '+1 screen' }
        ]);

        // Claim status
        setClaimStatus({ status: 'Ready', cleanScore: 99, expectedPayment: '$147.68' });

        addDataLog('write', 'Encounter saved', 'Complete record');
        addDataLog('api', 'Quality update', '6 measures');
        addDataLog('api', 'Claim validation', '99% clean');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Reset function
  const resetSimulation = () => {
    setIsComplete(false);
    setTranscript([]);
    setLayerActivities({ meta: [], provider: [], patient: [], admin: [], payer: [], agents: [], context: [] });
    setDetectedCodes([]);
    setQualityMeasures([]);
    setGeneratedNote(null);
    setAwvChecklist({ healthRisk: false, medReview: false, functional: false, cognitive: false, depression: false, fallRisk: false, preventive: false, acp: false });
    setClaimStatus(null);
    setDataLayerLogs([]);
    setDataLayerStats({ reads: 0, writes: 0, apiCalls: 0, cacheHits: 0 });
    setExpandedInsights({});
    setNewRx(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">ðŸŽ¼</span>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Healthcare Orchestra v4.2
            </h1>
            <p className="text-gray-500 text-xs">9-Layer Intelligence Platform â€¢ AWV Simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-3">
            <div className="text-white text-sm font-medium">{PATIENT_DATA.name}</div>
            <div className="text-gray-500 text-xs">{PATIENT_DATA.insurance.planName}</div>
          </div>
          {!isRunning && !isComplete && (
            <button
              onClick={() => setIsRunning(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 rounded-lg text-sm font-medium transition-all"
            >
              â–¶ Start Encounter
            </button>
          )}
          {isRunning && (
            <button
              onClick={() => { setIsRunning(false); setIsComplete(true); }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium"
            >
              â¬› Stop
            </button>
          )}
          {isComplete && (
            <button onClick={resetSimulation} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">
              â†» Reset
            </button>
          )}
        </div>
      </div>

      {/* Tabs - NO DISCOVERY (it has its own prototype) */}
      <div className="flex border-b border-gray-700 mb-3 overflow-x-auto">
        <TabButton id="meta" label="Meta" emoji="ðŸ”®" active={activeTab === 'meta'} onClick={setActiveTab} />
        <TabButton id="provider" label="Provider (L5)" emoji="ðŸ‘¨â€âš•ï¸" active={activeTab === 'provider'} onClick={setActiveTab} badge="3" />
        <TabButton id="patient" label="Patient" emoji="ðŸ‘¤" active={activeTab === 'patient'} onClick={setActiveTab} />
        <TabButton id="admin" label="Hospital" emoji="ðŸ¥" active={activeTab === 'admin'} onClick={setActiveTab} />
        <TabButton id="payer" label="Payer" emoji="ðŸ¢" active={activeTab === 'payer'} onClick={setActiveTab} />
        <TabButton id="agents" label="Agents" emoji="ðŸ¤–" active={activeTab === 'agents'} onClick={setActiveTab} />
        <TabButton id="context" label="Context" emoji="ðŸ“š" active={activeTab === 'context'} onClick={setActiveTab} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Main Content */}
        <div className="lg:col-span-3">
          
          {/* === META TAB with Sub-tabs and Expandable Insights === */}
          {activeTab === 'meta' && (
            <div className="rounded-xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">ðŸ”®</span>
                  <div>
                    <h2 className="text-white font-bold text-sm">Meta Layer â€” L0</h2>
                    <p className="text-cyan-300 text-xs">Cross-Stakeholder Intelligence</p>
                  </div>
                </div>
                <StatusBadge status="Learning" color="cyan" />
              </div>

              {/* Meta Sub-tabs */}
              <div className="flex gap-2 mb-3">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'data', label: 'Data Layer' },
                  { id: 'learning', label: 'Learning' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setMetaSubTab(tab.id)}
                    className={`px-3 py-1 rounded text-xs ${
                      metaSubTab === tab.id 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Sub-Tab */}
              {metaSubTab === 'overview' && (
                <>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-cyan-400">98.5%</div>
                      <div className="text-gray-400 text-[10px]">AWV Complete</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-green-400">97%</div>
                      <div className="text-gray-400 text-[10px]">Code Accuracy</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-purple-400">2,847</div>
                      <div className="text-gray-400 text-[10px]">Similar Patients</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-cyan-400">4.3â˜…</div>
                      <div className="text-gray-400 text-[10px]">Practice Score</div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 mb-3">
                    <div className="text-gray-400 text-xs mb-2">LEARNING LOG</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {(layerActivities.meta || []).slice(-6).reverse().map((activity, i) => (
                        <div key={i} className="text-xs p-1.5 bg-gray-800/50 rounded">
                          <span className="text-gray-500">{activity.time}</span>
                          <span className="text-cyan-400 ml-2">{activity.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EXPANDABLE INSIGHT CARDS (v2 feature) */}
                  <div className="space-y-2">
                    <div className="text-gray-400 text-xs">GENERATED INSIGHTS (click to expand)</div>
                    
                    {/* Insight 1: Hip Outcomes */}
                    <div 
                      className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg overflow-hidden cursor-pointer transition-all"
                      onClick={() => setExpandedInsights(prev => ({ ...prev, hip: !prev.hip }))}
                    >
                      <div className="p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-cyan-400">ðŸ’¡</span>
                          <span className="text-cyan-200">Mrs. Chen's hip outcomes at 10mo are in top 15% for her age group.</span>
                        </div>
                        <span className="text-cyan-500 text-xs">{expandedInsights.hip ? 'â–¼' : 'â–¶'}</span>
                      </div>
                      {expandedInsights.hip && (
                        <div className="border-t border-cyan-500/20 p-3 bg-black/30 space-y-2">
                          <div className="text-[10px] text-gray-400 font-medium">ðŸ§  REASONING</div>
                          <div className="text-xs text-gray-300 space-y-1">
                            <p>â€¢ Analyzed THA recovery data: ROM 110Â° flexion (above 100Â° threshold)</p>
                            <p>â€¢ Compared against 2,847 similar patients (68F, THA, 10mo post-op)</p>
                            <p>â€¢ Gait analysis: Non-antalgic, smooth cadence (top 15th percentile)</p>
                            <p>â€¢ Functional status: Water aerobics 2x/week + daily 30min walks</p>
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium mt-2">ðŸ“Š DATA SOURCES</div>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px]">PostgreSQL</span>
                            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[9px]">FHIR Server</span>
                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded text-[9px]">Outcomes Registry</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium mt-2">ðŸ¤– MODELS USED</div>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[9px]">OutcomePredictor v2.1</span>
                            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[9px]">PopulationBenchmark</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium mt-2">âš¡ API CALLS</div>
                          <div className="font-mono text-[9px] text-gray-400 bg-gray-900/50 p-1.5 rounded">
                            GET /analytics/tha-outcomes?age=68&months=10 â†’ 200 OK (89ms)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Insight 2: DEXA Gap */}
                    {isComplete && (
                      <div 
                        className="bg-green-500/10 border border-green-500/30 rounded-lg overflow-hidden cursor-pointer transition-all"
                        onClick={() => setExpandedInsights(prev => ({ ...prev, dexa: !prev.dexa }))}
                      >
                        <div className="p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-green-400">âœ“</span>
                            <span className="text-green-200">DEXA order closes osteoporosis gap. Stars: +0.02</span>
                          </div>
                          <span className="text-green-500 text-xs">{expandedInsights.dexa ? 'â–¼' : 'â–¶'}</span>
                        </div>
                        {expandedInsights.dexa && (
                          <div className="border-t border-green-500/20 p-3 bg-black/30 space-y-2">
                            <div className="text-[10px] text-gray-400 font-medium">ðŸ§  REASONING</div>
                            <div className="text-xs text-gray-300 space-y-1">
                              <p>â€¢ Detected care gap: Last DEXA 01/2022 (24+ months overdue)</p>
                              <p>â€¢ Patient has M81.0 (Osteoporosis) + Alendronate therapy</p>
                              <p>â€¢ HEDIS measure: "Osteoporosis Management in Women" requires DEXA</p>
                              <p>â€¢ Order placed today â†’ Gap status: CLOSING</p>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">â­ STARS IMPACT</div>
                            <div className="text-xs text-gray-300 space-y-1">
                              <p>â€¢ Practice has 847 Medicare patients in OMW measure</p>
                              <p>â€¢ Current compliance: 78.2% â†’ Projected: 78.3%</p>
                              <p>â€¢ Stars contribution: 4.18 â†’ 4.20 (+0.02)</p>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">ðŸ“Š DATA SOURCES</div>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px]">PostgreSQL</span>
                              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[9px]">HEDIS API</span>
                              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[9px]">CMS Stars DB</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">âš¡ API CALLS</div>
                            <div className="font-mono text-[9px] text-gray-400 bg-gray-900/50 p-1.5 rounded space-y-0.5">
                              <div>GET /hedis/measures/OMW â†’ 200 OK (45ms)</div>
                              <div>POST /orders/imaging â†’ 201 Created (67ms)</div>
                              <div>PUT /quality/gaps/close â†’ 200 OK (23ms)</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Insight 3: AWV Complete */}
                    {isComplete && (
                      <div 
                        className="bg-blue-500/10 border border-blue-500/30 rounded-lg overflow-hidden cursor-pointer transition-all"
                        onClick={() => setExpandedInsights(prev => ({ ...prev, awv: !prev.awv }))}
                      >
                        <div className="p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-blue-400">ðŸ“‹</span>
                            <span className="text-blue-200">AWV 8/8 components complete. Clean claim: 99% probability.</span>
                          </div>
                          <span className="text-blue-500 text-xs">{expandedInsights.awv ? 'â–¼' : 'â–¶'}</span>
                        </div>
                        {expandedInsights.awv && (
                          <div className="border-t border-blue-500/20 p-3 bg-black/30 space-y-2">
                            <div className="text-[10px] text-gray-400 font-medium">ðŸ§  REASONING</div>
                            <div className="text-xs text-gray-300 space-y-1">
                              <p>â€¢ Verified all 8 Medicare AWV required components documented</p>
                              <p>â€¢ G0439 (Subsequent AWV) - last AWV was 01/2024 (eligible)</p>
                              <p>â€¢ All supporting ICD-10 codes validated against LCD L33393</p>
                              <p>â€¢ Provider NPI in-network with UHC Medicare Advantage</p>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">âœ“ COMPONENTS VERIFIED</div>
                            <div className="grid grid-cols-2 gap-1 text-[9px]">
                              <span className="text-green-400">âœ“ Health Risk Assessment</span>
                              <span className="text-green-400">âœ“ Medication Review</span>
                              <span className="text-green-400">âœ“ Functional Assessment</span>
                              <span className="text-green-400">âœ“ Cognitive Assessment</span>
                              <span className="text-green-400">âœ“ Depression Screening</span>
                              <span className="text-green-400">âœ“ Fall Risk Assessment</span>
                              <span className="text-green-400">âœ“ Preventive Services</span>
                              <span className="text-green-400">âœ“ Advance Care Planning</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">âš¡ THIRD-PARTY SERVICES</div>
                            <div className="font-mono text-[9px] text-gray-400 bg-gray-900/50 p-1.5 rounded space-y-0.5">
                              <div>Availity â†’ POST /claims/validate â†’ 200 OK (156ms)</div>
                              <div>UHC Real-Time â†’ POST /adjudicate/predict â†’ 200 OK (234ms)</div>
                              <div>CMS NCCI â†’ GET /edits/check â†’ 200 OK (67ms)</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Insight 4: New Diagnosis */}
                    {isComplete && (
                      <div 
                        className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg overflow-hidden cursor-pointer transition-all"
                        onClick={() => setExpandedInsights(prev => ({ ...prev, knee: !prev.knee }))}
                      >
                        <div className="p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-yellow-400">ðŸ”</span>
                            <span className="text-yellow-200">New diagnosis detected: M17.11 Left knee OA (86% confidence)</span>
                          </div>
                          <span className="text-yellow-500 text-xs">{expandedInsights.knee ? 'â–¼' : 'â–¶'}</span>
                        </div>
                        {expandedInsights.knee && (
                          <div className="border-t border-yellow-500/20 p-3 bg-black/30 space-y-2">
                            <div className="text-[10px] text-gray-400 font-medium">ðŸ§  REASONING</div>
                            <div className="text-xs text-gray-300 space-y-1">
                              <p>â€¢ NLP extracted: "morning stiffness", "crepitus", "full ROM"</p>
                              <p>â€¢ Physical exam: mild crepitus on left knee, no effusion</p>
                              <p>â€¢ Pattern matches ICD-10 M17.11 (Primary OA, left knee)</p>
                              <p>â€¢ Confidence: 86% (below 95% threshold - flagged for review)</p>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">ðŸ”¬ CLINICAL NLP EXTRACTION</div>
                            <div className="font-mono text-[9px] text-gray-400 bg-gray-900/50 p-1.5 rounded">
                              <div className="text-green-400">Entities found:</div>
                              <div>  â€¢ "morning stiffness" â†’ SYMPTOM (onset: AM)</div>
                              <div>  â€¢ "crepitus" â†’ FINDING (location: left knee)</div>
                              <div>  â€¢ "full ROM" â†’ FINDING (negative modifier)</div>
                              <div>  â€¢ "no effusion" â†’ FINDING (negated)</div>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">ðŸ¤– MODELS USED</div>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[9px]">MedSpaCy NER</span>
                              <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[9px]">BioBERT-ICD v3</span>
                              <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[9px]">ClinicalBERT</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-2">âš¡ API CALLS</div>
                            <div className="font-mono text-[9px] text-gray-400 bg-gray-900/50 p-1.5 rounded space-y-0.5">
                              <div>POST /nlp/extract â†’ 200 OK (78ms)</div>
                              <div>POST /ml/icd-suggest â†’ 200 OK (156ms)</div>
                              <div>GET /terminology/icd10/M17.11 â†’ 200 OK (12ms)</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Data Layer Sub-Tab */}
              {metaSubTab === 'data' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-purple-400">{dataLayerStats.reads}</div>
                      <div className="text-gray-400 text-[10px]">DB Reads</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-green-400">{dataLayerStats.writes}</div>
                      <div className="text-gray-400 text-[10px]">DB Writes</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-blue-400">{dataLayerStats.apiCalls}</div>
                      <div className="text-gray-400 text-[10px]">API Calls</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-yellow-400">{dataLayerStats.cacheHits}</div>
                      <div className="text-gray-400 text-[10px]">Cache Hits</div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-2">DATA LAYER ACTIVITY</div>
                    <div className="space-y-1 max-h-48 overflow-y-auto font-mono">
                      {dataLayerLogs.length === 0 ? (
                        <div className="text-gray-500 text-xs">Waiting for data operations...</div>
                      ) : (
                        dataLayerLogs.slice(-12).reverse().map((log, i) => (
                          <div key={i} className={`text-[11px] p-1.5 rounded flex items-start gap-2 ${
                            log.type === 'read' ? 'bg-purple-500/10' :
                            log.type === 'write' ? 'bg-green-500/10' :
                            log.type === 'api' ? 'bg-blue-500/10' :
                            'bg-yellow-500/10'
                          }`}>
                            <span className="text-gray-500 shrink-0">{log.time}</span>
                            <span className={`shrink-0 ${
                              log.type === 'read' ? 'text-purple-400' :
                              log.type === 'write' ? 'text-green-400' :
                              log.type === 'api' ? 'text-blue-400' :
                              'text-yellow-400'
                            }`}>{log.operation}</span>
                            <span className="text-gray-500">â€¢ {log.details}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Sub-Tab */}
              {metaSubTab === 'learning' && (
                <div className="space-y-3">
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-2">MODEL PERFORMANCE</div>
                    <div className="space-y-2">
                      {[
                        { name: 'Code Assist (ICD-10)', accuracy: '97.2%', calls: detectedCodes.length },
                        { name: 'AWV Compliance', accuracy: '98.5%', calls: Object.values(awvChecklist).filter(v => v).length },
                        { name: 'Denial Predictor', accuracy: '91.3%', calls: claimStatus ? 1 : 0 },
                        { name: 'Care Gap Detector', accuracy: '94.7%', calls: isComplete ? 2 : 0 }
                      ].map((model, i) => (
                        <div key={i} className="flex items-center justify-between text-xs p-2 bg-gray-800/50 rounded">
                          <span className="text-gray-300">{model.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-green-400">{model.accuracy}</span>
                            <span className="text-gray-500">{model.calls} calls</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-2">PATTERNS LEARNED THIS SESSION</div>
                    <div className="space-y-1 text-xs">
                      {isComplete ? (
                        <>
                          <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-300">âœ“ THA recovery benchmarking for 68F patients</div>
                          <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-300">âœ“ DEXA gap â†’ order timing optimization</div>
                          <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-300">âœ“ AWV component capture sequence</div>
                          <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-300">âœ“ OA detection confidence calibration</div>
                        </>
                      ) : (
                        <div className="text-gray-500 italic">Patterns will be captured during encounter...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <CrossLayerActivityPanel layerActivities={layerActivities} layerActivity={layerActivity} currentLayer="meta" />
            </div>
          )}
          
          {/* === PROVIDER TAB with 3 Apps === */}
          {activeTab === 'provider' && (
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">ðŸ‘¨â€âš•ï¸</span>
                  <div>
                    <h2 className="text-white font-bold">Provider Layer (L5)</h2>
                    <p className="text-orange-300 text-sm">3 Apps Running Simultaneously â€¢ {PATIENT_DATA.insurance.pcp}</p>
                  </div>
                </div>
                <StatusBadge status={isRunning ? 'Recording' : isComplete ? 'Complete' : 'Ready'} color={isRunning ? 'red' : isComplete ? 'green' : 'orange'} />
              </div>
              
              {/* Three Apps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* SCRIBE APP */}
                <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/10 rounded-xl border border-orange-500/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">ðŸŽ™ï¸</span>
                      <div>
                        <div className="text-white font-semibold text-sm">Ambient Scribe</div>
                        <div className="text-orange-400 text-[10px]">Documentation</div>
                      </div>
                    </div>
                    <StatusBadge status={isRunning ? 'Recording' : isComplete ? 'Done' : 'Ready'} color={isRunning ? 'red' : isComplete ? 'green' : 'orange'} />
                  </div>
                  
                  {isRunning && (
                    <div className="bg-black/40 rounded-lg p-2 mb-2">
                      <Waveform />
                    </div>
                  )}
                  
                  {/* AWV Components */}
                  <div className="bg-black/30 rounded-lg p-2 mb-2">
                    <div className="text-gray-500 text-[10px] mb-1.5">AWV COMPONENTS</div>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { key: 'healthRisk', label: 'Health Risk' },
                        { key: 'medReview', label: 'Med Review' },
                        { key: 'functional', label: 'Functional' },
                        { key: 'cognitive', label: 'Cognitive' },
                        { key: 'depression', label: 'Depression' },
                        { key: 'fallRisk', label: 'Fall Risk' },
                        { key: 'preventive', label: 'Preventive' },
                        { key: 'acp', label: 'ACP' }
                      ].map(item => (
                        <div key={item.key} className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${awvChecklist[item.key] ? 'bg-green-500/20 text-green-400' : 'text-gray-500'}`}>
                          <span>{awvChecklist[item.key] ? 'âœ“' : 'â—‹'}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-1.5 text-center text-[10px] font-bold py-0.5 rounded ${
                      Object.values(awvChecklist).filter(v => v).length === 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {Object.values(awvChecklist).filter(v => v).length}/8 Complete
                    </div>
                  </div>
                  
                  {/* Detected Codes */}
                  <div className="bg-black/30 rounded-lg p-2">
                    <div className="text-gray-500 text-[10px] mb-1.5">DETECTED CODES</div>
                    <div className="space-y-0.5 max-h-20 overflow-y-auto">
                      {detectedCodes.length === 0 ? (
                        <div className="text-gray-600 text-[10px] italic">Listening...</div>
                      ) : (
                        detectedCodes.slice(0, 4).map((code, i) => (
                          <div key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${code.primary ? 'bg-green-500/20' : 'bg-gray-800/50'}`}>
                            <span className={`font-mono ${code.primary ? 'text-green-400' : 'text-yellow-400'}`}>{code.code}</span>
                            <span className="text-gray-500 ml-1">{code.desc?.substring(0, 12)}...</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* PRESCRIBE APP */}
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 rounded-xl border border-green-500/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">ðŸ’Š</span>
                      <div>
                        <div className="text-white font-semibold text-sm">Rx Assistant</div>
                        <div className="text-green-400 text-[10px]">Medications</div>
                      </div>
                    </div>
                    <StatusBadge status={isRunning ? 'Monitoring' : isComplete ? 'Reviewed' : 'Ready'} color={isRunning ? 'yellow' : isComplete ? 'green' : 'blue'} />
                  </div>
                  
                  {/* Current Meds */}
                  <div className="bg-black/30 rounded-lg p-2 mb-2">
                    <div className="text-gray-500 text-[10px] mb-1.5">ACTIVE MEDICATIONS ({PATIENT_DATA.medications.length})</div>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {PATIENT_DATA.medications.map((med, i) => (
                        <div key={i} className="flex items-center justify-between text-[10px] p-1 bg-gray-800/50 rounded">
                          <span className="text-white truncate max-w-[100px]">{med.name}</span>
                          <span className="text-green-400">âœ“</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Interaction Check */}
                  <div className="bg-black/30 rounded-lg p-2 mb-2">
                    <div className="text-gray-500 text-[10px] mb-1">INTERACTION CHECK</div>
                    <div className="text-[10px] text-green-400 p-1 bg-green-500/10 rounded">âœ“ No interactions</div>
                  </div>
                  
                  {/* New Rx */}
                  {newRx && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                      <div className="text-blue-400 text-[10px] font-medium">ðŸ’¡ NEW Rx</div>
                      <div className="text-white text-[10px]">{newRx.name}</div>
                      <div className="text-gray-400 text-[10px]">{newRx.dose}</div>
                    </div>
                  )}
                </div>

                {/* FOLLOW-UP APP */}
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 rounded-xl border border-blue-500/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">ðŸ“‹</span>
                      <div>
                        <div className="text-white font-semibold text-sm">Care Planner</div>
                        <div className="text-blue-400 text-[10px]">Follow-up</div>
                      </div>
                    </div>
                    <StatusBadge status={isRunning ? 'Tracking' : isComplete ? 'Updated' : 'Ready'} color={isRunning ? 'yellow' : isComplete ? 'green' : 'blue'} />
                  </div>
                  
                  {/* Care Gaps */}
                  <div className="bg-black/30 rounded-lg p-2 mb-2">
                    <div className="text-gray-500 text-[10px] mb-1.5">CARE GAPS</div>
                    <div className="space-y-1">
                      <div className={`flex items-center justify-between text-[10px] p-1.5 rounded ${isComplete ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <span className="text-gray-300">DEXA Scan</span>
                        <span className={isComplete ? 'text-green-400' : 'text-red-400'}>{isComplete ? 'âœ“ Ordered' : 'Overdue'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] p-1.5 rounded bg-yellow-500/10">
                        <span className="text-gray-300">A1c Lab</span>
                        <span className="text-yellow-400">Due 2 wks</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Follow-up Schedule */}
                  <div className="bg-black/30 rounded-lg p-2">
                    <div className="text-gray-500 text-[10px] mb-1">FOLLOW-UP</div>
                    <div className="text-[10px] text-gray-300 p-1.5 bg-gray-800/50 rounded">
                      ðŸ“… 6-month visit â€¢ July 2025
                    </div>
                    {isComplete && (
                      <div className="text-[10px] text-green-400 p-1.5 bg-green-500/10 rounded mt-1">
                        ðŸ¦´ DEXA Scan â€¢ Ordered
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Generated Note */}
              {isComplete && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">ðŸ“„ Generated Clinical Note</h3>
                    <StatusBadge status="Finalized" color="green" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-orange-400 font-medium mb-1">Visit Type</div>
                      <div className="text-gray-300">{generatedNote.visitType}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-medium mb-1">Chief Complaint</div>
                      <div className="text-gray-300">{generatedNote.cc}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-orange-400 font-medium mb-1">HPI</div>
                      <div className="text-gray-300 text-xs">{generatedNote.hpi}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-medium mb-1">Assessment</div>
                      <div className="text-gray-400 text-[11px] whitespace-pre-line font-mono">{generatedNote.assessment}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-medium mb-1">Plan</div>
                      <div className="text-gray-400 text-[11px] whitespace-pre-line font-mono">{generatedNote.plan}</div>
                    </div>
                  </div>
                </div>
              )}

              <CrossLayerActivityPanel layerActivities={layerActivities} layerActivity={layerActivity} currentLayer="provider" />
            </div>
          )}

          {/* === PATIENT TAB === */}
          {activeTab === 'patient' && (
            <div className="rounded-xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-900/20 to-pink-800/10 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">ðŸ‘¤</span>
                <div>
                  <h2 className="text-white font-bold text-sm">Patient Portal â€” L6</h2>
                  <p className="text-pink-300 text-xs">{PATIENT_DATA.name}'s MyUHC App</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-2">TODAY'S VISIT</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="text-white">Annual Wellness Visit</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Provider</span><span className="text-white">{PATIENT_DATA.insurance.pcp}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Status</span>
                      <StatusBadge status={isComplete ? 'Complete' : isRunning ? 'In Progress' : 'Scheduled'} color={isComplete ? 'green' : isRunning ? 'blue' : 'yellow'} />
                    </div>
                    <div className="flex justify-between"><span className="text-gray-400">Your Cost</span><span className="text-green-400">$0 (AWV Covered)</span></div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-2">NEXT STEPS</div>
                  <div className="space-y-1 text-xs">
                    {isComplete ? (
                      <>
                        <div className="p-1.5 bg-green-500/20 rounded text-green-400">âœ“ Visit summary available</div>
                        <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">ðŸ“… DEXA scan to be scheduled</div>
                        <div className="p-1.5 bg-gray-800 rounded text-gray-300">Follow-up: 6 months</div>
                      </>
                    ) : (
                      <div className="text-gray-500 italic">Updates will appear after visit...</div>
                    )}
                  </div>
                </div>
              </div>

              <CrossLayerActivityPanel layerActivities={layerActivities} layerActivity={layerActivity} currentLayer="patient" />
            </div>
          )}

          {/* === ADMIN TAB === */}
          {activeTab === 'admin' && (
            <div className="rounded-xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">ðŸ¥</span>
                <div>
                  <h2 className="text-white font-bold text-sm">Hospital Admin â€” L4</h2>
                  <p className="text-blue-300 text-xs">Revenue Cycle & Quality</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-blue-400">G0439</div>
                  <div className="text-gray-400 text-[10px]">CPT Code</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-400">{claimStatus?.expectedPayment || 'â€”'}</div>
                  <div className="text-gray-400 text-[10px]">Expected</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-400">{claimStatus?.cleanScore || 'â€”'}%</div>
                  <div className="text-gray-400 text-[10px]">Clean Claim</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-emerald-400">4.2â˜…</div>
                  <div className="text-gray-400 text-[10px]">Stars Impact</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-2">QUALITY MEASURES</div>
                <div className="space-y-1">
                  {qualityMeasures.length === 0 ? (
                    <div className="text-gray-500 text-xs">Measures will populate...</div>
                  ) : (
                    qualityMeasures.map((m, i) => (
                      <div key={i} className={`flex items-center justify-between text-xs p-1.5 rounded ${m.status === 'Met' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                        <span className="text-gray-300">{m.measure}</span>
                        <div className="flex items-center gap-2">
                          <span className={m.status === 'Met' ? 'text-green-400' : 'text-yellow-400'}>{m.status}</span>
                          <span className="text-gray-500 text-[10px]">{m.impact}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <CrossLayerActivityPanel layerActivities={layerActivities} layerActivity={layerActivity} currentLayer="admin" />
            </div>
          )}

          {/* === PAYER TAB === */}
          {activeTab === 'payer' && (
            <div className="rounded-xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">ðŸ¢</span>
                <div>
                  <h2 className="text-white font-bold text-sm">Payer Intelligence â€” L3</h2>
                  <p className="text-emerald-300 text-xs">{PATIENT_DATA.insurance.planName}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-emerald-400">Active</div>
                  <div className="text-gray-400 text-[10px]">Coverage</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-400">$0</div>
                  <div className="text-gray-400 text-[10px]">Patient Resp</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-cyan-400">N/A</div>
                  <div className="text-gray-400 text-[10px]">Prior Auth</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-2">DYNAMIC ASSURANCE</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs p-1.5 bg-green-500/10 rounded">
                    <span className="text-gray-300">AWV Coverage</span>
                    <span className="text-green-400">âœ“ 100% Preventive</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-1.5 bg-green-500/10 rounded">
                    <span className="text-gray-300">Medical Necessity</span>
                    <span className="text-green-400">âœ“ Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-1.5 bg-green-500/10 rounded">
                    <span className="text-gray-300">DEXA Pre-Auth</span>
                    <span className="text-green-400">âœ“ Not Required</span>
                  </div>
                </div>
              </div>

              <CrossLayerActivityPanel layerActivities={layerActivities} layerActivity={layerActivity} currentLayer="payer" />
            </div>
          )}

          {/* === AGENTS TAB === */}
          {activeTab === 'agents' && (
            <div className="rounded-xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">ðŸ¤–</span>
                <div>
                  <h2 className="text-white font-bold text-sm">AI Agents</h2>
                  <p className="text-yellow-300 text-xs">Specialized Healthcare Intelligence</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <AgentCard emoji="ðŸ“" name="Documentation" status={isRunning ? 'Processing' : 'Idle'} active={isRunning} />
                <AgentCard emoji="ðŸ·ï¸" name="Code Assist" status={isRunning ? 'Detecting' : 'Idle'} active={isRunning} />
                <AgentCard emoji="âœ“" name="AWV Compliance" status={isComplete ? '8/8 Complete' : isRunning ? 'Checking' : 'Idle'} active={isRunning || isComplete} />
                <AgentCard emoji="â­" name="Quality Measures" status={isComplete ? '6 Met' : isRunning ? 'Tracking' : 'Idle'} active={isRunning || isComplete} />
                <AgentCard emoji="ðŸ©º" name="Care Gap" status={isComplete ? 'DEXA Ordered' : isRunning ? 'Scanning' : 'Idle'} active={isRunning || isComplete} />
                <AgentCard emoji="âš ï¸" name="Risk Assessment" status={isRunning ? 'Low Risk' : 'Idle'} active={isRunning} />
              </div>

              <CrossLayerActivityPanel layerActivities={layerActivities} layerActivity={layerActivity} currentLayer="agents" />
            </div>
          )}

          {/* === CONTEXT TAB === */}
          {activeTab === 'context' && (
            <div className="rounded-xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">ðŸ“š</span>
                <div>
                  <h2 className="text-white font-bold text-sm">Context Layer</h2>
                  <p className="text-purple-300 text-xs">Healthcare Knowledge Base</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {[
                  { name: 'ICD-10-CM', count: '72,000+' },
                  { name: 'CPT/HCPCS', count: '10,000+' },
                  { name: 'SNOMED CT', count: '350,000+' },
                  { name: 'RxNorm', count: '200,000+' },
                  { name: 'LCD/NCD', count: '1,800+' },
                  { name: 'NCCI Edits', count: '700,000+' },
                  { name: 'HEDIS', count: '90+' },
                  { name: 'LOINC', count: '96,000+' }
                ].map((item, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-2 text-center">
                    <div className="text-purple-400 font-bold text-sm">{item.count}</div>
                    <div className="text-gray-400 text-[10px]">{item.name}</div>
                  </div>
                ))}
              </div>

              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-2">RECENT LOOKUPS</div>
                <div className="space-y-1">
                  {(layerActivities.context || []).slice(-6).reverse().map((activity, i) => (
                    <div key={i} className="text-xs p-1.5 bg-gray-800/50 rounded">
                      <span className="text-gray-500">{activity.time}</span>
                      <span className="text-purple-400 ml-2">{activity.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CrossLayerActivityPanel layerActivities={layerActivities} layerActivity={layerActivity} currentLayer="context" />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <LayerActivityPanel
            layerActivities={layerActivities}
            layerActivity={layerActivity}
            expanded={layerPanelExpanded}
            onToggle={() => setLayerPanelExpanded(!layerPanelExpanded)}
          />
          
          <LiveTranscriptPanel
            transcript={transcript}
            isRunning={isRunning}
            expanded={transcriptExpanded}
            onToggle={() => setTranscriptExpanded(!transcriptExpanded)}
          />

          {/* Platform Stats */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-3">
            <div className="text-gray-400 text-xs font-medium mb-2">PLATFORM STATS</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Architecture</span>
                <span className="text-white">9 Layers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider Apps</span>
                <span className="text-orange-400">3 Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Knowledge Items</span>
                <span className="text-purple-400">1M+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span className="text-cyan-400">v4.2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
