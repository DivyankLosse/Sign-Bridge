import pickle
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout, Conv1D, MaxPooling1D, BatchNormalization, Flatten
from tensorflow.keras.utils import to_categorical

DATA_FILE = "data.pickle"
MODEL_SAVE_PATH = "../backend/trained_models/sign_model.h5"
LABELS_SAVE_PATH = "../backend/trained_models/labels.txt"

def train():
    # Load data
    try:
        data_dict = pickle.load(open(DATA_FILE, 'rb'))
    except FileNotFoundError:
        print(f"Data file {DATA_FILE} not found. Run extract_landmarks.py first.")
        return

    data = data_dict['data']
    labels = data_dict['labels']
    
    # Encode labels
    le = LabelEncoder()
    labels_encoded = le.fit_transform(labels)
    num_classes = len(le.classes_)
    
    # Save labels mapping
    with open(LABELS_SAVE_PATH, "w") as f:
        for label in le.classes_:
            f.write(label + "\n")
            
    # Reshape data for CNN/LSTM
    # Data is currently (N, 63). We treat it as a sequence of length 1?
    # Or reshape to (N, 21, 3) for Conv1D over landmarks? 
    # Or (N, 1, 63) for LSTM?
    # User specified CNN+LSTM. 
    # Let's try reshaping to (N, 21, 3) -> 21 points, 3 coords each.
    # But usually MediaPipe flat vector is used directly or reshaped.
    
    # Let's use the architecture from specs:
    # Input: (63) -> Reshape to (21, 3) ?? No, spec says "Input: (sequence_length, 63)"
    # But for static images, sequence_length = 1. 
    # If we want to support video sequences, we need video dataset.
    # Assuming we are training on static images for now (ASL/ISL datasets are usually images).
    # so we treat each image as a sequence of length 1.
    
    X = data.reshape(data.shape[0], 1, 63)
    y = to_categorical(labels_encoded, num_classes=num_classes)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=True, stratify=labels)
    
    # Model Definition
    model = Sequential()
    # Masking? No, fixed length.
    
    # Conv1D on the feature vector? 
    # If input is (1, 63), Conv1D with kernel size > 1 might fail if padding not same.
    # The spec architecture:
    # Conv1D(64) -> BatchNorm -> ReLU -> MaxPool
    # Conv1D(128) -> BatchNorm -> ReLU -> MaxPool
    # LSTM(128)
    
    # Since we have sequence length 1, Conv1D along time axis (1) with kernel > 1 requires padding='same'.
    
    model.add(Conv1D(64, kernel_size=3, padding='same', activation='relu', input_shape=(1, 63)))
    model.add(BatchNormalization())
    model.add(MaxPooling1D(pool_size=1)) # MaxPool of 1 does nothing but keeps dims compatible?
    
    model.add(Conv1D(128, kernel_size=3, padding='same', activation='relu'))
    model.add(BatchNormalization())
    model.add(MaxPooling1D(pool_size=1))
    
    model.add(LSTM(128, return_sequences=True))
    model.add(LSTM(64))
    
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(num_classes, activation='softmax'))
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    print(model.summary())
    
    model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test))
    
    model.save(MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train()
