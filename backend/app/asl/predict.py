import base64

import cv2
import numpy as np

from app.config import settings

model = None
detector = None
labels = []


def load_model():
    global model, detector, labels

    model = None
    detector = None
    labels = []

    model_path = settings.SPELL_MODEL_PATH
    labels_path = settings.SPELL_LABELS_PATH
    task_path = str(settings.BASE_DIR / "app" / "models" / "hand_landmarker.task")

    print("Loading model from:", model_path)

    try:
        import tensorflow as tf

        model = tf.keras.models.load_model(model_path, compile=False)
        print("Model loaded successfully with TensorFlow")
    except Exception as tf_error:
        try:
            import keras

            model = keras.models.load_model(model_path, compile=False)
            print("Model loaded successfully with standalone Keras")
        except Exception as keras_error:
            print(
                "Failed to load ASL model. "
                f"TensorFlow error: {tf_error}. "
                f"Keras error: {keras_error}"
            )

    try:
        with open(labels_path, "r", encoding="utf-8") as handle:
            labels = [line.strip() for line in handle.readlines() if line.strip()]
        print(f"Loaded {len(labels)} labels")
    except Exception as labels_error:
        labels = []
        print(f"Failed to load ASL labels: {labels_error}")

    try:
        from mediapipe.tasks import python
        from mediapipe.tasks.python import vision

        base_options = python.BaseOptions(model_asset_path=task_path)
        options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=1)
        detector = vision.HandLandmarker.create_from_options(options)
        print("Mediapipe model loaded")
    except Exception as detector_error:
        detector = None
        print(f"Failed to load Mediapipe model: {detector_error}")


def get_landmarks(base64_string):
    global detector
    import mediapipe as mp

    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None or detector is None:
        return None

    frame_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
    results = detector.detect(mp_image)

    if not results.hand_landmarks:
        return None

    landmarks = []
    for lm in results.hand_landmarks[0]:
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
