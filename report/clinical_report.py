"""
Clinical Report Generator for RBC Insight AI.
Produces structured, publication-quality medical analysis PDF reports
using ReportLab with metadata, morphology metrics, embedded microscopy visuals,
Grad-CAM explainability, and clinical disclaimers.
"""

import os
from typing import Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch


def generate_pdf_report(
    analysis_data: Dict[str, Any],
    output_pdf_path: str,
) -> str:
    """
    Generate a comprehensive clinical-style PDF report.

    Args:
        analysis_data: Dictionary containing analysis fields:
            - analysisId: str
            - date: str
            - model: str
            - imageName: str
            - imageDimensions: str
            - imageSize: str
            - predictedClass: str
            - confidence: float
            - topPredictions: list of {class, confidence}
            - segmentation: {totalDetected, overlapping, separated, accuracy}
            - originalImagePath: str
            - segmentedImagePath: str
            - gradcamImagePath: str
            - processingTime: str
        output_pdf_path: Path to save the resulting PDF file.

    Returns:
        Absolute path to the generated PDF.
    """
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Heading1"],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        fontName="Helvetica-Bold",
    )
    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#64748B"),
    )
    section_heading = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1E3A8A"),
        fontName="Helvetica-Bold",
        spaceBefore=8,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "ReportBody",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
    )
    meta_label = ParagraphStyle(
        "MetaLabel",
        parent=styles["Normal"],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        fontName="Helvetica-Bold",
    )
    meta_value = ParagraphStyle(
        "MetaValue",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#0F172A"),
    )
    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Normal"],
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#9A3412"),
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>RBC INSIGHT AI</b> &mdash; CLINICAL MORPHOLOGY REPORT", title_style),
            Paragraph(f"<b>REPORT ID:</b> {analysis_data.get('analysisId', 'RBC-DEMO')}<br/><b>DATE:</b> {analysis_data.get('date', 'N/A')}", meta_value),
        ]
    ]
    header_table = Table(header_data, colWidths=[4.2 * inch, 2.8 * inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(Paragraph("Automated Deep Learning & Computer Vision Peripheral Blood Smear Examination", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563EB"), spaceAfter=10))

    # 2. Key Diagnostic Summary Card
    pred_class = analysis_data.get("predictedClass", "Normal")
    try:
        confidence = float(analysis_data.get("confidence", 95.0))
    except (TypeError, ValueError):
        confidence = 95.0

    model_name = analysis_data.get("model", "EfficientNetV2-S (Controlled Fine-Tuned)")
    seg = analysis_data.get("segmentation", {})
    try:
        seg_acc = float(seg.get('accuracy', 95.0))
    except (TypeError, ValueError):
        seg_acc = 95.0

    summary_box_data = [
        [
            Paragraph("<b>PREDICTED MORPHOLOGY:</b>", meta_label),
            Paragraph(f"<b><font size=14 color='#1E3A8A'>{pred_class}</font></b>", meta_value),
            Paragraph("<b>MODEL CONFIDENCE:</b>", meta_label),
            Paragraph(f"<b><font size=14 color='#059669'>{confidence:.2f}%</font></b>", meta_value),
        ],
        [
            Paragraph("<b>ACTIVE ARCHITECTURE:</b>", meta_label),
            Paragraph(f"{model_name}", meta_value),
            Paragraph("<b>RBCs ANALYZED:</b>", meta_label),
            Paragraph(f"<b>{seg.get('separated', 0)}</b> of {seg.get('totalDetected', 0)} cells ({seg_acc:.1f}% separation)", meta_value),
        ],
    ]
    summary_table = Table(summary_box_data, colWidths=[1.8 * inch, 2.0 * inch, 1.6 * inch, 1.8 * inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # 3. Specimen & Examination Details
    story.append(Paragraph("SPECIMEN & PIPELINE SPECIFICATIONS", section_heading))
    spec_data = [
        [
            Paragraph("<b>Image File:</b>", meta_label), Paragraph(str(analysis_data.get("imageName", "microscopy_sample.png")), meta_value),
            Paragraph("<b>Resolution:</b>", meta_label), Paragraph(str(analysis_data.get("imageDimensions", "224 × 224 px")), meta_value),
        ],
        [
            Paragraph("<b>Input Size:</b>", meta_label), Paragraph(str(analysis_data.get("imageSize", "N/A")), meta_value),
            Paragraph("<b>Processing Time:</b>", meta_label), Paragraph(str(analysis_data.get("processingTime", "340ms")), meta_value),
        ],
        [
            Paragraph("<b>Preprocessing:</b>", meta_label), Paragraph("LAB CLAHE (clip=2.0) + Gaussian Filter (3x3)", meta_value),
            Paragraph("<b>Segmentation:</b>", meta_label), Paragraph("Otsu Binary + Ellipse Fitting + Concavity Filter", meta_value),
        ],
    ]
    spec_table = Table(spec_data, colWidths=[1.4 * inch, 2.2 * inch, 1.4 * inch, 2.2 * inch])
    spec_table.setStyle(TableStyle([
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(spec_table)
    story.append(Spacer(1, 10))

    # 4. Visual Evidence Panels (Original, Segmentation, Grad-CAM)
    story.append(Paragraph("MICROSCOPY & EXPLAINABLE AI EVIDENCE", section_heading))

    labels = ["1. Original Smear", "2. Cell Segmentation", "3. Grad-CAM Saliency Map"]
    img_paths = [
        analysis_data.get("originalImagePath"),
        analysis_data.get("segmentedImagePath"),
        analysis_data.get("gradcamImagePath"),
    ]

    img_row = []
    label_row = []
    panel_w = 2.2 * inch
    panel_h = 1.65 * inch

    for p, lbl in zip(img_paths, labels):
        if p and os.path.exists(p):
            try:
                img_obj = RLImage(p, width=panel_w, height=panel_h)
                img_row.append(img_obj)
            except Exception:
                img_row.append(Paragraph("<i>Image display unavailable</i>", body_style))
        else:
            img_row.append(Paragraph("<i>Sample Image</i>", body_style))
        label_row.append(Paragraph(f"<b>{lbl}</b>", meta_label))

    visual_table = Table([img_row, label_row], colWidths=[2.35 * inch, 2.35 * inch, 2.35 * inch])
    visual_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(visual_table)
    story.append(Spacer(1, 10))

    # 5. Top Predictions Distribution
    top_preds = analysis_data.get("topPredictions", [])
    if top_preds:
        story.append(Paragraph("DIFFERENTIAL MORPHOLOGY PROBABILITIES", section_heading))
        pred_table_data = [
            [Paragraph("<b>Morphology Class</b>", meta_label), Paragraph("<b>Probability</b>", meta_label), Paragraph("<b>Confidence Meter</b>", meta_label)]
        ]
        for p in top_preds[:5]:
            cls_name = p.get("class", "Unknown")
            try:
                c_val = float(p.get("confidence", 0.0))
            except (TypeError, ValueError):
                c_val = 0.0
            bar_pct = min(100.0, max(0.0, c_val))
            bar_html = f"<b>{c_val:.1f}%</b>"
            pred_table_data.append([
                Paragraph(cls_name, meta_value),
                Paragraph(bar_html, meta_value),
                Paragraph(f"[{'|' * int(bar_pct // 5)}{'.' * (20 - int(bar_pct // 5))}]", meta_label),
            ])
        pred_table = Table(pred_table_data, colWidths=[2.5 * inch, 1.8 * inch, 2.7 * inch])
        pred_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ]))
        story.append(pred_table)
        story.append(Spacer(1, 10))

    # 6. Clinical & Educational Disclaimer Banner
    disclaimer_text = (
        "<b>RESEARCH & EDUCATIONAL USE DISCLAIMER:</b> "
        "This report is generated by RBC Insight AI for academic demonstration and research purposes only. "
        "Artificial intelligence morphology classifications do not constitute a medical diagnosis. "
        "All findings must be evaluated by a qualified pathologist or hematologist in conjunction with a complete "
        "blood count (CBC), peripheral blood film microscopy, and clinical presentation."
    )
    disclaimer_box = Table(
        [[Paragraph(disclaimer_text, disclaimer_style)]],
        colWidths=[7.0 * inch]
    )
    disclaimer_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#F59E0B")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(Spacer(1, 6))
    story.append(disclaimer_box)

    # Build PDF
    doc.build(story)
    return os.path.abspath(output_pdf_path)
