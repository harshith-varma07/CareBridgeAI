import base64
import io
import logging

import cv2
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

# Maximum allowed base64 string size (10 MB)
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

DEFAULT_FEATURES = {
    "rednessScore": 0.2,
    "brightness": 0.5,
    "quality": 0.5,
    "swellingApproximation": 0.3,
}


def image_features(image_b64: str | None) -> dict:
    """Extract image features from a base64-encoded image.

    Performs redness scoring, brightness, quality, and swelling approximation
    using OpenCV and PIL. Returns sensible defaults when no image is provided
    or when decoding fails.

    Args:
        image_b64: Base64-encoded image string, or None.

    Returns:
        Dict with keys: rednessScore, brightness, quality, swellingApproximation.
    """
    if not image_b64:
        return dict(DEFAULT_FEATURES)

    # Size check: reject base64 strings > 10 MB
    if len(image_b64) > MAX_IMAGE_SIZE_BYTES:
        logger.warning(
            "Image base64 string exceeds %d bytes (%d bytes received), returning defaults",
            MAX_IMAGE_SIZE_BYTES,
            len(image_b64),
        )
        return dict(DEFAULT_FEATURES)

    try:
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        arr = np.array(image)
    except Exception:
        logger.exception("Failed to decode image from base64 input, returning defaults")
        return dict(DEFAULT_FEATURES)

    red_channel = arr[:, :, 0].astype(np.float32)
    green_channel = arr[:, :, 1].astype(np.float32)
    blue_channel = arr[:, :, 2].astype(np.float32)
    redness = float(np.clip(np.mean((red_channel - (green_channel + blue_channel) / 2.0) / 255.0), 0, 1))

    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    brightness = float(np.clip(np.mean(gray) / 255.0, 0, 1))
    quality = float(np.clip(cv2.Laplacian(gray, cv2.CV_64F).var() / 1000.0, 0, 1))
    swelling = float(np.clip(np.std(red_channel) / 64.0, 0, 1))

    return {
        "rednessScore": redness,
        "brightness": brightness,
        "quality": quality,
        "swellingApproximation": swelling,
    }
