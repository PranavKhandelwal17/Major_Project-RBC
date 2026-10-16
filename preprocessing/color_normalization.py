"""
Color Normalization and Preprocessing for RBC Microscopy Images.
Implements LAB color space conversion, CLAHE contrast enhancement,
Gaussian/Bilateral denoising, and input resizing.
"""

from typing import Tuple, Dict, Any
import cv2
import numpy as np


def _ensure_bgr_uint8(image: np.ndarray) -> np.ndarray:
    """
    Ensure input image is a valid 3-channel BGR uint8 numpy array.
    Handles grayscale, RGBA/BGRA, float scales, and single-channel arrays.
    """
    if image is None or not isinstance(image, np.ndarray) or image.size == 0:
        raise ValueError("Invalid image input: expected a non-empty numpy array.")

    # Convert floating point representations to standard [0, 255] uint8
    if np.issubdtype(image.dtype, np.floating):
        if float(image.max()) <= 1.0:
            arr = (np.clip(image, 0.0, 1.0) * 255.0).astype(np.uint8)
        else:
            arr = np.clip(image, 0, 255).astype(np.uint8)
    elif image.dtype != np.uint8:
        arr = np.clip(image, 0, 255).astype(np.uint8)
    else:
        arr = image.copy()

    # Normalize channel dimensions
    if arr.ndim == 2:
        return cv2.cvtColor(arr, cv2.COLOR_GRAY2BGR)
    elif arr.ndim == 3:
        if arr.shape[2] == 1:
            return cv2.cvtColor(arr, cv2.COLOR_GRAY2BGR)
        elif arr.shape[2] == 4:
            return cv2.cvtColor(arr, cv2.COLOR_BGRA2BGR)
        elif arr.shape[2] == 3:
            return arr
        else:
            raise ValueError(f"Unsupported number of image channels: {arr.shape[2]}")
    else:
        raise ValueError(f"Unsupported image dimensions: {arr.ndim}D array")


def preprocess_rbc_image(
    image: np.ndarray,
    target_size: Tuple[int, int] = (224, 224),
    apply_clahe: bool = True,
    apply_denoise: bool = True,
    clip_limit: float = 2.0,
    tile_grid_size: Tuple[int, int] = (8, 8),
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Apply standardized preprocessing pipeline to blood smear image.

    Args:
        image: Input image (BGR, RGBA, or Grayscale as numpy array).
        target_size: Output resolution (width, height), default (224, 224).
        apply_clahe: Whether to apply CLAHE in LAB color space.
        apply_denoise: Whether to apply Gaussian smoothing.
        clip_limit: CLAHE clip limit.
        tile_grid_size: CLAHE grid size.

    Returns:
        Tuple of (preprocessed BGR image, metadata dictionary).
    """
    processed = _ensure_bgr_uint8(image)
    orig_h, orig_w = processed.shape[:2]

    # 1. LAB Color normalization & CLAHE contrast enhancement
    if apply_clahe:
        lab = cv2.cvtColor(processed, cv2.COLOR_BGR2LAB)
        l_chan, a_chan, b_chan = cv2.split(lab)
        grid_w = max(1, min(int(tile_grid_size[0]), max(1, orig_w // 2)))
        grid_h = max(1, min(int(tile_grid_size[1]), max(1, orig_h // 2)))
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(grid_w, grid_h))
        cl = clahe.apply(l_chan)
        enhanced_lab = cv2.merge((cl, a_chan, b_chan))
        processed = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)

    # 2. Denoising
    if apply_denoise:
        processed = cv2.GaussianBlur(processed, (3, 3), 0)

    # 3. Resize to target dimension using anti-aliasing interpolation
    processed_resized = cv2.resize(processed, target_size, interpolation=cv2.INTER_AREA)

    metadata = {
        "original_resolution": f"{orig_w} × {orig_h} px",
        "processed_resolution": f"{target_size[0]} × {target_size[1]} px",
        "color_space": "LAB/BGR",
        "clahe_applied": apply_clahe,
        "clahe_clip_limit": clip_limit,
        "denoise_applied": apply_denoise,
        "interpolation": "cv2.INTER_AREA",
    }

    return processed_resized, metadata


def normalize_for_model(
    image_bgr: np.ndarray,
    norm_type: str = "zero_one"
) -> np.ndarray:
    """
    Normalize image values for deep learning inference.

    Args:
        image_bgr: Preprocessed image (BGR, RGBA, or Grayscale).
        norm_type: 'zero_one' ([0, 1]) or 'imagenet' (standard mean/std).

    Returns:
        RGB normalized float32 tensor of shape (H, W, 3).
    """
    bgr = _ensure_bgr_uint8(image_bgr)
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32)

    if norm_type in ("none", "raw", "raw_255"):
        return rgb
    elif norm_type == "zero_one":
        return rgb / 255.0
    elif norm_type == "imagenet":
        rgb_norm = rgb / 255.0
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        return (rgb_norm - mean) / std
    return rgb / 255.0


