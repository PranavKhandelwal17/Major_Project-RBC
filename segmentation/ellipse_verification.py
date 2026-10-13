"""
Ellipse Verification for RBC Morphology.
Verifies whether a fitted ellipse meets biological and optical RBC constraints.
"""

from typing import Dict, Any, Tuple


def verify_rbc_ellipse(
    ellipse_info: Dict[str, Any],
    min_area: float = 200.0,
    max_area: float = 6500.0,
    max_aspect_ratio: float = 3.5,
) -> Tuple[bool, str]:
    """
    Verify whether a fitted ellipse matches plausible RBC morphology.

    Args:
        ellipse_info: Dictionary containing ellipse parameters from fit_ellipse_to_contour.
        min_area: Minimum acceptable RBC area in pixels.
        max_area: Maximum acceptable RBC area in pixels for a single cell.
        max_aspect_ratio: Maximum aspect ratio (major/minor axis).

    Returns:
        Tuple of (is_valid: bool, reason: str).
    """
    if not ellipse_info:
        return False, "No valid ellipse fit available"

    area = ellipse_info.get("area", 0)
    aspect_ratio = ellipse_info.get("aspect_ratio", 1.0)
    major, minor = ellipse_info.get("axes", (0, 0))

    if area < min_area:
        return False, f"Area {area:.1f} < min threshold {min_area}"

    if area > max_area:
        return False, f"Area {area:.1f} > max threshold {max_area} (likely cluster/overlap)"

    if aspect_ratio > max_aspect_ratio:
        return False, f"Aspect ratio {aspect_ratio:.2f} excessively elongated"

    if minor < 10:
        return False, "Minor axis too thin for erythrocyte"

    return True, "Valid RBC morphology"
