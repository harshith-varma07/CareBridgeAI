import base64
import io

import cv2
import numpy as np
from PIL import Image


def image_features(image_b64: str | None) -> dict:
    if not image_b64:
        return {"rednessScore": 0.2, "brightness": 0.5, "quality": 0.5, "swellingApproximation": 0.3}

    image_bytes = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    arr = np.array(image)

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
