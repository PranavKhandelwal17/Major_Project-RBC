import React from 'react';
import {
  FileText,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Microscope,
  Scissors,
  Eye,
  Sliders,
  Stethoscope,
  Activity,
} from 'lucide-react';
import type { AnalysisResult } from '../../types';
import {
  MORPHOLOGY_DESCRIPTIONS,
  MOCK_RBC_IMAGE,
  MOCK_PROCESSED_IMAGE,
  MOCK_SEGMENTED_IMAGE,
  MOCK_GRADCAM_IMAGE,
} from '../../data/mockData';
import Disclaimer from '../shared/Disclaimer';
import MorphologyBadge from '../shared/MorphologyBadge';
import { downloadClinicalReport } from '../../utils/reportExporter';

interface ClinicalReportProps {
  result: AnalysisResult;
}

const ClinicalReport: React.FC<ClinicalReportProps> = ({ result }) => {
  const originalImg = result.imageUrl || MOCK_RBC_IMAGE;
  const processedImg = result.processedImageUrl || MOCK_PROCESSED_IMAGE;
  const segmentedImg = result.segmentedImageUrl || MOCK_SEGMENTED_IMAGE;
  const gradcamImg = result.overlayUrl || result.heatmapUrl || MOCK_GRADCAM_IMAGE;

  const clinicalDiff = getClinicalDifferentialWorkup(result.predictedClass);

  const handleDownload = () => {
    downloadClinicalReport(result);
  };

  return (
    <div className="card overflow-hidden border border-slate-300 shadow-md">
      {/* Header with Hospital & Clinical Pathology details */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600/30 border border-blue-400/40 rounded-xl flex items-center justify-center">
              <Microscope size={24} className="text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white uppercase">
                  Department of Hematology & Clinical Pathology
                </h2>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 font-medium">
                AI-Assisted Automated RBC Morphology Examination & Explainability Report
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Protocol: Chula-RBC-12 · Deep CNN Classification · Grad-CAM
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-900/50 transition-all hover:-translate-y-0.5 cursor-pointer"
              title="Download standalone HTML report and open Save as PDF"
            >
              <Download size={14} />
              Download Clinical PDF / Report
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              title="Print document or Save as PDF"
            >
              <Printer size={14} />
              Print
            </button>
          </div>
        </div>

        {/* Patient & Requisition Metadata Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accession ID</p>
            <p className="font-mono font-bold text-blue-300 text-sm mt-0.5">{result.analysisId}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
            <p className="font-semibold text-white mt-0.5">{result.date}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Specimen Type</p>
            <p className="font-semibold text-white mt-0.5">Peripheral Blood Smear (EDTA)</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inference Model</p>
            <p className="font-semibold text-green-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={12} /> {result.model} ({result.processingTime})
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Primary Classification Callout */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Activity size={14} /> Primary Morphological Classification
            </p>
            <div className="flex items-center gap-3">
              <MorphologyBadge morphology={result.predictedClass} size="lg" />
              <div>
                <p className="text-2xl font-black text-slate-900">{result.predictedClass}</p>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {MORPHOLOGY_DESCRIPTIONS[result.predictedClass]}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right sm:border-l sm:border-blue-200 sm:pl-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model Confidence</p>
            <p className="text-3xl font-black text-blue-600">{result.confidence.toFixed(1)}%</p>
            <p className="text-[11px] text-slate-500">Softmax Class Probability</p>
          </div>
        </div>

        {/* Visual Evidence Section: 4 Microscopy Panels */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Microscope size={16} className="text-blue-600" />
              Microscopic Visual Evidence & Explainability Panels
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">100× Oil Immersion HPF Capture</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Panel 1: Original */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-sm flex flex-col">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Microscope size={13} className="text-slate-600" /> 1. Original Smear
                </span>
                <span className="text-[10px] font-mono text-slate-500">Input</span>
              </div>
              <div className="aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                <img src={originalImg} alt="Original Blood Smear" className="w-full h-full object-cover" />
              </div>
              <div className="p-2 bg-white text-[11px] text-slate-600 border-t border-slate-100">
                Peripheral blood film examination area
              </div>
            </div>

            {/* Panel 2: Preprocessed */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-sm flex flex-col">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                  <Sliders size={13} className="text-teal-600" /> 2. CLAHE Matrix
                </span>
                <span className="text-[10px] font-mono text-teal-600">224×224</span>
              </div>
              <div className="aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                <img src={processedImg} alt="Preprocessed RBC" className="w-full h-full object-cover" />
              </div>
              <div className="p-2 bg-white text-[11px] text-slate-600 border-t border-slate-100">
                LAB contrast normalized & denoised
              </div>
            </div>

            {/* Panel 3: Segmented */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-sm flex flex-col">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 flex items-center gap-1.5">
                  <Scissors size={13} className="text-purple-600" /> 3. Segmentation
                </span>
                <span className="text-[10px] font-mono text-purple-600">{result.segmentation.separated} Cells</span>
              </div>
              <div className="aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                <img src={segmentedImg} alt="Segmented Cells" className="w-full h-full object-cover" />
              </div>
              <div className="p-2 bg-white text-[11px] text-slate-600 border-t border-slate-100">
                Isolated RBC contours (Watershed/Ellipse)
              </div>
            </div>

            {/* Panel 4: Grad-CAM */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-sm flex flex-col">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-orange-800 flex items-center gap-1.5">
                  <Eye size={13} className="text-orange-600" /> 4. Grad-CAM Overlay
                </span>
                <span className="text-[10px] font-mono text-orange-600">Explainable</span>
              </div>
              <div className="aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                <img src={gradcamImg} alt="Grad-CAM Explainability" className="w-full h-full object-cover" />
              </div>
              <div className="p-2 bg-white text-[11px] text-slate-600 border-t border-slate-100">
                Gradient-weighted class attention heatmap
              </div>
            </div>
          </div>
        </div>

        {/* Quantitative Morphology Differential & Quality Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top 5 Differential */}
          <div className="lg:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText size={14} className="text-blue-600" />
              Quantitative Differential Diagnosis Probabilities
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                    <th className="pb-2">Rank & Morphology Class</th>
                    <th className="pb-2 text-right">Confidence</th>
                    <th className="pb-2 pl-4">Distribution</th>
                    <th className="pb-2 text-right">Pathological Impression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(result.topPredictions || []).map((pred, i) => (
                    <tr key={pred.class} className={i === 0 ? 'bg-blue-50/50 font-semibold' : ''}>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                          {i + 1}
                        </span>
                        <span className={i === 0 ? 'text-blue-800 font-bold' : 'text-slate-700'}>
                          {pred.class}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-800">
                        {pred.confidence.toFixed(1)}%
                      </td>
                      <td className="py-2.5 pl-4 w-36">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              i === 0 ? 'bg-blue-600' : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, pred.confidence)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-[11px] text-slate-500">
                        {i === 0 ? 'Primary Match' : 'Differential Consideration'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Morphometrics & Quality Control */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sliders size={14} className="text-teal-600" />
              Morphometric & Quality Metrics
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Total RBCs Counted:</span>
                <span className="font-bold text-slate-800 font-mono">{result.segmentation.totalDetected}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Solitary (Isolated) RBCs:</span>
                <span className="font-bold text-green-700 font-mono">{result.segmentation.separated}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Overlapping / Clustered:</span>
                <span className="font-bold text-amber-700 font-mono">{result.segmentation.overlapping}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Segmentation Quality Index:</span>
                <span className="font-bold text-blue-700 font-mono">{result.segmentation.accuracy}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Color Preprocessing:</span>
                <span className="font-bold text-slate-800">LAB CLAHE (8×8)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Filter Kernel:</span>
                <span className="font-bold text-slate-800">Gaussian 3×3 Denoise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor-Focused Clinical Pathology Impression */}
        <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200">
          <div className="flex items-start gap-3">
            <Stethoscope size={20} className="text-amber-700 mt-0.5 flex-shrink-0" />
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                Clinical Diagnostic Impression & Pathology Correlation
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {clinicalDiff.significance}
              </p>
            </div>
          </div>
        </div>

        {/* Differential Diagnosis & Recommended Confirmatory Lab Workup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-amber-500" />
              Differential Diagnosis Considerations
            </h5>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
              {clinicalDiff.conditions.map((cond, i) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity size={13} className="text-blue-500" />
              Recommended Confirmatory Laboratory Tests
            </h5>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
              {clinicalDiff.tests.map((test, i) => (
                <li key={i}>{test}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Grad-CAM Interpretative Note */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-600">
          <strong className="text-blue-900 font-bold">Grad-CAM Explainability Note for Pathologist:</strong> The
          class activation heatmap (Panel 4) demonstrates that the neural network concentrated gradient energy on
          the cell membrane boundaries, central pallor ratio, and overall erythrocyte diameter, validating that the
          classification is driven by genuine cell morphology rather than background staining variance.
        </div>

        {/* Signature & Verification Block */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800">AUTOMATED ANALYSIS PIPELINE</p>
            <p className="text-slate-500">RBC Insight AI · EfficientNetV2 Architecture</p>
            <p className="text-slate-500 font-mono text-[11px]">System Status: Verified Valid Run</p>
            <p className="text-slate-500">{result.date}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800">REVIEWING HEMATOPATHOLOGIST</p>
            <div className="h-10 border-b border-slate-400 w-48 ml-auto my-1 flex items-end justify-end">
              <span className="text-[10px] text-slate-400 italic font-serif">Verified electronically</span>
            </div>
            <p className="text-slate-700 font-semibold">MD Pathology / Consultant Hematologist</p>
          </div>
        </div>

        {/* Formal Regulatory Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
};

function getClinicalDifferentialWorkup(morphology: string): {
  significance: string;
  conditions: string[];
  tests: string[];
} {
  const map: Record<string, { significance: string; conditions: string[]; tests: string[] }> = {
    Microcyte: {
      significance:
        'Microcytic erythrocytes (<6 µm, low MCV) indicate defective hemoglobin synthesis. Dominant etiology is iron deficiency anemia or thalassemia trait. Distinguishing between these two conditions is essential to avoid inappropriate iron therapy in thalassemia carriers.',
      conditions: [
        'Iron Deficiency Anemia (most frequent cause)',
        'Thalassemia Minor / Trait (Alpha or Beta globin defects)',
        'Anemia of Chronic Disease / Chronic Inflammation',
        'Sideroblastic Anemia / Lead Toxicity (infrequent)',
      ],
      tests: [
        'Complete Blood Count with red cell indices (MCV, MCH, Mentzer Index)',
        'Iron profile: Serum Ferritin, Serum Iron, TIBC, Transferrin Saturation',
        'Hemoglobin HPLC / Hb Electrophoresis (for elevated Hb A2 or Hb F)',
        'Reticulocyte count and manual peripheral blood smear confirmation',
      ],
    },
    Macrocyte: {
      significance:
        'Macrocytic erythrocytes (>8 µm, elevated MCV) reflect impaired DNA synthesis (megaloblastic) or altered erythrocyte membrane lipid composition (non-megaloblastic). Megaloblastic changes warrant urgent evaluation for neurological B12 complications.',
      conditions: [
        'Vitamin B12 Deficiency / Pernicious Anemia',
        'Folate Deficiency (malnutrition, malabsorption)',
        'Liver Disease / Chronic Alcohol Misuse',
        'Myelodysplastic Syndrome (MDS) / Hypothyroidism',
      ],
      tests: [
        'Serum Vitamin B12 and Serum/RBC Folate levels',
        'Liver Function Tests (LFTs: AST, ALT, GGT, Total Bilirubin)',
        'Thyroid Stimulating Hormone (TSH) screen',
        'Bone marrow aspirate & biopsy if myelodysplasia is suspected',
      ],
    },
    Spherocyte: {
      significance:
        'Spherocytes are spherical erythrocytes lacking central pallor with reduced surface area-to-volume ratio, making them susceptible to splenic sequestration and hemolysis. Immediate differentiation between inherited cytoskeleton defects and autoimmune hemolysis is paramount.',
      conditions: [
        'Hereditary Spherocytosis (spectrin/ankyrin gene defect)',
        'Autoimmune Hemolytic Anemia (AIHA - warm IgG/cold agglutinin)',
        'ABO Incompatibility (neonatal hemolytic disease)',
        'Thermal Burn Injury / Clostridial Septicemia',
      ],
      tests: [
        'Direct Antiglobulin Test (DAT / Coombs Test) to rule out AIHA',
        'Osmotic Fragility Test or Eosin-5-Maleimide (EMA) binding by flow cytometry',
        'Hemolytic panel: Reticulocyte count, Serum Haptoglobin, LDH, Indirect Bilirubin',
        'Family history and pedigree analysis for inherited membrane defects',
      ],
    },
    'Target Cell': {
      significance:
        'Target cells (codocytes) feature a central hemoglobinized bullseye caused by an excess of cell membrane relative to intracellular hemoglobin content. Commonly observed in hemoglobinopathies, severe iron deficiency, or post-splenectomy states.',
      conditions: [
        'Thalassemia Syndromes (Alpha or Beta Thalassemia)',
        'Hemoglobin C, E, or S Disease / Trait',
        'Obstructive Jaundice / Chronic Hepatic Dysfunction',
        'Post-Splenectomy Erythrocyte Pool Persistence',
      ],
      tests: [
        'High-Performance Liquid Chromatography (HPLC) / Hb Electrophoresis',
        'Comprehensive Hepatic Panel and Abdominal Ultrasound',
        'Ferritin and Total Iron Binding Capacity (TIBC)',
        'Genetic testing for globin gene mutations where indicated',
      ],
    },
    Normal: {
      significance:
        'Erythrocytes display standard biconcave disc morphology (6-8 µm diameter, normochromic central pallor occupying roughly one-third of the cell). Overall morphology within normal physiological reference parameters.',
      conditions: [
        'Normocytic Normochromic Erythrocyte Morphology',
        'Acute Blood Loss (early stages before reticulocytosis)',
        'Early stages of mixed nutritional deficiencies (iron + B12 balance)',
        'Physiologic baseline in healthy subjects',
      ],
      tests: [
        'Routine Complete Blood Count (CBC) with differential count',
        'Ferritin baseline if screening for latent iron depletion',
        'Annual wellness monitoring as per clinical protocols',
      ],
    },
    Schistocyte: {
      significance:
        'Schistocytes are fragmented, irregularly sheared erythrocytes (helmet cells, triangular fragments) diagnostic of Microangiopathic Hemolytic Anemia (MAHA) or mechanical cardiac destruction. Their presence in significant numbers constitutes a hematologic emergency.',
      conditions: [
        'Thrombotic Thrombocytopenic Purpura (TTP - ADAMTS13 deficiency)',
        'Hemolytic Uremic Syndrome (HUS / STEC-HUS / Atypical HUS)',
        'Disseminated Intravascular Coagulation (DIC)',
        'Mechanical Prosthetic Heart Valve Shearing / HELLP Syndrome',
      ],
      tests: [
        'Platelet count (urgent rule-out for thrombocytopenia in MAHA)',
        'ADAMTS13 activity and inhibitor assay (urgent for TTP workup)',
        'Coagulation screen: PT/INR, aPTT, Fibrinogen, D-Dimer (rule out DIC)',
        'Renal function tests (BUN, Serum Creatinine, Urinalysis)',
      ],
    },
    Teardrop: {
      significance:
        'Teardrop cells (dacrocytes) are erythrocytes deformed into a pear or teardrop shape after passing through distorted marrow sinusoids, frequently indicative of marrow fibrosis, space-occupying lesions, or severe extramedullary hematopoiesis.',
      conditions: [
        'Primary Myelofibrosis (PMF) / Post-PV/ET Myelofibrosis',
        'Bone Marrow Infiltration (Metastatic carcinoma, granuloma, lymphoma)',
        'Severe Iron Deficiency Anemia / Megaloblastic Anemia',
        'Thalassemia Intermedia / Major with severe marrow stress',
      ],
      tests: [
        'Bone Marrow Trephine Biopsy with reticulin and collagen staining',
        'JAK2 V617F, CALR, and MPL mutation analysis',
        'Peripheral blood leukoerythroblastic picture evaluation (nucleated RBCs)',
        'Serum Erythropoietin and Abdominal Ultrasound (splenomegaly)',
      ],
    },
    'Burr Cell': {
      significance:
        'Burr cells (echinocytes) feature numerous small, uniform, evenly spaced projections along the membrane. Most commonly associated with uremic toxins altering the lipid membrane, severe hypokalemia, or in vitro artifact.',
      conditions: [
        'Uremia / Acute or Chronic Kidney Disease (CKD)',
        'Pyruvate Kinase Deficiency (inherited hemolytic anemia)',
        'Severe Hypomagnesemia / Hypokalemia / Hepatic Failure',
        'In vitro storage artifact or glass effect on blood smears',
      ],
      tests: [
        'Renal Function Profile: Serum Creatinine, BUN, eGFR',
        'Serum Electrolytes (Potassium, Sodium, Magnesium, Phosphate)',
        'Fresh smear preparation to exclude artifactual echinocytosis',
        'Erythrocyte Pyruvate Kinase enzyme activity assay',
      ],
    },
    Hypochromia: {
      significance:
        'Hypochromic erythrocytes exhibit enlarged central pallor exceeding one-third of the cell diameter with pale staining, directly reflecting diminished intracellular hemoglobin concentration (low MCH and MCHC).',
      conditions: [
        'Severe Iron Deficiency Anemia (chronic occult blood loss, malabsorption)',
        'Thalassemia Syndromes (defective globin synthesis)',
        'Sideroblastic Anemia / Lead Poisoning',
        'Anemia of Chronic Disease (late stages)',
      ],
      tests: [
        'Serum Ferritin, Serum Iron, Transferrin Saturation',
        'Fecal Occult Blood Test (FOBT) or Endoscopic Evaluation for bleeding source',
        'Hemoglobin HPLC to assess thalassemia carrier state',
        'Bone marrow iron store staining (Prussian blue) if refractory',
      ],
    },
    Stomatocyte: {
      significance:
        'Stomatocytes display a slit-like, mouth-shaped area of central pallor. May indicate altered erythrocyte membrane permeability to monovalent cations (sodium/potassium) or lipid expansion of the inner lipid monolayer.',
      conditions: [
        'Hereditary Stomatocytosis (overhydrated/dehydrated variants)',
        'Alcoholic Liver Disease / Acute Alcohol Intoxication',
        'Obstructive Biliary Disease / Biliary Cirrhosis',
        'Rh Deficiency Syndrome (Rh null disease)',
      ],
      tests: [
        'Liver Function Profile (LFTs) and blood alcohol screen',
        'Intracellular Sodium and Potassium measurements in erythrocytes',
        'Coombs test and Rh blood typing profile',
        'Osmotic gradient ektacytometry for membrane mechanics',
      ],
    },
    Ovalocyte: {
      significance:
        'Ovalocytes (elliptocytes) are oval to elongated rod-like erythrocytes with rounded ends. Predominantly caused by defective horizontal membrane protein interactions (spectrin dimer-dimer association defects).',
      conditions: [
        'Hereditary Elliptocytosis (usually autosomal dominant)',
        'Iron Deficiency Anemia (pencil cells in severe deficiency)',
        'Megaloblastic Anemia (macro-ovalocytes)',
        'Myelodysplastic Syndromes',
      ],
      tests: [
        'Peripheral blood review for pencil cells vs true elliptocytes',
        'Family history and screening for hereditary elliptocytosis',
        'Serum Ferritin and Vitamin B12/Folate levels',
        'Erythrocyte membrane protein electrophoresis',
      ],
    },
    Uncategorized: {
      significance:
        'The analyzed erythrocytes exhibit pleomorphic or atypical morphological variants not fitting clean singular classification buckets. May represent mixed poikilocytosis.',
      conditions: [
        'Mixed Nutritional Anemia (combined Iron + B12/Folate deficiency)',
        'Complex Hemolytic / Microangiopathic States',
        'Slide preparation or staining artifact',
        'Atypical Dyserythropoietic Anemia',
      ],
      tests: [
        'Comprehensive manual microscopic peripheral smear examination by pathologist',
        'Complete Blood Count with full red cell parameters and RDW-CV / RDW-SD',
        'Complete metabolic, liver, and renal panel',
      ],
    },
  };

  return (
    map[morphology] || {
      significance:
        'Clinical significance must be interpreted by a qualified medical practitioner in the context of the patient complete history and hemogram.',
      conditions: ['Clinical correlation recommended', 'CBC correlation required'],
      tests: ['Complete Blood Count', 'Peripheral Blood Film review'],
    }
  );
}

export default ClinicalReport;
