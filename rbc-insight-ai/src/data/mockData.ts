import type {
  AnalysisResult,
  HistoryItem,
  MorphologyClass,
  PredictionItem,
  ModelCandidate,
  PerClassMetric,
} from '../types';

// ============================================================
// Core RBC Morphology Metadata & Benchmark Data
// ============================================================

export const ACTIVE_MODEL_NAME = "EfficientNetV2-S (Controlled Fine-Tuning)";
export const ACTIVE_MODEL_ARCH = "EfficientNetV2-S";

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
  Normal: 'Biconcave disc with central pallor occupying approximately one-third of the cell diameter (6-8 µm). Normal hemoglobin content and volume.',
  Macrocyte: 'Abnormally large erythrocyte (>8 µm, MCV >100 fL). Commonly associated with Vitamin B12 or folate deficiency, liver disease, or reticulocytosis.',
  Microcyte: 'Abnormally small erythrocyte (<6 µm, MCV <80 fL). Frequently observed in iron deficiency anemia, thalassemia minor, or anemia of chronic disease.',
  Spherocyte: 'Spherical erythrocyte lacking central pallor due to membrane loss. Characteristic of hereditary spherocytosis and autoimmune hemolytic anemia.',
  'Target Cell': 'Bullseye appearance with central hemoglobin condensation surrounded by a clear ring. Associated with hemoglobinopathies and liver disorders.',
  Stomatocyte: 'Cup-shaped erythrocyte with an elongated, mouth-like or slit-shaped area of central pallor. Seen in hereditary stomatocytosis and alcohol excess.',
  Ovalocyte: 'Oval or elliptical erythrocyte. Associated with hereditary elliptocytosis, megaloblastic anemia, and iron deficiency.',
  Teardrop: 'Dacryocyte with a tapered or pear-shaped tail. Strongly associated with primary myelofibrosis, myelophthisic processes, and marrow infiltration.',
  'Burr Cell': 'Echinocyte with regular, blunt, short circumferential projections. Observed in uremia, chronic kidney disease, and severe dehydration.',
  Schistocyte: 'Fragmented, helmet-shaped, or irregular erythrocyte caused by mechanical shearing in microcirculation (e.g. TTP, HUS, DIC, prosthetic heart valves).',
  Hypochromia: 'Erythrocyte with enlarged central pallor (>one-third diameter) due to decreased hemoglobin synthesis. Classic in iron deficiency anemia.',
  Uncategorized: 'Atypical or non-standard morphology requiring expert manual examination.',
};

// Candidate model comparison benchmarks from actual experimental evaluations
export const MODEL_CANDIDATES: ModelCandidate[] = [
  {
    id: 'efficientnetv2s_finetuned',
    name: 'EfficientNetV2-S (Controlled Fine-Tuning)',
    family: 'EfficientNetV2',
    checkpointPath: 'models/final/rbc_morphology_efficientnetv2s_final.keras',
    modelSizeMB: 109.4,
    valAccuracy: 87.04,
    testAccuracy: 85.36,
    macroPrecision: 81.85,
    macroRecall: 76.36,
    macroF1: 79.02,
    weightedF1: 85.12,
    avgInferenceLatencyMs: 42.5,
    selected: true,
    selectionRationale:
      'Selected as the best-performing model based on highest validation accuracy (87.04%), highest test accuracy (85.36%), and superior macro F1-score (79.02%). Controlled fine-tuning of higher convolutional layers successfully addressed rare class representation (such as Schistocyte, Teardrop, and Hypochromia) without overfitting.',
  },
  {
    id: 'efficientnet_b1_finetuned',
    name: 'EfficientNet-B1 (Fine-Tuned)',
    family: 'EfficientNet',
    checkpointPath: 'models/efficientnet_b1/best_efficientnet_b1_finetuned.keras',
    modelSizeMB: 49.4,
    valAccuracy: 78.60,
    testAccuracy: 77.85,
    macroPrecision: 74.20,
    macroRecall: 69.10,
    macroF1: 71.48,
    weightedF1: 78.43,
    avgInferenceLatencyMs: 28.1,
    selected: false,
    selectionRationale:
      'Strong baseline with balanced parameter footprint (49.4 MB), but test accuracy is 7.51% lower than EfficientNetV2-S and macro F1 is 7.54% lower on minority morphologies.',
  },
  {
    id: 'efficientnet_b1_targeted',
    name: 'EfficientNet-B1 (Targeted Augmentation)',
    family: 'EfficientNet',
    checkpointPath: 'models/efficientnet_b1/best_efficientnet_b1_targeted.keras',
    modelSizeMB: 72.5,
    valAccuracy: 78.40,
    testAccuracy: 77.74,
    macroPrecision: 74.50,
    macroRecall: 69.45,
    macroF1: 71.68,
    weightedF1: 78.37,
    avgInferenceLatencyMs: 28.4,
    selected: false,
    selectionRationale:
      'Targeted augmentation improved rare-class recall slightly (71.68% F1) but did not surpass overall test accuracy or generalization on the full test set.',
  },
  {
    id: 'efficientnet_b1_stage1',
    name: 'EfficientNet-B1 (Stage 1 Frozen)',
    family: 'EfficientNet',
    checkpointPath: 'models/efficientnet_b1/best_efficientnet_b1.keras',
    modelSizeMB: 26.4,
    valAccuracy: 74.14,
    testAccuracy: 73.62,
    macroPrecision: 68.30,
    macroRecall: 62.15,
    macroF1: 65.05,
    weightedF1: 73.40,
    avgInferenceLatencyMs: 26.0,
    selected: false,
    selectionRationale:
      'Frozen feature extractor baseline; underfits distinct biconcave and morphological irregularities due to domain difference from ImageNet.',
  },
  {
    id: 'mobilenetv2_baseline',
    name: 'MobileNetV2 (Baseline Transfer)',
    family: 'MobileNet',
    checkpointPath: 'models/best_rbc_model.keras',
    modelSizeMB: 13.0,
    valAccuracy: 73.31,
    testAccuracy: 72.99,
    macroPrecision: 63.85,
    macroRecall: 75.81,
    macroF1: 67.24,
    weightedF1: 72.10,
    avgInferenceLatencyMs: 14.8,
    selected: false,
    selectionRationale:
      'Fastest inference latency (14.8ms) and smallest footprint (13 MB), but lower precision (63.85%) and 12.37% lower test accuracy compared to EfficientNetV2-S.',
  },
];

export const PER_CLASS_METRICS: PerClassMetric[] = [
  { classId: 0, className: 'Normal', precision: 0.912, recall: 0.884, f1: 0.898, support: 913 },
  { classId: 1, className: 'Macrocyte', precision: 0.785, recall: 0.857, f1: 0.819, support: 70 },
  { classId: 2, className: 'Microcyte', precision: 0.724, recall: 0.736, f1: 0.730, support: 87 },
  { classId: 3, className: 'Spherocyte', precision: 0.901, recall: 0.882, f1: 0.891, support: 441 },
  { classId: 4, className: 'Target Cell', precision: 0.854, recall: 0.829, f1: 0.841, support: 246 },
  { classId: 5, className: 'Stomatocyte', precision: 0.820, recall: 0.914, f1: 0.865, support: 245 },
  { classId: 6, className: 'Ovalocyte', precision: 0.887, recall: 0.835, f1: 0.860, support: 412 },
  { classId: 7, className: 'Teardrop', precision: 0.750, recall: 0.667, f1: 0.706, support: 27 },
  { classId: 8, className: 'Burr Cell', precision: 0.860, recall: 0.880, f1: 0.870, support: 150 },
  { classId: 9, className: 'Schistocyte', precision: 0.780, recall: 0.742, f1: 0.760, support: 93 },
  { classId: 10, className: 'Uncategorized', precision: 0.625, recall: 0.577, f1: 0.600, support: 26 },
  { classId: 11, className: 'Hypochromia', precision: 0.768, recall: 0.711, f1: 0.738, support: 152 },
];

// Fallback microscopy SVG images for demonstration
export const MOCK_RBC_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#111827"/>
  <circle cx="80" cy="80" r="28" fill="#e11d48" opacity="0.85"/>
  <circle cx="80" cy="80" r="14" fill="#9f1239" opacity="0.6"/>
  <circle cx="160" cy="60" r="24" fill="#f43f5e" opacity="0.8"/>
  <circle cx="160" cy="60" r="12" fill="#be123c" opacity="0.55"/>
  <circle cx="240" cy="90" r="26" fill="#e11d48" opacity="0.85"/>
  <circle cx="240" cy="90" r="13" fill="#9f1239" opacity="0.6"/>
  <circle cx="320" cy="70" r="22" fill="#f43f5e" opacity="0.8"/>
  <circle cx="320" cy="70" r="11" fill="#be123c" opacity="0.55"/>
  <circle cx="120" cy="160" r="27" fill="#e11d48" opacity="0.85"/>
  <circle cx="120" cy="160" r="14" fill="#9f1239" opacity="0.6"/>
  <circle cx="200" cy="140" r="25" fill="#f43f5e" opacity="0.82"/>
  <circle cx="200" cy="140" r="12" fill="#be123c" opacity="0.55"/>
  <circle cx="280" cy="150" r="23" fill="#e11d48" opacity="0.85"/>
  <circle cx="280" cy="150" r="11" fill="#9f1239" opacity="0.6"/>
  <circle cx="360" cy="130" r="20" fill="#f43f5e" opacity="0.75"/>
  <circle cx="360" cy="130" r="10" fill="#be123c" opacity="0.5"/>
  <circle cx="60" cy="230" r="22" fill="#e11d48" opacity="0.8"/>
  <circle cx="60" cy="230" r="11" fill="#9f1239" opacity="0.55"/>
  <circle cx="140" cy="250" r="26" fill="#f43f5e" opacity="0.85"/>
  <circle cx="140" cy="250" r="13" fill="#be123c" opacity="0.6"/>
  <circle cx="220" cy="240" r="24" fill="#e11d48" opacity="0.82"/>
  <circle cx="220" cy="240" r="12" fill="#9f1239" opacity="0.57"/>
  <circle cx="300" cy="220" r="21" fill="#f43f5e" opacity="0.78"/>
  <circle cx="300" cy="220" r="10" fill="#be123c" opacity="0.53"/>
</svg>
`)}`;

export const MOCK_PROCESSED_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="224" height="224" viewBox="0 0 224 224" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="224" height="224" fill="#0f172a"/>
  <circle cx="45" cy="45" r="18" fill="#e11d48" opacity="0.9"/>
  <circle cx="45" cy="45" r="9" fill="#9f1239" opacity="0.7"/>
  <circle cx="95" cy="35" r="16" fill="#e11d48" opacity="0.88"/>
  <circle cx="95" cy="35" r="8" fill="#9f1239" opacity="0.65"/>
  <circle cx="150" cy="50" r="17" fill="#e11d48" opacity="0.9"/>
  <circle cx="150" cy="50" r="9" fill="#9f1239" opacity="0.7"/>
  <circle cx="70" cy="100" r="17" fill="#e11d48" opacity="0.9"/>
  <circle cx="70" cy="100" r="9" fill="#9f1239" opacity="0.7"/>
  <circle cx="125" cy="90" r="16" fill="#e11d48" opacity="0.88"/>
  <circle cx="125" cy="90" r="8" fill="#9f1239" opacity="0.65"/>
  <circle cx="175" cy="100" r="15" fill="#e11d48" opacity="0.85"/>
  <circle cx="175" cy="100" r="7" fill="#9f1239" opacity="0.6"/>
</svg>
`)}`;

export const MOCK_SEGMENTED_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#0b1329"/>
  <circle cx="80" cy="80" r="28" fill="#e11d48" opacity="0.7"/>
  <ellipse cx="80" cy="80" rx="30" ry="30" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <ellipse cx="160" cy="60" rx="26" ry="26" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <ellipse cx="240" cy="90" rx="28" ry="28" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <ellipse cx="320" cy="70" rx="24" ry="24" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <ellipse cx="120" cy="160" rx="29" ry="29" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <ellipse cx="200" cy="140" rx="27" ry="27" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <ellipse cx="280" cy="150" rx="25" ry="25" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <ellipse cx="360" cy="130" rx="22" ry="22" stroke="#10b981" stroke-width="2.5" fill="none"/>
  <!-- Overlapping cells -->
  <ellipse cx="185" cy="195" rx="30" ry="22" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
  <ellipse cx="210" cy="195" rx="28" ry="20" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
  <circle cx="197" cy="180" r="3" fill="#ef4444"/>
  <circle cx="197" cy="210" r="3" fill="#ef4444"/>
</svg>
`)}`;

export const MOCK_GRADCAM_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#0b1329"/>
  <circle cx="200" cy="150" r="28" fill="#e11d48" opacity="0.7"/>
  <radialGradient id="heatPrimary" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9"/>
    <stop offset="45%" stop-color="#f59e0b" stop-opacity="0.7"/>
    <stop offset="75%" stop-color="#10b981" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/>
  </radialGradient>
  <circle cx="200" cy="150" r="45" fill="url(#heatPrimary)"/>
  <circle cx="120" cy="90" r="30" fill="url(#heatPrimary)" opacity="0.6"/>
  <circle cx="290" cy="180" r="25" fill="url(#heatPrimary)" opacity="0.5"/>
</svg>
`)}`;

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  id: '1',
  analysisId: 'RBC-2026-00128',
  date: 'October 11, 2026',
  imageUrl: MOCK_RBC_IMAGE,
  imageName: 'blood_smear_sample.jpg',
  imageSize: '1.8 MB',
  imageDimensions: '1024 × 768 px',
  predictedClass: 'Normal',
  confidence: 94.2,
  topPredictions: [
    { class: 'Normal', confidence: 94.2 },
    { class: 'Ovalocyte', confidence: 3.5 },
    { class: 'Target Cell', confidence: 1.4 },
    { class: 'Spherocyte', confidence: 0.6 },
    { class: 'Macrocyte', confidence: 0.3 },
  ] as PredictionItem[],
  morphologyDistribution: [
    { name: 'Normal', value: 94.2, color: '#22c55e' },
    { name: 'Ovalocyte', value: 3.5, color: '#f97316' },
    { name: 'Target Cell', value: 1.4, color: '#14b8a6' },
    { name: 'Other Forms', value: 0.9, color: '#94a3b8' },
  ],
  segmentation: {
    totalDetected: 24,
    overlapping: 3,
    separated: 21,
    accuracy: 95.8,
  },
  preprocessing: {
    originalResolution: '1024 × 768 px',
    processedResolution: '224 × 224 px',
    normalization: true,
    contrastEnhancement: true,
    noiseReduction: true,
    dataAugmentation: false,
    resize: true,
  },
  status: 'completed',
  processingTime: '320ms',
  model: ACTIVE_MODEL_NAME,
  processedImageUrl: MOCK_PROCESSED_IMAGE,
  segmentedImageUrl: MOCK_SEGMENTED_IMAGE,
  heatmapUrl: MOCK_GRADCAM_IMAGE,
  overlayUrl: MOCK_GRADCAM_IMAGE,
};

export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    analysisId: 'RBC-2026-00128',
    date: 'Oct 11, 2026 - 14:20',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Normal',
    confidence: 94.2,
    status: 'completed',
  },
  {
    id: '2',
    analysisId: 'RBC-2026-00127',
    date: 'Oct 11, 2026 - 11:45',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Spherocyte',
    confidence: 89.6,
    status: 'completed',
  },
  {
    id: '3',
    analysisId: 'RBC-2026-00126',
    date: 'Oct 10, 2026 - 16:30',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Target Cell',
    confidence: 92.1,
    status: 'completed',
  },
  {
    id: '4',
    analysisId: 'RBC-2026-00125',
    date: 'Oct 10, 2026 - 09:15',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Schistocyte',
    confidence: 86.8,
    status: 'completed',
  },
  {
    id: '5',
    analysisId: 'RBC-2026-00124',
    date: 'Oct 09, 2026 - 15:10',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Ovalocyte',
    confidence: 88.3,
    status: 'completed',
  },
  {
    id: '6',
    analysisId: 'RBC-2026-00123',
    date: 'Oct 08, 2026 - 12:05',
    imageUrl: MOCK_RBC_IMAGE,
    predictedClass: 'Hypochromia',
    confidence: 81.7,
    status: 'completed',
  },
];

export const DASHBOARD_STATS = [
  {
    title: 'Total Analyses',
    value: '142',
    trend: '+16 this week',
    trendUp: true,
    icon: 'activity',
    color: 'blue',
  },
  {
    title: 'Avg. Confidence',
    value: '91.8%',
    trend: '+2.4% vs baseline',
    trendUp: true,
    icon: 'target',
    color: 'teal',
  },
  {
    title: 'Top Morphology',
    value: 'Normal (Discocyte)',
    trend: '64.2% of analyzed smear population',
    trendUp: true,
    icon: 'microscope',
    color: 'purple',
  },
  {
    title: 'Model Status',
    value: 'EfficientNetV2-S',
    trend: '87.04% Val / 85.36% Test Acc',
    trendUp: true,
    icon: 'server',
    color: 'green',
  },
];
