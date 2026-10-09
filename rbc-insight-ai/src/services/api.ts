import type { AnalysisResult, HistoryItem, MorphologyClass, PredictionItem } from '../types';
import {
  MOCK_ANALYSIS_RESULT,
  MOCK_HISTORY,
  MOCK_PROCESSED_IMAGE,
  MOCK_SEGMENTED_IMAGE,
  MOCK_GRADCAM_IMAGE,
} from '../data/mockData';
import { downloadClinicalReport } from '../utils/reportExporter';

// =============================================
// API Service Layer - Dual Mode (Live / Fallback)
// =============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let isBackendAvailableCache: boolean | null = null;
let lastCheckTime = 0;

export async function checkBackendHealth(): Promise<boolean> {
  const now = Date.now();
  if (isBackendAvailableCache !== null && now - lastCheckTime < 15000) {
    return isBackendAvailableCache;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    isBackendAvailableCache = res.ok;
  } catch {
    isBackendAvailableCache = false;
  }
  lastCheckTime = now;
  return isBackendAvailableCache;
}

// ---- Upload ----
export async function uploadImage(file: File): Promise<{ uploadId: string; url: string }> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(700);
    return { uploadId: `upload-${Date.now()}`, url: URL.createObjectURL(file) };
  }
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  } catch {
    return { uploadId: `upload-${Date.now()}`, url: URL.createObjectURL(file) };
  }
}

// ---- Preprocessing ----
export async function preprocessImage(
  uploadId: string
): Promise<{ processedUrl: string; details: AnalysisResult['preprocessing'] }> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(900);
    return {
      processedUrl: MOCK_PROCESSED_IMAGE,
      details: MOCK_ANALYSIS_RESULT.preprocessing,
    };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/preprocess/${uploadId}`);
    if (!res.ok) throw new Error('Preprocessing failed');
    const data = await res.json();
    return {
      processedUrl: data.processedUrl || MOCK_PROCESSED_IMAGE,
      details: data.details || MOCK_ANALYSIS_RESULT.preprocessing,
    };
  } catch {
    return {
      processedUrl: MOCK_PROCESSED_IMAGE,
      details: MOCK_ANALYSIS_RESULT.preprocessing,
    };
  }
}

// ---- Segmentation ----
export async function segmentCells(
  uploadId: string
): Promise<{ segmentedUrl: string; stats: AnalysisResult['segmentation'] }> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(1100);
    return {
      segmentedUrl: MOCK_SEGMENTED_IMAGE,
      stats: MOCK_ANALYSIS_RESULT.segmentation,
    };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/segment/${uploadId}`);
    if (!res.ok) throw new Error('Segmentation failed');
    const data = await res.json();
    return {
      segmentedUrl: data.segmentedUrl || MOCK_SEGMENTED_IMAGE,
      stats: data.stats || MOCK_ANALYSIS_RESULT.segmentation,
    };
  } catch {
    return {
      segmentedUrl: MOCK_SEGMENTED_IMAGE,
      stats: MOCK_ANALYSIS_RESULT.segmentation,
    };
  }
}

// ---- Classification ----
export async function classifyCells(uploadId: string): Promise<{ taskId: string }> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(800);
    return { taskId: uploadId };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/classify/${uploadId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Classification failed');
    return await res.json();
  } catch {
    return { taskId: uploadId };
  }
}

// ---- Prediction ----
export async function getPrediction(taskId: string): Promise<{
  predictedClass: string;
  confidence: number;
  topPredictions: { class: string; confidence: number }[];
}> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(900);
    return {
      predictedClass: MOCK_ANALYSIS_RESULT.predictedClass,
      confidence: MOCK_ANALYSIS_RESULT.confidence,
      topPredictions: MOCK_ANALYSIS_RESULT.topPredictions,
    };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/predict/${taskId}`);
    if (!res.ok) throw new Error('Prediction failed');
    return await res.json();
  } catch {
    return {
      predictedClass: MOCK_ANALYSIS_RESULT.predictedClass,
      confidence: MOCK_ANALYSIS_RESULT.confidence,
      topPredictions: MOCK_ANALYSIS_RESULT.topPredictions,
    };
  }
}

// ---- Grad-CAM ----
export async function getGradCAM(taskId: string): Promise<{ heatmapUrl: string; overlayUrl: string }> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(1100);
    return { heatmapUrl: MOCK_GRADCAM_IMAGE, overlayUrl: MOCK_GRADCAM_IMAGE };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/gradcam/${taskId}`);
    if (!res.ok) throw new Error('Grad-CAM generation failed');
    return await res.json();
  } catch {
    return { heatmapUrl: MOCK_GRADCAM_IMAGE, overlayUrl: MOCK_GRADCAM_IMAGE };
  }
}

// ---- Report ----
export async function generateReport(analysisId: string): Promise<{ reportId: string; reportUrl: string }> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(700);
    return { reportId: analysisId, reportUrl: '#' };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/report/${analysisId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Report generation failed');
    return await res.json();
  } catch {
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

  return {
    ...MOCK_ANALYSIS_RESULT,
    analysisId: reportRes.reportId || `RBC-${Date.now().toString().slice(-5)}`,
    imageUrl: uploadedUrl || URL.createObjectURL(file),
    imageName: file.name,
    imageSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    predictedClass: predRes.predictedClass as MorphologyClass,
    confidence: predRes.confidence,
    topPredictions: predRes.topPredictions as PredictionItem[],
    segmentation: segRes.stats,
    preprocessing: preprocessRes.details,
    processedImageUrl: preprocessRes.processedUrl,
    segmentedImageUrl: segRes.segmentedUrl,
    heatmapUrl: camRes.heatmapUrl,
    overlayUrl: camRes.overlayUrl,
    processingTime: `${durationSec}s`,
  };
}

// ---- History ----
export async function getAnalysisHistory(): Promise<HistoryItem[]> {
  const live = await checkBackendHealth();
  if (!live) {
    await delay(300);
    return MOCK_HISTORY;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    const data = await res.json();
    return data.length ? data : MOCK_HISTORY;
  } catch {
    return MOCK_HISTORY;
  }
}

// ---- Download Report as PDF / HTML ----
export function downloadReportPDF(resultOrId?: AnalysisResult | string): void {
  if (resultOrId && typeof resultOrId === 'object') {
    downloadClinicalReport(resultOrId);
  } else {
    downloadClinicalReport({
      ...MOCK_ANALYSIS_RESULT,
      analysisId: typeof resultOrId === 'string' ? resultOrId : MOCK_ANALYSIS_RESULT.analysisId,
    });
  }
}
