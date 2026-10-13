"""
Ellipse Fitting for RBC Morphology Segmentation.
Fits best-approximating ellipses to single and separated red blood cell contours.
"""

from typing import Optional, Dict, Any
import cv2
import numpy as np


def fit_ellipse_to_contour(
    contour: np.ndarray
) -> Optional[Dict[str, Any]]:
    """
    Fit an ellipse to an individual cell contour.

    Args:
        contour: Input OpenCV contour (must have at least 5 points).

    Returns:
        Dictionary containing ellipse parameters:
            - center: (cx, cy)
            - axes: (major_axis, minor_axis)
            - angle: orientation angle in degrees
            - aspect_ratio: major / minor axis ratio
            - area: approx elliptical area
        or None if fitting is not mathematically viable.
    """
    if contour is None or not isinstance(contour, np.ndarray) or len(contour) < 5:
        return None

    try:
        ellipse = cv2.fitEllipse(contour)
        (cx, cy), (d1, d2), angle = ellipse

        if np.isnan(cx) or np.isnan(cy) or np.isnan(d1) or np.isnan(d2) or np.isnan(angle):
            return None

        major = max(d1, d2)
        minor = min(d1, d2)

        if minor <= 0 or major <= 0:
            return None

        aspect_ratio = major / minor
        area = np.pi * (major / 2.0) * (minor / 2.0)

        return {
            "center": (round(float(cx), 2), round(float(cy), 2)),
            "axes": (round(float(major), 2), round(float(minor), 2)),
            "angle": round(float(angle), 2),
            "aspect_ratio": round(float(aspect_ratio), 3),
            "area": round(float(area), 2),
            "raw_ellipse": ellipse,
        }
    except Exception:
        return None
