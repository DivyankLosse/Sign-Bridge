import pickle
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# Configuration
PICKLE_PATH = "ai_training/data.pickle"
MODEL_SAVE_PATH = "backend/trained_models/asl_39_model.h5"
LABELS_SAVE_PATH = "backend/trained_models/asl_39_labels.txt"
FEATURES_PER_FRAME = 63 # 21 landmarks * 3 (x,y,z)

def train():
    print(f"Loading ASL data from {PICKLE_PATH}...")
    with open(PICKLE_PATH, "rb") as f:
        data_dict = pickle.load(f)
    
    X = np.array(data_dict['data'])
    raw_labels = data_dict['labels']
    
    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(raw_labels)
    num_classes = len(le.classes_)
    
    # Save labels mapping
    with open(LABELS_SAVE_PATH, "w") as f:
        for label in le.classes_:
            f.write(label + "\n")
            
    y = to_categorical(y_encoded, num_classes=num_classes)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, shuffle=True, stratify=y_encoded)
    
    print(f"Training on {X_train.shape} samples, validating on {X_test.shape}")
    
    # Model architecture (Efficient Dense network for static frames)
    model = Sequential([
        Dense(128, activation='relu', input_shape=(FEATURES_PER_FRAME,)),
        BatchNormalization(),
        Dropout(0.2),
        
        Dense(256, activation='relu'),
        BatchNormalization(),
        Dropout(0.3),
        
        Dense(128, activation='relu'),
        BatchNormalization(),
        
        Dense(num_classes, activation='softmax')
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    # Callbacks
    early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    checkpoint = ModelCheckpoint(MODEL_SAVE_PATH, monitor='val_accuracy', save_best_only=True, mode='max')
    
    model.fit(
        X_train, y_train, 
        epochs=30, 
        batch_size=64, 
        validation_data=(X_test, y_test),
        callbacks=[early_stop, checkpoint]
    )
    
    print(f"ASL 39 Character Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train()
