import base64

import cv2
import numpy as np

from app.config import settings

model = None
detector = None
labels = []
FEATURES_PER_FRAME = 63


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


def _build_hand_detector():
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
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.3,
    )


def load_model():
    global model, detector, labels

    model = None
    detector = None
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
        detector = _build_hand_detector()
        print("Mediapipe Hands detector loaded")
    except Exception as detector_error:
        detector = None
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

    frame_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = detector.process(frame_rgb)

    if not results.multi_hand_landmarks:
        return None

    landmarks = []
    for lm in results.multi_hand_landmarks[0].landmark:
        landmarks.extend([lm.x, lm.y, lm.z])
    return np.array(landmarks)


def predict_sign(frame_data):
    global model, labels
    if model is None:
        return {"error": "Model not loaded"}

    try:
        landmarks = get_landmarks(frame_data)
        if landmarks is None:
            return {"prediction": "", "error": "No hands detected"}

        prediction_probs = model.predict(np.array([landmarks]), verbose=0)[0]
        max_index = np.argmax(prediction_probs)

        predicted_label = str(max_index)
        if labels and max_index < len(labels):
            predicted_label = labels[max_index]

        return {"prediction": predicted_label}
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}
