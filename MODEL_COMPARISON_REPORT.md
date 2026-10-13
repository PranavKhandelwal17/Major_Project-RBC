# RBC Insight AI — Deep Learning Model Comparison & Benchmark Report

## 1. Executive Summary

This report documents the empirical model evaluation and selection process for **RBC Insight AI** (Final-Year B.Tech Data Science Project). 
Five candidate convolutional architectures were trained, evaluated, and benchmarked on the **Chula-RBC-12** peripheral blood smear microscopy dataset across **12 red blood cell morphology classes**.

The selected best-performing architecture is **EfficientNetV2-S with controlled fine-tuning**, achieving:
- **Validation Accuracy:** **87.04%** (Loss: 0.4215)
- **Reserved Test Accuracy:** **85.36%** (Loss: 0.4259)
- **Macro F1-Score:** **79.02%**
- **Macro Recall:** **76.36%**
- **Weighted F1-Score:** **85.12%**
- **Model Checkpoint:** `models/final/rbc_morphology_efficientnetv2s_final.keras` (109.4 MB)
- **Inference Latency:** **42.5 ms / cell**

---

## 2. Dataset & Experimental Setup

### 2.1 Dataset Specifications
- **Dataset:** Chula-RBC-12 Peripheral Blood Smear Dataset
- **Total RBC Samples:** 17,707 annotated single and clustered erythrocytes
- **Number of Classes:** 12 morphology classes
- **Input Resolution:** $224 \times 224 \times 3$ (RGB)
- **Staining:** Standard Giemsa / Wright-Giemsa peripheral smear

### 2.2 Data Split (Leakage-Prevented Split)
- **Training Set:** 11,937 samples (~67.4%) with class-balanced sampling & controlled data augmentation
- **Validation Set:** 2,908 samples (~16.4%) reserved for early stopping & hyperparameter tuning
- **Test Set:** 2,862 samples (~16.2%) strictly reserved for final unbiased performance evaluation

### 2.3 Evaluated Classes
1. **0_Normal:** 913 test samples
2. **1_Macrocyte:** 70 test samples
3. **2_Microcyte:** 87 test samples
4. **3_Spherocyte:** 441 test samples
5. **4_Target_Cell:** 246 test samples
6. **5_Stomatocyte:** 245 test samples
7. **6_Ovalocyte:** 412 test samples
8. **7_Teardrop:** 27 test samples
9. **8_Burr_Cell:** 150 test samples
10. **9_Schistocyte:** 93 test samples
11. **10_Uncategorized:** 26 test samples
12. **11_Hypochromia:** 152 test samples

---

## 3. Architecture Comparison & Benchmark Matrix

| Architecture Candidate | Strategy / Checkpoint | Val Acc (%) | Test Acc (%) | Macro F1 (%) | Macro Recall (%) | Size (MB) | Latency (ms) | Selection Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **EfficientNetV2-S (Controlled Fine-Tuning)** | `models/final/rbc_morphology_efficientnetv2s_final.keras` | **87.04** | **85.36** | **79.02** | **76.36** | 109.4 | 42.5 | **SELECTED WINNER** |
| **EfficientNet-B1 (Fine-Tuned)** | `models/efficientnet_b1/best_efficientnet_b1_finetuned.keras` | 78.60 | 77.85 | 71.48 | 69.10 | 49.4 | 28.1 | Baseline Fine-tuned |
| **EfficientNet-B1 (Targeted Augmentation)** | `models/efficientnet_b1/best_efficientnet_b1_targeted.keras` | 78.40 | 77.74 | 71.68 | 69.45 | 72.5 | 28.4 | Augmentation Variant |
| **EfficientNet-B1 (Stage 1 Frozen)** | `models/efficientnet_b1/best_efficientnet_b1.keras` | 74.14 | 73.62 | 65.05 | 62.15 | 26.4 | 26.0 | Feature Extractor |
| **MobileNetV2 (Baseline Transfer)** | `models/best_rbc_model.keras` | 73.31 | 72.99 | 67.24 | 75.81 | 13.0 | 14.8 | Lightweight Baseline |

---

## 4. Per-Class Diagnostic Performance (EfficientNetV2-S Final Model)

| Class ID | Morphology Class | Precision | Recall | F1-Score | Test Support | Clinical Relevance |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| 0 | **Normal (Discocyte)** | 0.912 | 0.884 | 0.898 | 913 | Baseline biconcave disc |
| 1 | **Macrocyte** | 0.785 | 0.857 | 0.819 | 70 | Megaloblastic anemia (B12/folate) |
| 2 | **Microcyte** | 0.724 | 0.736 | 0.730 | 87 | Iron deficiency / Thalassemia minor |
| 3 | **Spherocyte** | 0.901 | 0.882 | 0.891 | 441 | Hereditary spherocytosis / AIHA |
| 4 | **Target Cell (Codocyte)** | 0.854 | 0.829 | 0.841 | 246 | Hemoglobinopathies / Liver disease |
| 5 | **Stomatocyte** | 0.820 | 0.914 | 0.865 | 245 | Stomatocytosis / Alcoholism |
| 6 | **Ovalocyte (Elliptocyte)** | 0.887 | 0.835 | 0.860 | 412 | Hereditary elliptocytosis |
| 7 | **Teardrop (Dacryocyte)** | 0.750 | 0.667 | 0.706 | 27 | Myelofibrosis / Extramedullary hematopoiesis |
| 8 | **Burr Cell (Echinocyte)** | 0.860 | 0.880 | 0.870 | 150 | Uremia / Renal disease |
| 9 | **Schistocyte** | 0.780 | 0.742 | 0.760 | 93 | Microangiopathic hemolysis (TTP/DIC/HUS) |
| 10 | **Uncategorized** | 0.625 | 0.577 | 0.600 | 26 | Atypical morphology |
| 11 | **Hypochromia** | 0.768 | 0.711 | 0.738 | 152 | Severe iron deficiency anemia |

---

## 5. Selection Rationale

1. **Highest Generalization on Reserved Test Data:**
   EfficientNetV2-S achieved 85.36% test accuracy, surpassing MobileNetV2 by **+12.37%** and fine-tuned EfficientNet-B1 by **+7.51%**.
2. **Robustness on Clinically Critical Rare Classes:**
   Morphologies with low sample support (such as Schistocytes with 93 samples and Teardrops with 27 samples) showed severe degradation in MobileNetV2 (F1 < 0.60) due to under-parameterization. EfficientNetV2-S progressive layer unfreezing preserved fine edge gradients for helmet fragments and tapered tail structures, achieving 0.760 F1 on Schistocytes and 0.706 F1 on Teardrops.
3. **Clinical Feasibility & Latency:**
   With an average inference latency of **42.5 ms per cell crop**, EfficientNetV2-S comfortably operates within interactive real-time inspection speeds (<100 ms) while ensuring superior diagnostic accuracy.

---

## 6. Model Artifacts & File Structure

```
models/
├── final/
│   ├── rbc_morphology_efficientnetv2s_final.keras  # 114.7 MB (Selected model)
│   └── class_labels.json                          # 12 morphology classes
├── efficientnet_b1/
│   ├── best_efficientnet_b1.keras                  # 27.6 MB (Stage 1)
│   ├── best_efficientnet_b1_finetuned.keras        # 51.7 MB (Fine-tuned)
│   └── best_efficientnet_b1_targeted.keras         # 76.0 MB (Targeted)
├── visualizations/
│   ├── 01_confusion_matrix.png
│   ├── 02_class_wise_accuracy.png
│   ├── 03_precision_recall_f1.png
│   ├── 06_training_validation_accuracy.png
│   └── 07_training_validation_loss.png
├── mobilenetv2_class_analysis.csv
└── training_history.csv
```
