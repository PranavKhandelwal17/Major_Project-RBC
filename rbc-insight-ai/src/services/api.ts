import type { AnalysisResult, HistoryItem, MorphologyClass, PredictionItem } from '../types';
import {
  MOCK_ANALYSIS_RESULT,
  MOCK_HISTORY,
  MODEL_CANDIDATES,
  PER_CLASS_METRICS,
  ACTIVE_MODEL_NAME,
  ACTIVE_MODEL_ARCH,
  MORPHOLOGY_COLORS,
} from '../data/mockData';

import { downloadClinicalReport } from '../utils/reportExporter';

// =============================================
// API Service Layer - Dual Mode (Live / Fallback)
// =============================================
// =============================================
// API Service Layer - Real Model Backend Engine
// =============================================
let activeApiBase = import.meta.env.VITE_API_BASE_URL || '/api';
let isBackendAvailableCache: boolean | null = null;
let lastCheckTime = 0;

export async function resolveApiBase(): Promise<string> {
  const now = Date.now();
  if (isBackendAvailableCache === true && now - lastCheckTime < 4000) {
    return activeApiBase;
  }

  const candidates = [
    activeApiBase,
    '/api',
    'http://127.0.0.1:8000/api',
    'http://localhost:8000/api',
  ];

  for (const base of candidates) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${base}/health`, { signal: controller.signal });
      clearTimeout(id);
      if (res.ok) {
        activeApiBase = base;
        isBackendAvailableCache = true;
        lastCheckTime = Date.now();
        return base;
      }
    } catch {
      // try next candidate
    }
  }

  isBackendAvailableCache = false;
  lastCheckTime = now;
  return activeApiBase;
}

export async function checkBackendHealth(): Promise<boolean> {
  const base = await resolveApiBase();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${base}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    isBackendAvailableCache = res.ok;
    return res.ok;
  } catch {
    isBackendAvailableCache = false;
    return false;
  }
}

export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const base = await resolveApiBase();
  try {
    const res = await fetch(`${base}${endpoint}`, options);
    if (res.ok) return res;

    // If proxy failed with 500/502/504, try direct 127.0.0.1:8000
    if (res.status >= 500 && !base.startsWith('http://127.0.0.1')) {
      try {
        const directRes = await fetch(`http://127.0.0.1:8000/api${endpoint}`, options);
        if (directRes.ok) {
          activeApiBase = 'http://127.0.0.1:8000/api';
          return directRes;
        }
      } catch {
        // keep original response
      }
    }
    return res;
  } catch (networkErr) {
    // If relative /api fetch had network error, retry direct
    if (!base.startsWith('http://127.0.0.1')) {
      try {
        const directRes = await fetch(`http://127.0.0.1:8000/api${endpoint}`, options);
        if (directRes.ok) {
          activeApiBase = 'http://127.0.0.1:8000/api';
          return directRes;
        }
      } catch {
        // keep original error
      }
    }
    throw networkErr;
  }
}

export interface SamplePreset {
  class: string;
  code: string;
  url: string;
  description: string;
}

export async function getSamplePresets(): Promise<SamplePreset[]> {
  try {
    const res = await apiFetch('/samples');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch sample presets from backend:', err);
  }
  return [
    { class: 'Target Cell', code: '4_Target_Cell', url: '/static/demo/4_Target_Cell_segmented.png', description: 'Bullseye appearance with central hemoglobin condensation' },
    { class: 'Spherocyte', code: '3_Spherocyte', url: '/static/demo/3_Spherocyte_segmented.png', description: 'Spherical erythrocyte lacking central pallor' },
    { class: 'Schistocyte', code: '9_Schistocyte', url: '/static/demo/9_Schistocyte_segmented.png', description: 'Fragmented helmet-shaped RBC from shear' },
    { class: 'Normal', code: '0_Normal', url: '/static/demo/0_Normal_segmented.png', description: 'Normal biconcave erythrocyte disc' },
    { class: 'Ovalocyte', code: '6_Ovalocyte', url: '/static/demo/6_Ovalocyte_segmented.png', description: 'Oval or elliptical erythrocyte' },
    { class: 'Teardrop', code: '7_Teardrop', url: '/static/demo/7_Teardrop_segmented.png', description: 'Dacryocyte with tapered tail' },
    { class: 'Stomatocyte', code: '5_Stomatocyte', url: '/static/demo/5_Stomatocyte_segmented.png', description: 'Slit-like mouth-shaped pallor' },
    { class: 'Microcyte', code: '2_Microcyte', url: '/static/demo/2_Microcyte_segmented.png', description: 'Small erythrocyte <6 µm' },
    { class: 'Macrocyte', code: '1_Macrocyte', url: '/static/demo/1_Macrocyte_segmented.png', description: 'Large erythrocyte >8 µm' },
    { class: 'Burr Cell', code: '8_Burr_Cell', url: '/static/demo/8_Burr_Cell_segmented.png', description: 'Spiculated cell with regular projections' },
    { class: 'Hypochromia', code: '11_Hypochromia', url: '/static/demo/11_Hypochromia_segmented.png', description: 'Pale RBC with enlarged central pallor' },
  ];
}

// ---- Upload ----
export async function uploadImage(file: File): Promise<{ uploadId: string; url: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await apiFetch('/upload', { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Upload to backend failed (HTTP ${res.status}): ${err || 'Server rejected file'}`);
  }
  return await res.json();
}

// ---- Preprocessing ----
export async function preprocessImage(
  uploadId: string
): Promise<{ processedUrl: string; details: AnalysisResult['preprocessing'] }> {
  const res = await apiFetch(`/preprocess/${uploadId}`);
  if (!res.ok) {
    throw new Error(`Preprocessing stage failed (HTTP ${res.status}) on upload ID: ${uploadId}`);
  }
  const data = await res.json();
  return {
    processedUrl: data.processedUrl,
    details: data.details,
  };
}

// ---- Segmentation ----
export async function segmentCells(
  uploadId: string
): Promise<{ segmentedUrl: string; stats: AnalysisResult['segmentation'] }> {
  const res = await apiFetch(`/segment/${uploadId}`);
  if (!res.ok) {
    throw new Error(`Segmentation stage failed (HTTP ${res.status}) on upload ID: ${uploadId}`);
  }
  const data = await res.json();
  return {
    segmentedUrl: data.segmentedUrl,
    stats: data.stats,
  };
}

// ---- Classification ----
export async function classifyCells(uploadId: string): Promise<{ taskId: string }> {
  const res = await apiFetch(`/classify/${uploadId}`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Classification initialization failed (HTTP ${res.status}) on upload ID: ${uploadId}`);
  }
  return await res.json();
}

// ---- Prediction ----
export async function getPrediction(taskId: string): Promise<{
  predictedClass: string;
  confidence: number;
  topPredictions: { class: string; confidence: number }[];
  morphologyDistribution?: { name: string; value: number }[];
  processingTime?: string;
  model?: string;
}> {
  const res = await apiFetch(`/predict/${taskId}`);
  if (!res.ok) {
    throw new Error(`EfficientNetV2-S model inference failed (HTTP ${res.status}) on task ID: ${taskId}`);
  }
  return await res.json();
}

// ---- Grad-CAM ----
export async function getGradCAM(taskId: string): Promise<{ heatmapUrl: string; overlayUrl: string }> {
  const res = await apiFetch(`/gradcam/${taskId}`);
  if (!res.ok) {
    throw new Error(`Grad-CAM visualization generation failed (HTTP ${res.status}) on task ID: ${taskId}`);
  }
  return await res.json();
}

// ---- Report ----
export async function generateReport(analysisId: string): Promise<{ reportId: string; reportUrl: string }> {
  try {
    const res = await apiFetch(`/report/${analysisId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Report generation failed');
    return await res.json();
  } catch (err) {
    console.warn('API generateReport warning:', err);
    return { reportId: analysisId, reportUrl: '#' };
  }
}

// ---- Full Analysis (orchestrator) ----
export async function runFullAnalysis(
  file: File,
  onStepChange?: (stepIndex: number, label: string) => void
): Promise<AnalysisResult> {
  const startTime = Date.now();

  onStepChange?.(0, 'User Input');
  const { uploadId, url: uploadedUrl } = await uploadImage(file);

  onStepChange?.(1, 'Preprocessing');
  const preprocessRes = await preprocessImage(uploadId);

  onStepChange?.(2, 'RBC Segmentation');
  const segRes = await segmentCells(uploadId);

  onStepChange?.(3, 'Classification');
  const { taskId } = await classifyCells(uploadId);

  onStepChange?.(4, 'Prediction');
  const predRes = await getPrediction(taskId);

  onStepChange?.(5, 'Grad-CAM');
  const camRes = await getGradCAM(taskId);

  onStepChange?.(6, 'Clinical Report');
  const reportRes = await generateReport(uploadId);

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  // Fallback distribution builder if not provided by backend
  const rawDist = predRes.morphologyDistribution && predRes.morphologyDistribution.length > 0
    ? predRes.morphologyDistribution
    : [
        { name: predRes.predictedClass, value: predRes.confidence },
        ...(predRes.topPredictions || [])
          .filter((p) => p.class !== predRes.predictedClass)
          .slice(0, 3)
          .map((p) => ({ name: p.class, value: p.confidence })),
      ];

  const morphDist = rawDist.map((item) => ({
    name: item.name,
    value: item.value,
    color: MORPHOLOGY_COLORS[item.name as MorphologyClass] || '#64748b',
  }));

  return {
    ...MOCK_ANALYSIS_RESULT,
    id: uploadId,
    analysisId: reportRes.reportId || `RBC-${Date.now().toString().slice(-5)}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    imageUrl: uploadedUrl || URL.createObjectURL(file),
    imageName: file.name,
    imageSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    predictedClass: predRes.predictedClass as MorphologyClass,
    confidence: predRes.confidence,
    topPredictions: predRes.topPredictions as PredictionItem[],
    morphologyDistribution: morphDist,
    segmentation: segRes.stats,
    preprocessing: preprocessRes.details,
    processedImageUrl: preprocessRes.processedUrl,
    segmentedImageUrl: segRes.segmentedUrl,
    heatmapUrl: camRes.heatmapUrl,
    overlayUrl: camRes.overlayUrl,
    reportUrl: reportRes.reportUrl,
    processingTime: predRes.processingTime || `${durationSec}s`,
    model: predRes.model || ACTIVE_MODEL_NAME,
    status: 'completed',
  };
}

// ---- Demo Analysis (Instant realistic execution on specified class) ----
export async function runDemoAnalysis(classCode: string = '4_Target_Cell'): Promise<AnalysisResult> {
  const base = await resolveApiBase();
  const res = await fetch(`${base}/demo?class_code=${encodeURIComponent(classCode)}`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Failed to run demo analysis');
  }
  const data = await res.json();
  const demoDist = (data.morphologyDistribution || []).map((item: any) => ({
    name: item.name,
    value: item.value,
    color: MORPHOLOGY_COLORS[item.name as MorphologyClass] || '#64748b',
  }));
  return {
    ...MOCK_ANALYSIS_RESULT,
    id: data.uploadId,
    analysisId: data.uploadId,
    date: data.createdAt,
    imageUrl: data.url,
    imageName: data.filename,
    imageSize: data.size,
    imageDimensions: data.dimensions,
    predictedClass: data.predictedClass as MorphologyClass,
    confidence: data.confidence,
    topPredictions: data.topPredictions,
    morphologyDistribution: demoDist,
    segmentation: data.segmentation,
    preprocessing: data.preprocessing,
    processedImageUrl: data.processedUrl,
    segmentedImageUrl: data.segmentedUrl,
    heatmapUrl: data.heatmapUrl,
    overlayUrl: data.overlayUrl,
    reportUrl: `/static/reports/${data.uploadId}_clinical_report.pdf`,
    processingTime: data.processingTime,
    model: data.model,
    status: 'completed',
  };
}

// ---- History ----
export async function getAnalysisHistory(): Promise<HistoryItem[]> {
  try {
    const base = await resolveApiBase();
    const res = await fetch(`${base}/history`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('Could not fetch remote history, using local history cache:', err);
  }
  return MOCK_HISTORY;
}

// ---- Model Performance & Benchmark ----
export async function getModelComparison() {
  try {
    const base = await resolveApiBase();
    const res = await fetch(`${base}/models/comparison`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Could not fetch model comparison, using local benchmark data:', err);
  }
  return {
    candidates: MODEL_CANDIDATES,
    perClassMetrics: PER_CLASS_METRICS,
    selectedModel: ACTIVE_MODEL_NAME,
    numClasses: 12,
    dataset: 'Chula-RBC-12 Peripheral Blood Smear Dataset',
  };
}

export async function getSelectedModel() {
  try {
    const base = await resolveApiBase();
    const res = await fetch(`${base}/models/selected`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Could not fetch selected model, using cached metadata:', err);
  }
  return {
    name: ACTIVE_MODEL_NAME,
    architecture: ACTIVE_MODEL_ARCH,
    version: 'v2.1',
    accuracy: 87.04,
    testAccuracy: 85.36,
    macroF1: 79.02,
    macroRecall: 76.36,
    status: 'Active',
  };
}

// ---- Download Report as PDF / HTML ----
export function downloadReportPDF(resultOrId?: AnalysisResult | string): void {
  if (resultOrId && typeof resultOrId === 'object') {
    if (resultOrId.reportUrl && resultOrId.reportUrl !== '#') {
      const link = document.createElement('a');
      link.href = resultOrId.reportUrl;
      link.download = `RBC_Clinical_Report_${resultOrId.analysisId}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    downloadClinicalReport(resultOrId);
  } else {
    downloadClinicalReport({
      ...MOCK_ANALYSIS_RESULT,
      analysisId: typeof resultOrId === 'string' ? resultOrId : MOCK_ANALYSIS_RESULT.analysisId,
    });
  }
}
