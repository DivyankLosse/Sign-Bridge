import pickle
import numpy as np
import os
from collections import Counter
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Conv1D, MaxPooling1D, BatchNormalization
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# Configuration
PICKLE_PATH = "ai_training/wlasl_data.pickle"
MODEL_SAVE_PATH = "backend/trained_models/wlasl_top100_model.h5"
LABELS_SAVE_PATH = "backend/trained_models/wlasl_labels.txt"
SEQUENCE_LENGTH = 20 # User requested snappy 20 frames
FEATURES_PER_FRAME = 63 # 21 landmarks * 3 (x,y,z)
TOP_N = 100

def pad_or_truncate(sequence, length):
    if len(sequence) >= length:
        return sequence[:length]
    else:
        padding = [[0] * FEATURES_PER_FRAME for _ in range(length - len(sequence))]
        return sequence + padding

def train():
    print(f"Loading WLASL data from {PICKLE_PATH}...")
    with open(PICKLE_PATH, "rb") as f:
        data_dict = pickle.load(f)
    
    raw_data = data_dict['data']
    raw_labels = data_dict['labels']
    
    # Filter to TOP_N
    print(f"Filtering to Top {TOP_N} most frequent signs...")
    counter = Counter(raw_labels)
    top_signs = [sign for sign, count in counter.most_common(TOP_N)]
    
    filtered_X = []
    filtered_y = []
    
    for seq, label in zip(raw_data, raw_labels):
        if label in top_signs:
            filtered_X.append(pad_or_truncate(seq, SEQUENCE_LENGTH))
            filtered_y.append(label)
    
    X = np.array(filtered_X)
    
    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(filtered_y)
    num_classes = len(le.classes_)
    
    # Save labels mapping
    with open(LABELS_SAVE_PATH, "w") as f:
        for label in le.classes_:
            f.write(label + "\n")
            
    y = to_categorical(y_encoded, num_classes=num_classes)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, shuffle=True, stratify=y_encoded)
    
    print(f"Training on {X_train.shape} samples, validating on {X_test.shape}")
    
    # Model architecture (Lightweight for real-time inference)
    model = Sequential([
        Conv1D(64, kernel_size=3, padding='same', activation='relu', input_shape=(SEQUENCE_LENGTH, FEATURES_PER_FRAME)),
        BatchNormalization(),
        MaxPooling1D(pool_size=1),
        
        Conv1D(128, kernel_size=3, padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling1D(pool_size=1),
        
        LSTM(128, return_sequences=True),
        LSTM(64),
        
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(num_classes, activation='softmax')
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    # Callbacks
    early_stop = EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True)
    checkpoint = ModelCheckpoint(MODEL_SAVE_PATH, monitor='val_accuracy', save_best_only=True, mode='max')
    
    model.fit(
        X_train, y_train, 
        epochs=50, 
        batch_size=32, 
        validation_data=(X_test, y_test),
        callbacks=[early_stop, checkpoint]
    )
    
    print(f"WLASL Top 100 Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train()
