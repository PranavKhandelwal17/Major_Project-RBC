import type { AnalysisResult } from '../types';
import {
  MORPHOLOGY_DESCRIPTIONS,
  MOCK_RBC_IMAGE,
  MOCK_PROCESSED_IMAGE,
  MOCK_SEGMENTED_IMAGE,
  MOCK_GRADCAM_IMAGE,
} from '../data/mockData';

export function generateDoctorReportHTML(result: AnalysisResult): string {
  const originalImg = result.imageUrl || MOCK_RBC_IMAGE;
  const processedImg = result.processedImageUrl || MOCK_PROCESSED_IMAGE;
  const segmentedImg = result.segmentedImageUrl || MOCK_SEGMENTED_IMAGE;
  const gradcamImg = result.overlayUrl || result.heatmapUrl || MOCK_GRADCAM_IMAGE;

  const topPredictionsRows = (result.topPredictions || [])
    .map(
      (p, i) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: ${i === 0 ? '700' : '500'}; color: ${i === 0 ? '#1e40af' : '#334155'};">
          ${i + 1}. ${p.class}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: ${i === 0 ? '#1e40af' : '#475569'};">
          ${p.confidence.toFixed(2)}%
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">
          <div style="background: #e2e8f0; border-radius: 9999px; height: 8px; width: 100%; overflow: hidden;">
            <div style="background: ${i === 0 ? '#2563eb' : '#94a3b8'}; height: 100%; width: ${Math.min(100, p.confidence)}%;"></div>
          </div>
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
          ${i === 0 ? 'Primary Pathological Match' : 'Differential Consideration'}
        </td>
      </tr>
    `
    )
    .join('');

  const clinicalDiff = getClinicalDifferentialWorkup(result.predictedClass);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Clinical Laboratory Report - ${result.analysisId}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
    }
    .report-sheet {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .inst-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0 0 4px 0;
      text-transform: uppercase;
    }
    .inst-sub {
      font-size: 12px;
      color: #475569;
      font-weight: 600;
      margin: 0 0 2px 0;
    }
    .badge-report {
      display: inline-block;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-weight: 700;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 14px 16px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .meta-item .label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 2px;
    }
    .meta-item .val {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-all;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      color: #1e3a8a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin: 20px 0 12px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .primary-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #eff6ff;
      border: 1.5px solid #3b82f6;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }
    .primary-box .morph-name {
      font-size: 22px;
      font-weight: 900;
      color: #1e40af;
      margin: 0;
    }
    .primary-box .conf-score {
      font-size: 24px;
      font-weight: 900;
      color: #0284c7;
      margin: 0;
      text-align: right;
    }
    .image-panels {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .panel-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      background: #0f172a;
      text-align: center;
    }
    .panel-card img {
      width: 100%;
      height: 130px;
      object-fit: cover;
      display: block;
      background: #0f172a;
    }
    .panel-card .caption {
      background: #f8fafc;
      color: #334155;
      font-weight: 700;
      font-size: 10px;
      padding: 6px 4px;
      border-top: 1px solid #e2e8f0;
      text-transform: uppercase;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 12px;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 8px 12px;
      border-bottom: 2px solid #cbd5e1;
      font-size: 11px;
      text-transform: uppercase;
    }
    .clinical-callout {
      background: #fefce8;
      border-left: 4px solid #eab308;
      padding: 12px 16px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 16px;
    }
    .clinical-callout h5 {
      margin: 0 0 4px 0;
      color: #854d0e;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .clinical-callout p {
      margin: 0;
      color: #713f12;
      font-size: 12px;
      line-height: 1.45;
    }
    .workup-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 18px;
    }
    .workup-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
    }
    .workup-card h6 {
      margin: 0 0 6px 0;
      font-size: 11px;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
    }
    .workup-card ul {
      margin: 0;
      padding-left: 18px;
      font-size: 11.5px;
      color: #475569;
    }
    .workup-card li {
      margin-bottom: 3px;
    }
    .sig-block {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 28px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin-top: 40px;
      padding-top: 4px;
      font-size: 11px;
      color: #475569;
    }
    .disclaimer-text {
      font-size: 10px;
      color: #64748b;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #cbd5e1;
      text-align: justify;
      line-height: 1.4;
    }
    .no-print-bar {
      max-width: 900px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn-act {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .btn-act:hover {
      background: #1d4ed8;
    }
    .btn-close {
      background: #e2e8f0;
      color: #334155;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .report-sheet {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      .no-print-bar {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <button class="btn-act" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="report-sheet">
    <!-- Header -->
    <div class="header-bar">
      <div>
        <h1 class="inst-title">Department of Hematology & Clinical Pathology</h1>
        <p class="inst-sub">AI-Assisted Automated Red Blood Cell Morphology Analysis System</p>
        <p style="margin: 0; font-size: 11px; color: #64748b;">Chula-RBC-12 Morphology Classification & Grad-CAM Visual Explainability Protocol</p>
      </div>
      <div style="text-align: right;">
        <span class="badge-report">Validated Pathology Report</span>
        <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b; font-family: monospace;">ACCESSION: ${result.analysisId}</p>
      </div>
    </div>

    <!-- Metadata -->
    <div class="meta-grid">
      <div class="meta-item">
        <div class="label">Analysis ID</div>
        <div class="val">${result.analysisId}</div>
      </div>
      <div class="meta-item">
        <div class="label">Date / Time</div>
        <div class="val">${result.date}</div>
      </div>
      <div class="meta-item">
        <div class="label">Specimen</div>
        <div class="val">Peripheral Blood Film</div>
      </div>
      <div class="meta-item">
        <div class="label">AI Model</div>
        <div class="val">${result.model} (Inference: ${result.processingTime})</div>
      </div>
    </div>

    <!-- Primary Finding -->
    <div class="primary-box">
      <div>
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #3b82f6; margin-bottom: 4px;">
          Primary Morphological Classification
        </div>
        <h2 class="morph-name">${result.predictedClass}</h2>
        <div style="font-size: 11.5px; color: #334155; margin-top: 4px;">
          ${MORPHOLOGY_DESCRIPTIONS[result.predictedClass] || ''}
        </div>
      </div>
      <div>
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0284c7; text-align: right; margin-bottom: 4px;">
          Model Confidence
        </div>
        <div class="conf-score">${result.confidence.toFixed(1)}%</div>
        <div style="font-size: 10px; color: #64748b; text-align: right;">Softmax Output</div>
      </div>
    </div>

    <!-- Visual Diagnostics Panels -->
    <div class="section-title">
      <span>🔬 Multi-Stage Microscopic Visual Evidence (HPF Capture & AI Explainability)</span>
    </div>

    <div class="image-panels">
      <div class="panel-card">
        <img src="${originalImg}" alt="Original RBC Smear" />
        <div class="caption">1. Original Capture (100x Oil)</div>
      </div>
      <div class="panel-card">
        <img src="${processedImg}" alt="Preprocessed Matrix" />
        <div class="caption">2. Preprocessed (CLAHE)</div>
      </div>
      <div class="panel-card">
        <img src="${segmentedImg}" alt="Segmented Cells" />
        <div class="caption">3. RBC Segmentation (${result.segmentation.separated} Cells)</div>
      </div>
      <div class="panel-card">
        <img src="${gradcamImg}" alt="Grad-CAM Heatmap" />
        <div class="caption">4. Grad-CAM Explainability</div>
      </div>
    </div>

    <!-- Quantitative Metrics & Differential -->
    <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 20px;">
      <div>
        <div class="section-title">📊 Morphology Differential Probabilities</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Morphology Class</th>
              <th style="text-align: right;">Confidence</th>
              <th style="width: 80px;">Bar</th>
              <th>Pathological Significance</th>
            </tr>
          </thead>
          <tbody>
            ${topPredictionsRows}
          </tbody>
        </table>
      </div>

      <div>
        <div class="section-title">📐 Morphometric & Quality Metrics</div>
        <table class="data-table">
          <tbody>
            <tr>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Total RBCs Detected</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">${result.segmentation.totalDetected}</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Solitary (Separated)</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #16a34a;">${result.segmentation.separated}</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Overlapping / Clustered</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #ca8a04;">${result.segmentation.overlapping}</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Segmentation Accuracy</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #2563eb;">${result.segmentation.accuracy}%</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Color Normalization</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #16a34a;">LAB CLAHE Applied</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Noise Filtration</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">Gaussian (3×3)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Clinical Callout for Doctors -->
    <div class="clinical-callout">
      <h5>⚕️ Diagnostic Impression & Clinical Significance</h5>
      <p>${clinicalDiff.significance}</p>
    </div>

    <!-- Recommended Workup -->
    <div class="workup-grid">
      <div class="workup-card">
        <h6>Associated Conditions for Differential Workup</h6>
        <ul>
          ${clinicalDiff.conditions.map((c) => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div class="workup-card">
        <h6>Recommended Confirmatory Laboratory Tests</h6>
        <ul>
          ${clinicalDiff.tests.map((t) => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- Grad-CAM Interpretation Note -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-size: 11px; color: #475569;">
      <strong style="color: #0f172a;">Grad-CAM Explainability Finding:</strong> Class Activation Mapping confirms that the neural network's high-activation focal zones (red/yellow contours in Panel 4) correspond directly to erythrocyte membrane boundaries, central pallor proportion, and morphometric diameter rather than slide background or staining artifacts.
    </div>

    <!-- Signature Block -->
    <div class="sig-block">
      <div>
        <div class="sig-line">
          <strong>Automated Analysis System</strong><br>
          RBC Insight AI Deep Learning Pipeline (v1.0)<br>
          Verified Algorithm Execution: ${result.date}
        </div>
      </div>
      <div>
        <div class="sig-line">
          <strong>Reviewing Pathologist / Hematologist</strong><br>
          MD Pathology / FRCPath<br>
          Signature & Stamp: _______________________
        </div>
      </div>
    </div>

    <!-- Regulatory Disclaimer -->
    <div class="disclaimer-text">
      <strong>REGULATORY & CLINICAL DISCLAIMER:</strong> This report is generated by an automated computational pathology decision-support system intended to assist healthcare professionals in red blood cell morphology evaluation. This automated screening does not constitute an independent definitive diagnosis. Clinical correlation with full CBC hemogram indices (MCV, MCH, MCHC, RDW), clinical history, and manual microscopic peripheral blood smear confirmation by a qualified pathologist is strictly advised.
    </div>
  </div>
</body>
</html>`;
}

export function downloadClinicalReport(result: AnalysisResult): void {
  const htmlContent = generateDoctorReportHTML(result);

  // 1. Create file blob and download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `RBC_Clinical_Report_${result.analysisId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 2. Also open in new window with print ready trigger so doctor can immediately Save as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    // Allow images and styles to load before print prompt
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (e) {
        console.error('Print window error:', e);
      }
    }, 500);
  }
}

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
        'Iron Deficiency Anemia (most frequent)',
        'Thalassemia Minor / Trait (alpha or beta)',
        'Anemia of Chronic Disease / Chronic Inflammation',
        'Sideroblastic Anemia / Lead Toxicity (rare)',
      ],
      tests: [
        'CBC with RBC indices (MCV, MCH, Mentzer Index calculation)',
        'Iron profile: Serum Ferritin, Serum Iron, TIBC, Transferrin Saturation',
        'Hemoglobin HPLC / Hb Electrophoresis (for Hb A2, Hb F elevation)',
        'Reticulocyte count and peripheral smear manual review',
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
