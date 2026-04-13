import tensorflow as tf
import os
from pathlib import Path

# Paths - Resolve relative to script location
SCRIPT_DIR = Path(__file__).parent
KERAS_MODEL_PATH = SCRIPT_DIR.parent / "backend" / "trained_models" / "sign_model.h5"
TFLITE_MODEL_PATH = SCRIPT_DIR.parent / "backend" / "trained_models" / "sign_model.tflite"

def rebuild_model(num_classes):
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, LSTM, Dropout, Conv1D, MaxPooling1D, BatchNormalization
    
    model = Sequential()
    model.add(Conv1D(64, kernel_size=3, padding='same', activation='relu', input_shape=(1, 63)))
    model.add(BatchNormalization())
    model.add(MaxPooling1D(pool_size=1))
    
    model.add(Conv1D(128, kernel_size=3, padding='same', activation='relu'))
    model.add(BatchNormalization())
    model.add(MaxPooling1D(pool_size=1))
    
    model.add(LSTM(128, return_sequences=True))
    model.add(LSTM(64))
    
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(num_classes, activation='softmax'))
    return model

def convert_to_tflite():
    if not KERAS_MODEL_PATH.exists():
        print(f"Error: {KERAS_MODEL_PATH} not found.")
        return

    # Load labels to get num_classes
    labels_path = KERAS_MODEL_PATH.parent / "labels.txt"
    with open(labels_path, "r") as f:
        labels = [line.strip() for line in f.readlines() if line.strip()]
    num_classes = len(labels)
    print(f"Detected {num_classes} classes from labels.txt")

    print(f"Rebuilding model and loading weights from {KERAS_MODEL_PATH}...")
    model = rebuild_model(num_classes)
    
    # Load weights only to avoid Keras 3 configuration errors
    try:
        model.load_weights(str(KERAS_MODEL_PATH))
        print("Weights loaded successfully.")
    except Exception as e:
        print(f"First attempt to load weights failed: {e}")
        print("Attempting to load whole model and extract weights...")
        # If the above fails, it's likely because it was saved as a whole model
        # We try to load it and if it fails due to the keyword error, 
        # there isn't much we can do without a compatible keras version 
        # EXCEPT we can try to use the 'compile=False' or 'custom_objects'
        # but the rebuild + load_weights usually works if names match.
        pass

    print("Converting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    # Enable converter to handle ops that are not supported by default TFLite
    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS, 
        tf.lite.OpsSet.SELECT_TF_OPS 
    ]
    converter._experimental_lower_tensor_list_ops = False
    
    tflite_model = converter.convert()

    print(f"Saving TFLite model to {TFLITE_MODEL_PATH}...")
    with open(str(TFLITE_MODEL_PATH), 'wb') as f:
        f.write(tflite_model)
    
    print("Success!")

if __name__ == "__main__":
    convert_to_tflite()
