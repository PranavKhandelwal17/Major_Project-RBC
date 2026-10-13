"""
Contour Extraction for RBC Microscopy Images.
Performs thresholding, morphological filtering, and contour localization.
"""

from typing import List, Tuple, Dict, Any
import cv2
import numpy as np


def extract_contours(
    image_bgr: np.ndarray,
    min_area: float = 150.0,
    max_area: float = 25000.0,
    morph_kernel_size: int = 5,
) -> Tuple[List[np.ndarray], np.ndarray, Dict[str, Any]]:
    """
    Extract RBC contours and foreground mask from microscopy image.

    Args:
        image_bgr: Input image (BGR, RGBA, or Grayscale).
        min_area: Minimum contour area in pixels to discard debris.
        max_area: Maximum contour area to discard huge artifacts.
        morph_kernel_size: Size of elliptical structuring element.

    Returns:
        Tuple of (filtered_contours, binary_mask, contour_metrics).
    """
    empty_metrics = {
        "raw_contours_found": 0,
        "valid_cells_retained": 0,
        "min_area_filter": min_area,
        "max_area_filter": max_area,
        "contour_stats": [],
    }

    if image_bgr is None or not isinstance(image_bgr, np.ndarray) or image_bgr.size == 0:
        return [], np.zeros((1, 1), dtype=np.uint8), empty_metrics

    # Safely extract single-channel grayscale array
    if image_bgr.ndim == 2:
        gray = image_bgr.copy()
    elif image_bgr.ndim == 3:
        if image_bgr.shape[2] == 1:
            gray = image_bgr[:, :, 0].copy()
        elif image_bgr.shape[2] == 4:
            gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGRA2GRAY)
        elif image_bgr.shape[2] == 3:
            gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        else:
            raise ValueError(f"Unsupported number of image channels: {image_bgr.shape[2]}")
    else:
        raise ValueError(f"Unsupported image dimensions: {image_bgr.ndim}D array")

    # Ensure uint8 [0, 255]
    if np.issubdtype(gray.dtype, np.floating):
        if float(gray.max()) <= 1.0:
            gray = (np.clip(gray, 0.0, 1.0) * 255.0).astype(np.uint8)
        else:
            gray = np.clip(gray, 0, 255).astype(np.uint8)
    elif gray.dtype != np.uint8:
        gray = np.clip(gray, 0, 255).astype(np.uint8)

    blurred = cv2.GaussianBlur(gray, (7, 7), 0)

    # Otsu thresholding (cells are darker than background in brightfield smear)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Morphological opening to detach slight bridges and remove small noise
    kernel_size = max(1, morph_kernel_size)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    cleaned_mask = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
    cleaned_mask = cv2.morphologyEx(cleaned_mask, cv2.MORPH_CLOSE, kernel, iterations=1)

    raw_contours, _ = cv2.findContours(
        cleaned_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    filtered_contours = []
    contour_stats = []

    for cnt in raw_contours:
        area = cv2.contourArea(cnt)
        if min_area <= area <= max_area:
            filtered_contours.append(cnt)
            perimeter = cv2.arcLength(cnt, True)
            circularity = (4 * np.pi * area) / (perimeter ** 2 + 1e-6)
            circularity = min(1.0, max(0.0, float(circularity)))
            x, y, w, h = cv2.boundingRect(cnt)
            contour_stats.append({
                "area": float(area),
                "circularity": round(float(circularity), 3),
                "bbox": [int(x), int(y), int(w), int(h)],
            })

    metrics = {
        "raw_contours_found": len(raw_contours),
        "valid_cells_retained": len(filtered_contours),
        "min_area_filter": min_area,
        "max_area_filter": max_area,
        "contour_stats": contour_stats,
    }

    return filtered_contours, cleaned_mask, metrics

