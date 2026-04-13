import os
import json
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import pickle
from pathlib import Path

# Paths - Resolve relative to script location
SCRIPT_DIR = Path(__file__).parent
VIDEO_DIR = SCRIPT_DIR.parent / "Datasets" / "WLASL Dataset" / "videos"
JSON_PATH = SCRIPT_DIR.parent / "Datasets" / "WLASL Dataset" / "WLASL_v0.3.json"
OUTPUT_FILE = SCRIPT_DIR / "wlasl_data.pickle"
MODEL_PATH = SCRIPT_DIR.parent / "backend" / "app" / "models" / "hand_landmarker.task"

# MediaPipe Initialization (Tasks API)
base_options = python.BaseOptions(model_asset_path=str(MODEL_PATH))
options = vision.HandLandmarkerOptions(base_options=base_options,
                                       num_hands=1,
                                       min_hand_detection_confidence=0.5)
detector = vision.HandLandmarker.create_from_options(options)

def extract_landmarks_from_video(video_path):
    cap = cv2.VideoCapture(str(video_path))
    video_landmarks = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Convert to RGB and MediaPipe Image
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
        
        # Detect landmarks
        results = detector.detect(mp_image)
        
        if results.hand_landmarks:
            # results.hand_landmarks is a list of lists (fixed landmarks)
            hand_landmarks = results.hand_landmarks[0]
            flat_landmarks = []
            for lm in hand_landmarks:
                flat_landmarks.extend([lm.x, lm.y, lm.z])
            video_landmarks.append(flat_landmarks)
            
    cap.release()
    return video_landmarks

def main():
    print(f"Loading JSON from {JSON_PATH}...", flush=True)
    if not JSON_PATH.exists():
        print(f"Error: {JSON_PATH} not found.", flush=True)
        return
    
    if not MODEL_PATH.exists():
        print(f"Error: {MODEL_PATH} not found. Ensure hand_landmarker.task is in backend/app/models/", flush=True)
        return

    with open(JSON_PATH, 'r') as f:
        content = json.load(f)

    data = []
    labels = []
    
    print(f"Scanning {len(content)} glosses for existing videos...", flush=True)
    for entry in content:
        gloss = entry['gloss']
        
        for instance in entry['instances']:
            video_id = instance['video_id']
            video_path = VIDEO_DIR / f"{video_id}.mp4"
            
            if video_path.exists():
                print(f"Processing gloss: {gloss} (video: {video_id})", flush=True)
                landmarks_sequence = extract_landmarks_from_video(video_path)
                
                if landmarks_sequence:
                    data.append(landmarks_sequence)
                    labels.append(gloss)
            else:
                pass

    # Save to pickle
    with open(OUTPUT_FILE, 'wb') as f:
        pickle.dump({'data': data, 'labels': labels}, f)
    
    print(f"Done! Saved {len(data)} video sequences back into {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
