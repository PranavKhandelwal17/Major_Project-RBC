"""
Concave Point Detection for Overlapping RBC Separation.
Detects convexity defects to identify pinch points between touching or clustered cells.
"""

from typing import List, Tuple
import cv2
import numpy as np


def find_concave_points(
    contour: np.ndarray,
    min_defect_depth: float = 12.0
) -> List[Tuple[int, int]]:
    """
    Find concave split points (convexity defects) along a cell contour.

    Args:
        contour: Input OpenCV contour.
        min_defect_depth: Minimum depth in pixels for a defect to be considered a pinch point.

    Returns:
        List of (x, y) coordinates representing concave pinch points.
    """
    if contour is None or not isinstance(contour, np.ndarray) or len(contour) < 5:
        return []

    try:
        hull = cv2.convexHull(contour, returnPoints=False)
        if hull is None or len(hull) < 3:
            return []

        defects = cv2.convexityDefects(contour, hull)
        if defects is None:
            return []

        concave_points = []
        for i in range(defects.shape[0]):
            row = defects[i, 0] if defects.ndim == 3 else defects[i]
            if len(row) == 4:
                s, e, f, d = row
                depth = d / 256.0  # OpenCV fixed-point defect depth
                if depth >= min_defect_depth and int(f) < len(contour):
                    pt = contour[int(f)][0]
                    far_pt = (int(pt[0]), int(pt[1]))
                    concave_points.append(far_pt)

        return concave_points
    except Exception:
        return []

