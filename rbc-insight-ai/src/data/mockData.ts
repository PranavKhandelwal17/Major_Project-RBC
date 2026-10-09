import type {
  AnalysisResult,
  HistoryItem,
  MorphologyClass,
  PredictionItem,
} from '../types';

// ============================================================
// Mock Data for Demo Mode
// ============================================================

export const MORPHOLOGY_CLASSES: MorphologyClass[] = [
  'Normal',
  'Macrocyte',
  'Microcyte',
  'Spherocyte',
  'Target Cell',
  'Stomatocyte',
  'Ovalocyte',
  'Teardrop',
  'Burr Cell',
  'Schistocyte',
  'Hypochromia',
  'Uncategorized',
];

export const MORPHOLOGY_COLORS: Record<MorphologyClass, string> = {
  Normal: '#22c55e',
  Macrocyte: '#3b82f6',
  Microcyte: '#a855f7',
  Spherocyte: '#f59e0b',
  'Target Cell': '#14b8a6',
  Stomatocyte: '#ef4444',
  Ovalocyte: '#f97316',
  Teardrop: '#8b5cf6',
  'Burr Cell': '#ec4899',
  Schistocyte: '#0ea5e9',
  Hypochromia: '#84cc16',
  Uncategorized: '#94a3b8',
};

export const MORPHOLOGY_DESCRIPTIONS: Record<MorphologyClass, string> = {
  Normal: 'Biconcave disc shape, 6-8μm diameter, normal hemoglobin content.',
  Macrocyte: 'Larger than normal RBCs (>8μm), often associated with B12/folate deficiency.',
  Microcyte: 'Smaller than normal RBCs (<6μm), associated with iron deficiency or thalassemia.',
  Spherocyte: 'Spherical shape, loss of central pallor, seen in hereditary spherocytosis.',
  'Target Cell': 'Bull-eye appearance, seen in thalassemia and liver disease.',
  Stomatocyte: 'Mouth-like slit in center, seen in liver disease and alcoholism.',
  Ovalocyte: 'Oval/elliptical shape, seen in hereditary elliptocytosis.',
  Teardrop: 'Teardrop-shaped RBC, seen in myelofibrosis and bone marrow infiltration.',
  'Burr Cell': 'Spiculated RBC (echinocyte), seen in uremia and liver disease.',
  Schistocyte: 'Fragmented RBC, seen in microangiopathic hemolytic anemia.',
  Hypochromia: 'Pale RBCs with increased central pallor, indicates low hemoglobin.',
  Uncategorized: 'Morphology does not clearly fit any of the above categories.',
};

// Mock RBC images using SVG data URIs
export const MOCK_RBC_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#1a0a0a"/>
  <circle cx="80" cy="80" r="28" fill="#cc3333" opacity="0.85"/>
  <circle cx="80" cy="80" r="16" fill="#992222" opacity="0.6"/>
  <circle cx="160" cy="60" r="24" fill="#dd3333" opacity="0.8"/>
  <circle cx="160" cy="60" r="14" fill="#aa2222" opacity="0.55"/>
  <circle cx="240" cy="90" r="26" fill="#cc2222" opacity="0.85"/>
  <circle cx="240" cy="90" r="15" fill="#991111" opacity="0.6"/>
  <circle cx="320" cy="70" r="22" fill="#dd4444" opacity="0.8"/>
  <circle cx="320" cy="70" r="12" fill="#bb2222" opacity="0.55"/>
  <circle cx="120" cy="160" r="27" fill="#cc3333" opacity="0.85"/>
  <circle cx="120" cy="160" r="16" fill="#992222" opacity="0.6"/>
  <circle cx="200" cy="140" r="25" fill="#dd3333" opacity="0.82"/>
  <circle cx="200" cy="140" r="14" fill="#aa2222" opacity="0.55"/>
  <circle cx="280" cy="150" r="23" fill="#cc2222" opacity="0.85"/>
  <circle cx="280" cy="150" r="13" fill="#991111" opacity="0.6"/>
  <circle cx="360" cy="130" r="20" fill="#dd4444" opacity="0.75"/>
  <circle cx="360" cy="130" r="11" fill="#bb2222" opacity="0.5"/>
  <circle cx="60" cy="230" r="22" fill="#cc3333" opacity="0.8"/>
  <circle cx="60" cy="230" r="13" fill="#992222" opacity="0.55"/>
  <circle cx="140" cy="250" r="26" fill="#dd3333" opacity="0.85"/>
  <circle cx="140" cy="250" r="15" fill="#aa2222" opacity="0.6"/>
  <circle cx="220" cy="240" r="24" fill="#cc2222" opacity="0.82"/>
  <circle cx="220" cy="240" r="14" fill="#991111" opacity="0.57"/>
  <circle cx="300" cy="220" r="21" fill="#dd4444" opacity="0.78"/>
  <circle cx="300" cy="220" r="12" fill="#bb2222" opacity="0.53"/>
  <circle cx="370" cy="250" r="19" fill="#cc3333" opacity="0.75"/>
  <circle cx="370" cy="250" r="11" fill="#992222" opacity="0.5"/>
  <!-- Small overlapping cells -->
  <ellipse cx="185" cy="195" rx="30" ry="22" fill="#cc3333" opacity="0.8"/>
  <ellipse cx="210" cy="195" rx="28" ry="20" fill="#dd3333" opacity="0.75"/>
</svg>
`)}`;

export const MOCK_PROCESSED_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="224" height="224" viewBox="0 0 224 224" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="224" height="224" fill="#0f172a"/>
  <circle cx="45" cy="45" r="18" fill="#e53e3e" opacity="0.9"/>
  <circle cx="45" cy="45" r="10" fill="#9b2c2c" opacity="0.7"/>
  <circle cx="95" cy="35" r="16" fill="#e53e3e" opacity="0.88"/>
  <circle cx="95" cy="35" r="9" fill="#9b2c2c" opacity="0.65"/>
  <circle cx="150" cy="50" r="17" fill="#e53e3e" opacity="0.9"/>
  <circle cx="150" cy="50" r="10" fill="#9b2c2c" opacity="0.7"/>
  <circle cx="195" cy="40" r="14" fill="#e53e3e" opacity="0.85"/>
  <circle cx="195" cy="40" r="8" fill="#9b2c2c" opacity="0.6"/>
  <circle cx="70" cy="100" r="17" fill="#e53e3e" opacity="0.9"/>
  <circle cx="70" cy="100" r="10" fill="#9b2c2c" opacity="0.7"/>
  <circle cx="125" cy="90" r="16" fill="#e53e3e" opacity="0.88"/>
  <circle cx="125" cy="90" r="9" fill="#9b2c2c" opacity="0.65"/>
  <circle cx="175" cy="100" r="15" fill="#e53e3e" opacity="0.85"/>
  <circle cx="175" cy="100" r="8" fill="#9b2c2c" opacity="0.6"/>
  <circle cx="40" cy="155" r="16" fill="#e53e3e" opacity="0.88"/>
  <circle cx="40" cy="155" r="9" fill="#9b2c2c" opacity="0.65"/>
  <circle cx="90" cy="165" r="17" fill="#e53e3e" opacity="0.9"/>
  <circle cx="90" cy="165" r="10" fill="#9b2c2c" opacity="0.7"/>
  <circle cx="145" cy="155" r="15" fill="#e53e3e" opacity="0.85"/>
  <circle cx="145" cy="155" r="8" fill="#9b2c2c" opacity="0.6"/>
  <circle cx="195" cy="160" r="14" fill="#e53e3e" opacity="0.85"/>
  <circle cx="195" cy="160" r="8" fill="#9b2c2c" opacity="0.6"/>
  <circle cx="65" cy="205" r="15" fill="#e53e3e" opacity="0.85"/>
  <circle cx="65" cy="205" r="8" fill="#9b2c2c" opacity="0.6"/>
  <circle cx="130" cy="200" r="16" fill="#e53e3e" opacity="0.88"/>
  <circle cx="130" cy="200" r="9" fill="#9b2c2c" opacity="0.65"/>
  <circle cx="185" cy="205" r="14" fill="#e53e3e" opacity="0.85"/>
  <circle cx="185" cy="205" r="8" fill="#9b2c2c" opacity="0.6"/>
</svg>
`)}`;

export const MOCK_SEGMENTED_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#0f0a0a"/>
  <!-- RBCs -->
  <circle cx="80" cy="80" r="28" fill="#cc3333" opacity="0.7"/>
  <circle cx="80" cy="80" r="16" fill="#992222" opacity="0.5"/>
  <!-- Ellipse outlines for detected cells -->
  <ellipse cx="80" cy="80" rx="30" ry="30" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="160" cy="60" rx="26" ry="26" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="240" cy="90" rx="28" ry="28" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="320" cy="70" rx="24" ry="24" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="120" cy="160" rx="29" ry="29" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="200" cy="140" rx="27" ry="27" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="280" cy="150" rx="25" ry="25" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="360" cy="130" rx="22" ry="22" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="60" cy="230" rx="24" ry="24" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="140" cy="250" rx="28" ry="28" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="220" cy="240" rx="26" ry="26" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="300" cy="220" rx="23" ry="23" stroke="#00ff00" stroke-width="2" fill="none"/>
  <ellipse cx="370" cy="250" rx="21" ry="21" stroke="#00ff00" stroke-width="2" fill="none"/>
  <!-- Overlapping cells - different color -->
  <ellipse cx="185" cy="195" rx="30" ry="22" stroke="#ff9900" stroke-width="2" fill="none"/>
  <ellipse cx="210" cy="195" rx="28" ry="20" stroke="#ff9900" stroke-width="2" fill="none"/>
  <!-- Cell count markers -->
  <circle cx="80" cy="80" r="4" fill="#00ff00"/>
  <circle cx="160" cy="60" r="4" fill="#00ff00"/>
  <circle cx="240" cy="90" r="4" fill="#00ff00"/>
  <circle cx="320" cy="70" r="4" fill="#00ff00"/>
  <circle cx="120" cy="160" r="4" fill="#00ff00"/>
  <circle cx="200" cy="140" r="4" fill="#00ff00"/>
  <circle cx="280" cy="150" r="4" fill="#00ff00"/>
  <circle cx="360" cy="130" r="4" fill="#00ff00"/>
  <circle cx="185" cy="195" r="4" fill="#ff9900"/>
  <circle cx="210" cy="195" r="4" fill="#ff9900"/>
  <!-- Background cells -->
  <circle cx="160" cy="60" r="24" fill="#dd3333" opacity="0.6"/>
  <circle cx="240" cy="90" r="26" fill="#cc2222" opacity="0.65"/>
  <circle cx="320" cy="70" r="22" fill="#dd4444" opacity="0.6"/>
  <circle cx="120" cy="160" r="27" fill="#cc3333" opacity="0.65"/>
  <circle cx="200" cy="140" r="25" fill="#dd3333" opacity="0.62"/>
  <circle cx="280" cy="150" r="23" fill="#cc2222" opacity="0.65"/>
  <circle cx="60" cy="230" r="22" fill="#cc3333" opacity="0.6"/>
  <circle cx="140" cy="250" r="26" fill="#dd3333" opacity="0.65"/>
  <circle cx="220" cy="240" r="24" fill="#cc2222" opacity="0.62"/>
  <ellipse cx="185" cy="195" rx="30" ry="22" fill="#cc3333" opacity="0.6"/>
  <ellipse cx="210" cy="195" rx="28" ry="20" fill="#dd3333" opacity="0.55"/>
</svg>
`)}`;

export const MOCK_GRADCAM_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#0f0a0a"/>
  <!-- Base RBCs -->
  <circle cx="200" cy="150" r="28" fill="#cc3333" opacity="0.7"/>
  <circle cx="200" cy="150" r="16" fill="#992222" opacity="0.5"/>
  <!-- Grad-CAM heatmap overlay -->
  <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff0000" stop-opacity="0.9"/>
    <stop offset="40%" stop-color="#ffaa00" stop-opacity="0.7"/>
    <stop offset="70%" stop-color="#ffff00" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="#0000ff" stop-opacity="0.1"/>
  </radialGradient>
  <radialGradient id="heat2" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff4400" stop-opacity="0.85"/>
    <stop offset="50%" stop-color="#ffcc00" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#00aaff" stop-opacity="0.1"/>
  </radialGradient>
  <radialGradient id="heat3" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff2200" stop-opacity="0.8"/>
    <stop offset="40%" stop-color="#ff8800" stop-opacity="0.6"/>
    <stop offset="80%" stop-color="#44ff88" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#0044ff" stop-opacity="0.05"/>
  </radialGradient>
  <!-- Main focus area (main cell) -->
  <circle cx="200" cy="150" r="40" fill="url(#heat1)" opacity="0.85"/>
  <!-- Secondary hotspots -->
  <circle cx="100" cy="80" r="30" fill="url(#heat2)" opacity="0.6"/>
  <circle cx="310" cy="90" r="25" fill="url(#heat3)" opacity="0.5"/>
  <circle cx="150" cy="220" r="28" fill="url(#heat2)" opacity="0.55"/>
  <circle cx="300" cy="200" r="22" fill="url(#heat3)" opacity="0.45"/>
  <!-- Cool areas -->
  <circle cx="50" cy="200" r="20" fill="#0044ff" opacity="0.15"/>
  <circle cx="370" cy="250" r="18" fill="#0044ff" opacity="0.12"/>
  <!-- Background cells (dimmed) -->
  <circle cx="100" cy="80" r="24" fill="#dd3333" opacity="0.4"/>
  <circle cx="310" cy="90" r="22" fill="#cc3333" opacity="0.4"/>
  <circle cx="150" cy="220" r="27" fill="#dd3333" opacity="0.4"/>
  <circle cx="300" cy="200" r="23" fill="#cc3333" opacity="0.4"/>
</svg>
`)}`;

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  id: '1',
  analysisId: 'RBC-2026-00128',
  date: 'October 8, 2026',
  imageUrl: MOCK_RBC_IMAGE,
  imageName: 'blood_smear_sample.jpg',
  imageSize: '2.4 MB',
  imageDimensions: '1024 × 768',
  predictedClass: 'Microcyte',
  confidence: 92.35,
  topPredictions: [
    { class: 'Microcyte', confidence: 92.35 },
    { class: 'Target Cell', confidence: 5.21 },
    { class: 'Normal', confidence: 2.44 },
  ] as PredictionItem[],
  morphologyDistribution: [
    { name: 'Microcyte', value: 60, color: '#a855f7' },
    { name: 'Normal', value: 20, color: '#22c55e' },
    { name: 'Target Cell', value: 12, color: '#14b8a6' },
    { name: 'Other', value: 8, color: '#94a3b8' },
  ],
  segmentation: {
    totalDetected: 46,
    overlapping: 8,
    separated: 44,
    accuracy: 94.2,
  },
  preprocessing: {
    originalResolution: '1024 × 768',
    processedResolution: '224 × 224',
    normalization: true,
    contrastEnhancement: true,
    noiseReduction: true,
    dataAugmentation: true,
    resize: true,
  },
  status: 'completed',
  processingTime: '3.2s',
  model: 'EfficientNetV2',
};

export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    analysisId: 'RBC-2026-00128',
    date: 'Oct 08, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Microcyte',
    confidence: 92.35,
    status: 'completed',
  },
  {
    id: '2',
    analysisId: 'RBC-2026-00127',
    date: 'Oct 07, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Normal',
    confidence: 88.72,
    status: 'completed',
  },
  {
    id: '3',
    analysisId: 'RBC-2026-00126',
    date: 'Oct 06, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Target Cell',
    confidence: 85.14,
    status: 'completed',
  },
  {
    id: '4',
    analysisId: 'RBC-2026-00125',
    date: 'Oct 05, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Macrocyte',
    confidence: 79.63,
    status: 'completed',
  },
  {
    id: '5',
    analysisId: 'RBC-2026-00124',
    date: 'Oct 04, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Spherocyte',
    confidence: 91.08,
    status: 'completed',
  },
  {
    id: '6',
    analysisId: 'RBC-2026-00123',
    date: 'Oct 03, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Hypochromia',
    confidence: 76.55,
    status: 'completed',
  },
  {
    id: '7',
    analysisId: 'RBC-2026-00122',
    date: 'Oct 02, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Ovalocyte',
    confidence: 83.21,
    status: 'completed',
  },
  {
    id: '8',
    analysisId: 'RBC-2026-00121',
    date: 'Oct 01, 2026',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Burr Cell',
    confidence: 89.44,
    status: 'completed',
  },
];

export const DASHBOARD_STATS = [
  {
    title: 'Total Analyses',
    value: '128',
    trend: '+12 this week',
    trendUp: true,
    icon: 'activity',
    color: 'blue',
  },
  {
    title: 'Avg. Confidence',
    value: '91.4%',
    trend: '+2.1% vs last month',
    trendUp: true,
    icon: 'target',
    color: 'teal',
  },
  {
    title: 'Top Morphology',
    value: 'Microcyte',
    trend: '38% of all cases',
    trendUp: false,
    icon: 'microscope',
    color: 'purple',
  },
  {
    title: 'System Status',
    value: 'Operational',
    trend: '99.9% uptime',
    trendUp: true,
    icon: 'server',
    color: 'green',
  },
];
