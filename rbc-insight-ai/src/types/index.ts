// =============================================
// Core Types for RBC Insight AI
// =============================================

export type MorphologyClass =
  | 'Normal'
  | 'Macrocyte'
  | 'Microcyte'
  | 'Spherocyte'
  | 'Target Cell'
  | 'Stomatocyte'
  | 'Ovalocyte'
  | 'Teardrop'
  | 'Burr Cell'
  | 'Schistocyte'
  | 'Hypochromia'
  | 'Uncategorized';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'error';

export type PipelineStepId =
  | 'input'
  | 'preprocessing'
  | 'segmentation'
  | 'classification'
  | 'prediction'
  | 'gradcam'
  | 'report';

export interface PipelineStep {
  id: PipelineStepId;
  number: string;
  title: string;
  icon: string;
  status: AnalysisStatus;
  description: string;
}

export interface PredictionItem {
  class: MorphologyClass;
  confidence: number;
}

export interface SegmentationStats {
  totalDetected: number;
  overlapping: number;
  separated: number;
  accuracy: number;
}

export interface PreprocessingDetails {
  originalResolution: string;
  processedResolution: string;
  normalization: boolean;
  contrastEnhancement: boolean;
  noiseReduction: boolean;
  dataAugmentation: boolean;
  resize: boolean;
}

export interface AnalysisResult {
  id: string;
  analysisId: string;
  date: string;
  imageUrl: string;
  imageName: string;
  imageSize: string;
  imageDimensions: string;
  predictedClass: MorphologyClass;
  confidence: number;
  topPredictions: PredictionItem[];
  morphologyDistribution: { name: string; value: number; color: string }[];
  segmentation: SegmentationStats;
  preprocessing: PreprocessingDetails;
  status: AnalysisStatus;
  processingTime: string;
  model: string;
  processedImageUrl?: string;
  segmentedImageUrl?: string;
  heatmapUrl?: string;
  overlayUrl?: string;
  reportUrl?: string;
}

export interface HistoryItem {
  id: string;
  analysisId: string;
  date: string;
  imageUrl: string;
  predictedClass: MorphologyClass;
  confidence: number;
  status: AnalysisStatus;
}

export type Page =
  | 'dashboard'
  | 'new-analysis'
  | 'results'
  | 'report'
  | 'history'
  | 'methodology'
  | 'model-performance'
  | 'about';

export interface UploadedFile {
  file: File;
  preview: string;
  name: string;
  size: string;
  dimensions: string;
}

export interface StatCard {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
  color: string;
}

export interface ModelCandidate {
  id: string;
  name: string;
  family: string;
  checkpointPath: string;
  modelSizeMB: number;
  valAccuracy: number;
  testAccuracy: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  weightedF1: number;
  avgInferenceLatencyMs: number;
  selected: boolean;
  selectionRationale: string;
}

export interface PerClassMetric {
  classId: number;
  className: string;
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

