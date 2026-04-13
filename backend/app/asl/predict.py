import base64

import cv2
import numpy as np

from app.config import settings

model = None
detector = None
fallback_detector = None
labels = []
FEATURES_PER_FRAME = 63
DETECTION_IMAGE_SIZE = (640, 480)


def _build_asl_model(num_classes: int):
    import tensorflow as tf

    return tf.keras.Sequential(
        [
            tf.keras.layers.Dense(128, activation="relu", input_shape=(FEATURES_PER_FRAME,)),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dense(num_classes, activation="softmax"),
        ]
    )


def _build_hand_detector(
    *,
    static_image_mode: bool,
    model_complexity: int,
    min_detection_confidence: float,
    min_tracking_confidence: float,
):
    try:
        import mediapipe as mp

        solutions = getattr(mp, "solutions", None)
        if solutions is not None and hasattr(solutions, "hands"):
            hands_module = solutions.hands
        else:
            from mediapipe.python.solutions import hands as hands_module
    except Exception:
        from mediapipe.python.solutions import hands as hands_module

    return hands_module.Hands(
        static_image_mode=static_image_mode,
        model_complexity=model_complexity,
        max_num_hands=2,
        min_detection_confidence=min_detection_confidence,
        min_tracking_confidence=min_tracking_confidence,
    )


def _extract_landmarks(results):
    if not results or not results.multi_hand_landmarks:
        return None

    landmarks = []
    for lm in results.multi_hand_landmarks[0].landmark:
        landmarks.extend([lm.x, lm.y, lm.z])
    return np.array(landmarks, dtype=np.float32)


def _transform_landmarks(landmarks, transform_name, metadata):
    transformed = landmarks.copy()
    x_indices = np.arange(0, FEATURES_PER_FRAME, 3)
    y_indices = np.arange(1, FEATURES_PER_FRAME, 3)

    if transform_name == "flip":
        transformed[x_indices] = 1.0 - transformed[x_indices]
        return transformed

    if transform_name == "pad":
        pad_x = metadata["pad_x"]
        pad_y = metadata["pad_y"]
        padded_width = metadata["width"]
        padded_height = metadata["height"]
        original_width = metadata["original_width"]
        original_height = metadata["original_height"]

        transformed[x_indices] = (
            (transformed[x_indices] * padded_width) - pad_x
        ) / max(original_width, 1)
        transformed[y_indices] = (
            (transformed[y_indices] * padded_height) - pad_y
        ) / max(original_height, 1)
        transformed[x_indices] = np.clip(transformed[x_indices], 0.0, 1.0)
        transformed[y_indices] = np.clip(transformed[y_indices], 0.0, 1.0)
        return transformed

    return transformed


def _frame_variants(frame_rgb):
    height, width = frame_rgb.shape[:2]
    pad_x = int(width * 0.35)
    pad_y = int(height * 0.35)
    padded = cv2.copyMakeBorder(
        frame_rgb,
        pad_y,
        pad_y,
        pad_x,
        pad_x,
        cv2.BORDER_CONSTANT,
        value=(0, 0, 0),
    )

    variants = [
        ("original", frame_rgb, {}),
        ("bright", cv2.convertScaleAbs(frame_rgb, alpha=1.2, beta=18), {}),
        ("contrast", cv2.convertScaleAbs(frame_rgb, alpha=1.35, beta=0), {}),
        ("flip", cv2.flip(frame_rgb, 1), {}),
        (
            "pad",
            padded,
            {
                "pad_x": pad_x,
                "pad_y": pad_y,
                "width": padded.shape[1],
                "height": padded.shape[0],
                "original_width": width,
                "original_height": height,
            },
        ),
    ]
    return variants


def _detect_landmarks(frame_rgb):
    global detector, fallback_detector

    if detector is None and fallback_detector is None:
        return None

    variants = _frame_variants(frame_rgb)

    for transform_name, variant, metadata in variants:
        if detector is None:
            break
        results = detector.process(variant)
        landmarks = _extract_landmarks(results)
        if landmarks is not None:
            return _transform_landmarks(landmarks, transform_name, metadata)

    for transform_name, variant, metadata in variants:
        if fallback_detector is None:
            break
        results = fallback_detector.process(variant)
        landmarks = _extract_landmarks(results)
        if landmarks is not None:
            return _transform_landmarks(landmarks, transform_name, metadata)

    return None


def load_model():
    global model, detector, fallback_detector, labels

    model = None
    detector = None
    fallback_detector = None
    labels = []

    model_path = settings.SPELL_MODEL_PATH
    labels_path = settings.SPELL_LABELS_PATH

    print("Loading model from:", model_path)

    try:
        with open(labels_path, "r", encoding="utf-8") as handle:
            labels = [line.strip() for line in handle.readlines() if line.strip()]
        print(f"Loaded {len(labels)} labels")
    except Exception as labels_error:
        labels = []
        print(f"Failed to load ASL labels: {labels_error}")

    try:
        import tensorflow as tf

        num_classes = len(labels) if labels else 39
        model = _build_asl_model(num_classes)
        model.load_weights(model_path)
        print("ASL weights loaded into rebuilt TensorFlow model")
    except Exception as weights_error:
        try:
            import tensorflow as tf

            model = tf.keras.models.load_model(model_path, compile=False)
            print("ASL model loaded via TensorFlow deserialization fallback")
        except Exception as tf_error:
            model = None
            print(
                "Failed to load ASL model. "
                f"Weights error: {weights_error}. "
                f"TensorFlow fallback error: {tf_error}"
            )

    try:
        detector = _build_hand_detector(
            static_image_mode=False,
            model_complexity=0,
            min_detection_confidence=0.2,
            min_tracking_confidence=0.2,
        )
        fallback_detector = _build_hand_detector(
            static_image_mode=True,
            model_complexity=1,
            min_detection_confidence=0.15,
            min_tracking_confidence=0.15,
        )
        print("Mediapipe Hands detectors loaded")
    except Exception as detector_error:
        detector = None
        fallback_detector = None
        print(f"Failed to load Mediapipe model: {detector_error}")


def get_landmarks(base64_string):
    global detector

    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None or detector is None:
        return None

    image = cv2.resize(image, DETECTION_IMAGE_SIZE)
    frame_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return _detect_landmarks(frame_rgb)


def _coerce_landmarks(raw_features):
    if isinstance(raw_features, np.ndarray):
        landmarks = raw_features.astype(np.float32).flatten()
    elif isinstance(raw_features, (list, tuple)):
        try:
            landmarks = np.array(raw_features, dtype=np.float32).flatten()
        except Exception:
            return None
    else:
        return None

    if landmarks.size != FEATURES_PER_FRAME:
        return None

    return landmarks


def predict_sign(frame_data):
    global model, labels
    if model is None:
        return {"error": "Model not loaded"}

    try:
        landmarks = _coerce_landmarks(frame_data)
        used_client_landmarks = landmarks is not None
        if landmarks is None:
            landmarks = get_landmarks(frame_data)
        if landmarks is None:
            return {"prediction": "", "error": "No hands detected"}

        prediction_probs = model.predict(np.array([landmarks]), verbose=0)[0]
        max_index = np.argmax(prediction_probs)
        confidence = float(prediction_probs[max_index])

        predicted_label = str(max_index)
        if labels and max_index < len(labels):
            predicted_label = labels[max_index]

        return {
            "prediction": predicted_label,
            "confidence": confidence,
            "landmarks_detected": True,
            "source": "client-landmarks" if used_client_landmarks else "server-detector",
        }
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}
