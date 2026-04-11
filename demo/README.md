# Papago Sign - Sign Language Translation Platform

**Papago Sign** is a comprehensive web application design to bridge the communication gap between the hearing and the deaf/hard-of-hearing communities. It provides real-time translation capabilities, converting Sign Language to Text/Speech and vice versa.

## 🚀 Key Features

### 1. Sign Language Recognition (Sign-to-Text)
- Uses your computer's webcam to detect hand gestures in real-time.
- Translates recognized gestures into text and speech.
- Powered by advanced Computer Vision and Machine Learning models.

### 2. Text/Speech to Sign Language (Text-to-Sign)
- Accepts text or voice input from the user.
- Translates the input into a sequence of sign language animations/videos.
- Helps users learn how to sign specific phrases or communicate back to a signer.

### 3. User Accounts & History
- Secure Login and Signup functionality.
- Tracks translation history for learning and reference.
- User-specific settings and preferences.

### 4. Interactive Dashboard
- Modern, responsive User Interface.
- easy access to all translation tools.

---

## 🛠️ Technical Stack

This project is built as a monolithic application for this demo version, leveraging a powerful Python backend and a modern React-based frontend.

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High-performance web framework for APIs.
- **Language**: Python 3.x
- **Database**: SQLite (via SQLAlchemy & Alembic for migrations).
- **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib`.

### AI & Machine Learning
- **Computer Vision**: [MediaPipe](https://developers.google.com/mediapipe) (by Google) for efficient hand tracking and landmark detection.
- **Machine Learning**: [TensorFlow/Keras](https://www.tensorflow.org/) for gesture classification models.
- **Image Processing**: OpenCV (`cv2`) and NumPy.
- **NLP**: NLTK (Natural Language Toolkit) for text processing in the Text-to-Sign features.

### Frontend
- **Framework**: React (served as static files from the backend).
- **Styling**: Modern CSS/Tailwind (implied).
- **Architecture**: Single Page Application (SPA) structure.

---

## 📂 Project Structure

```
demo/
├── run_demo.bat            # One-click startup script for Windows
├── backend/                # Core application logic
│   ├── app/
│   │   ├── main.py         # Application entry point & configuration
│   │   ├── auth/           # Authentication routes & logic
│   │   ├── sign_recognition/ # ML logic for detecting signs
│   │   ├── text_to_sign/   # Logic for mapping text to animations
│   │   ├── history/        # User history management
│   │   ├── static_ui/      # Compiled Frontend assets (HTML/JS/CSS)
│   │   └── web/            # (Internal) API routers
│   ├── trained_models/     # Stores .h5/.keras models for prediction
│   ├── static/             # Stores sign language animation videos/images
│   ├── requirements.txt    # Python dependencies
│   ├── init_db.py          # Database initialization script
│   └── papago.db           # SQLite Database file
└── ...
```

---

## 🏗️ How It Works

### Sign Recognition System
1.  **Input**: Video stream from the webcam.
2.  **Processing**: 
    - **MediaPipe** extracts Hand Landmarks (21 points per hand) in real-time.
    - These coordinates are normalized and processed.
3.  **Inference**:
    - The processed landmarks are fed into a **TensorFlow/Keras model** (`trained_models/`).
    - The model predicts the probability of each sign class (e.g., "Hello", "Thank you", "A", "B").
4.  **Output**: The class with the highest confidence is returned via API and displayed on the UI.

### Text-to-Sign System
1.  **Input**: User types text or speaks (converted to text via Web Speech API).
2.  **Processing**:
    - The backend (`app/text_to_sign`) tokenizes the sentence using **NLTK**.
    - It removes stop words and normalizes the text (lemmatization).
3.  **Mapping**:
    - The system looks up each word in its database of animations (`app/text_to_sign/mapper.py`).
    - If a direct match is found, that animation is queued.
    - If not found, it may finger-spell the word (letter by letter).
4.  **Output**: A sequence of video URLs is returned to the frontend to play in order.

---

## ⚡ Quick Start Guide

Prerequisite: **Python 3.10+** must be installed and added to your system PATH.

### Automatic Setup (Recommended)
1.  Double-click **`run_demo.bat`** inside the `demo` folder.
2.  The script will:
    - Create a virtual environment (`venv`).
    - Install all necessary dependencies.
    - Initialize the database.
    - Start the server.
3.  Open your browser and navigate to **`http://localhost:8000`**.

### Manual Setup
If you prefer to run it manually via terminal:

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Initialize the database:
    ```bash
    python init_db.py
    ```
5.  Start the server:
    ```bash
    uvicorn app.main:app --reload
    ```

---

## ℹ️ Troubleshooting

- **Python not found**: Ensure Python is installed and added to your Environment Variables.
- **Model loading error**: Ensure `trained_models` folder contains the `.h5` or `.tflite` model files.
- **Database error**: Delete `papago.db` and run `python init_db.py` again to reset.
