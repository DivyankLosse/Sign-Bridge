import cv2
import mediapipe as mp
import numpy as np
import os
import pickle

# Configuration
DATASET_DIR = "../datasets"
OUTPUT_FILE = "data.pickle"

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

def extract_landmarks_from_dataset():
    hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)
    
    data = []
    labels = []
    
    # Iterate through dataset directories (each dir is a class label)
    # Assumes structure: datasets/A/img1.jpg, datasets/B/img2.jpg ...
    for dir_path, dir_names, filenames in os.walk(DATASET_DIR):
        dir_name = os.path.basename(dir_path)
        if not filenames:
            continue
            
        print(f"Processing class: {dir_name}")
        
        for filename in filenames:
            if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
                
            img_path = os.path.join(dir_path, filename)
            img = cv2.imread(img_path)
            if img is None:
                continue
                
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = hands.process(img_rgb)
            
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # Extract 21 landmarks (x, y, z)
                    sample = []
                    for i in range(len(hand_landmarks.landmark)):
                        lm = hand_landmarks.landmark[i]
                        sample.extend([lm.x, lm.y, lm.z])
                    
                    data.append(sample)
                    labels.append(dir_name)

    # Save processed data
    with open(OUTPUT_FILE, 'wb') as f:
        pickle.dump({'data': np.array(data), 'labels': np.array(labels)}, f)
    
    print(f"Extraction complete. Data saved to {OUTPUT_FILE}")
    print(f"Total samples: {len(data)}")

if __name__ == "__main__":
    extract_landmarks_from_dataset()
