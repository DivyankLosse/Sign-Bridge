import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import tensorflow as tf

def check_model(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    
    try:
        model = tf.keras.models.load_model(path, compile=False)
        print(f"Model: {os.path.basename(path)}")
        print(f"Input shape: {model.input_shape}")
        print(f"Output shape: {model.output_shape}")
        print("-" * 20)
    except Exception as e:
        print(f"Error loading {path}: {e}")

check_model(r"d:\Projects\Sign-Bridge\backend\trained_models\asl_39_model.h5")
check_model(r"d:\Projects\Sign-Bridge\backend\trained_models\sign_model.h5")
check_model(r"d:\Projects\Sign-Bridge\backend\trained_models\wlasl_top100_model.h5")
